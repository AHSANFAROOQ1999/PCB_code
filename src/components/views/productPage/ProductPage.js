
import React from 'react'
// import ProTabs from '../homepage/sections/ProTabs'
import CollectionSlider from '../../views/homepage/sections/CollectionSlider'
import { Tab, Input, Button, Loader, Icon } from 'semantic-ui-react'
// import proImage from '../assets/img/proImage.png'
// import proImageLarge from '../assets/img/proImageLarge.png'
// import whatsappIcon from '../../../assets/svg/whatsappIcon.svg'
// import whatsapp from '../../../assets/svg/whatsaap.svg'
// import tic from '../../../assets/svg/tic.svg'
import facebookIcon from '../../../assets/svg/fbIconDark.svg'
// import instaIcon from '.../../../assets/svg/instaIconDark.svg'
import linkedinIcon from '../../../assets/svg/linkIconDark.svg'
// import twitterIcon from '../../../assets/svg/twitter.svg'
// import youtubeIconDark from '.../../../assets/svg/youtubeIconDark.svg'
// import deliveryIcon from '../../../assets/svg/deliveryIcon.svg'
import Axios from 'axios'
import Slider from "react-slick"
import arrowLeft from '../../../assets/svg/arrowLeft.svg'
import arrowRight from '../../../assets/svg/arrowRight.svg'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import defaultImage from '../../../assets/img/productImagePlaceholder.png';
import { isMobile } from 'react-device-detect';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
// import { FacebookShareCount } from "react-share";
import { setVisitedProducts
  //  fetchVisitedProducts 
} from '../../../services/context'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Add_to_cart, Update_minicart } from '../../../redux/slices/cartSlice'

import SizeChartModal from '../../shared/sizeChart/sizeChartModal/sizeChartModal'
import SizeImg from '../../../assets/svg/sizeChartIcon.svg'
// import Money from '../../shared/Money'

class ProductPage extends React.Component {
  // activeindex for tabs
  state = { activeIndex: 1 };

  constructor(props) {
    super(props);

    this.state = {
      handle: this.props.handle,
      product: {},
      selected_variant: {},
      showSoldout: false,
      wishListStatus: 'Add to',
      wishListStyle: 'outline',
      inWishlist: false,

      settings: {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        arrows: true,
        nextArrow: <img src={arrowRight} alt="" />,
        prevArrow: <img src={arrowLeft} alt="" />,
        beforeChange: function (currentslide, nextSlide) {
          // console.log("before change", currentslide, nextSlide);
        },
        afterChange: (currentslide) => {
          // console.log("after change", currentslide);
          this.setState({
            activeIndex: currentslide
          })
        }
      },

      panes: [],
      thumbnailsImages: [],
      visitedProducts: [],
      sizeChartModal: [],
      country: this.props?.country
    }
  }

  fetchProduct = () => {
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/product/' + this.state?.handle +
      '?country=' +
      this.state?.country)
      .then((response) => {

        setVisitedProducts(response.data.category)

        // console.log('Product Page Response: ', response)
        let panes = [], thumbnailsImages = []

        this.setState({
          relatedProducts: {
            title: 'Related Products',
            products: response.data.related_products
          },
          sizeChartModal: response.data.sizechart,
        })

        if (response.data.images) {
          let count = 0
          if (response.data.images.length) {
            response.data.images.map((pro) => {
              panes.push({
                render: () => <Tab.Pane>
                  {
                    pro.cdn_link.includes('.mp4') ?
                      <video width="100%" height="100%" autoPlay={true} loop muted>
                        <source src={pro.cdn_link} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      : <InnerImageZoom className="product-img" moveType={'pan'} zoomType={'hover'} src={pro.cdn_link} alt={count} />
                  }
                  {/* <img className='img-zoomable' src={pro.cdn_link} alt={count} /> */}
                  {/* <InnerImageZoom className="product-img" moveType={'pan'}	 zoomType={'hover'} src={pro.cdn_link} alt={count}/> */}
                </Tab.Pane>
              })
              if (isMobile) {
                thumbnailsImages.push(
                  <div >
                    {
                      pro.cdn_link.includes('.mp4') ?
                        <>
                          <video width="100%" height="100%" autoPlay={true} loop muted>
                            <source src={pro.cdn_link} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </>
                        : <InnerImageZoom className="pro-thumbnail-img" zoomType={'hover'} value={count} src={pro.cdn_link} alt={count} />

                    }
                    {/* <img className='pro-thumbnail-img' onClick={this.changeMainImage}  src={pro.cdn_link} alt="" /> */}
                  </div>
                )
              }
              else {
                thumbnailsImages.push(
                  <div>
                    {
                      pro.cdn_link.includes('.mp4') ?
                        <Icon onClick={this.changeMainImage} value={count} className="video-thumbnail" name="video play"></Icon>
                        : <img className=' pro-thumbnail-img' onClick={this.changeMainImage} value={count} src={pro.cdn_link} alt="" />
                    }
                  </div>
                )
              }
              count++
            })
          }
          else {
            panes.push({ render: () => <Tab.Pane><img className="" src={defaultImage} alt="" /></Tab.Pane> })
            thumbnailsImages.push(<div ><img className='pro-thumbnail-img' src={defaultImage} alt="" /></div>)
          }
        }

        this.setState({
          product: response?.data,
          panes: panes,
          thumbnailsImages: thumbnailsImages
        })

        let variants = response?.data?.variants

        for (let i = 0; i < variants.length; i++) {
          // debugger
          if (variants[i].variant_detail?.inventory > 0) {
            this.setState({
              selected_variant: variants[i]
            })
            break
          }
        }

        this.isInWishlist()

        // if soldout
        if (this.state?.product.sold_out) {
          this.setState({
            selected_variant: variants[0]
          })
        }
        else {

          // // active class for selected variant options

          let allSwatches = document.querySelectorAll('.swatch')
          for (let i = 0; i < allSwatches.length; i++) {
            const swatch = allSwatches[i];
            swatch.classList.remove('active')
          }

          let option1, option2, option3
          option1 = this.state.selected_variant?.option1
          option2 = this.state.selected_variant?.option2
          option3 = this.state.selected_variant?.option3

          if (option1 != null) {
            document.querySelector('.swatch[value="' + option1.toLowerCase().replace(/\s+/g, '') + '"]').classList.add('active')
          }

          if (option2 != null) {
            document.querySelector('.swatch[value="' + option2.toLowerCase().replace(/\s+/g, '') + '"]').classList.add('active')
          }

          if (option3 != null) {
            document.querySelector('.swatch[value="' + option3.toLowerCase().replace(/\s+/g, '') + '"]').classList.add('active')
          }

        }


      })
      .catch(function (error) {
        // console.log(error);
        // window.location.href= '/404'
      });
  }

  componentDidMount() {
    // debugger
    // window.fbq('track', 'ViewContent')
    document.querySelector('body').scrollTo(0, 0)
    this.fetchProduct()

    localStorage.setItem('wishList', JSON.stringify([]));

    // let visited_products = fetchVisitedProducts()
    // if (visited_products) {
    //   visited_products.then((result) => {
    //     // console.log('v-p product page', result)
    //     this.setState({ visitedProducts: result })
    //   })
    // }

  }

  componentDidUpdate() {
    // debugger

    if (this.props.handle !== this.state.handle) {
      this.setState({ handle: this.props.handle }, () => this.fetchProduct())
      document.querySelector('body').scrollTo({ top: 0, behavior: 'smooth' })
    }

    // debugger
    if (this.state?.country !== this.props?.country) {
      // debugger

      this.setState({
        product: {},
        country: this.props?.country
      }, () => {
        this.fetchProduct()
      })
    }


  }

  handleRangeChange = (e) => {
    this.setState({ activeIndex: e.target.parentElement.value })
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

  quantityIncreament = () => {
    let quantity = document.getElementById('quantity')
    let selected_variant = this.state.selected_variant
    if (parseInt(quantity.value) < selected_variant?.variant_detail?.inventory) {
      quantity.value = parseInt(quantity.value) + 1
    }
  }

  quantityDecreament = () => {
    let quantity = document.getElementById('quantity')
    if (parseInt(quantity.value) > 1)
      quantity.value = parseInt(quantity.value) - 1
  }

  changeMainImage = (e) => {
    this.setState({ activeIndex: e.target.getAttribute('value') })
  }

  changeSelectedVariant = (ele) => {
    debugger

    let swatch = ele.target.closest('.swatch')
    let currentSwatchOption = swatch.getAttribute('option')
    let currentOptionSwatches = document.querySelectorAll('[option=' + currentSwatchOption + ']')
    //change active classes
    for (let index = 0; index < currentOptionSwatches.length; index++) {
      currentOptionSwatches[index].classList.remove('active')
    }
    // let val = swatch.getAttribute('value')
    swatch.classList.add('active')

    // change selected variant
    let optionsTitle = ''
    let selectedOptions = document.querySelectorAll('.swatch.active')
    // let option1 = null, option2 = null, option3 = null, optionTitle, optionValue

    // debugger

    for (let i = 0; i < selectedOptions.length; i++) {
      // optionsTitle += selectedOptions[i].getAttribute('value') + '/';
      optionsTitle += selectedOptions[i].getAttribute('value');
    }

    // optionsTitle = optionsTitle.substring(0, optionsTitle.length - 1)

    let variantExist = false

    this.state.product?.variants.map((variant) => {
      // debugger
      if (variant.title.toLowerCase().replace(/\s+/g, '') === optionsTitle) {

        variantExist = true
        this.setState({
          selected_variant: variant,
          showSoldout: false
        })
      }
    })

    if (variantExist === false) {
      this.setState({ showSoldout: true })
    }

  }

  addToCart = () => {
    // debugger

    //getting and setting add to cart event from window.fbq
    // window.fbq('track', 'Add to Cart',
    //   {
    //     products: this.state.selected_variant.sku,
    //     variantTitle: this.state.selected_variant.title,
    //     quantity: document.getElementById('quantity').value,
    //     variantId: this.state.selected_variant.id,
    //     variantPrice: this.state.selected_variant.price.original_price,
    //   });
    //  console.log(window);
    // console.log(this.state.selected_variant);

    let product = this.state.product


    // GA UA -------------------------------
    window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    window.dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'currencyCode': 'PKR',
        'add': {                                // 'add' actionFieldObject measures.
          'products': [{                        //  adding a product to a shopping cart.
            'name': product?.title,
            'id': '12345',
            'price': this.state.selected_variant?.variant_detail?.original_price,
            'brand': product?.brand,
            'vendor_name': product?.vendor_name,
            'category': 'Apparel',
            'variant': this.state.selected_variant?.title,
            'quantity': this.state.selected_variant?.variant_detail?.inventory
          }]
        }
      }
    });
    // GA UA end ----------------------------


    let productImg = product.images.length ? product.images[0].cdn_link : null

    let productDetail = {
      title: product?.title,
      brand: product?.brand,
      variantId: this.state.selected_variant?.id,

      image: productImg,
      quantity: document.getElementById('quantity').value,
      variantPrice: this.state.selected_variant?.variant_detail?.original_price,
      variantTitle: this.state.selected_variant?.title,
      productHandle: this.state.handle,
      inventoryQuantity: this.state.selected_variant?.variant_detail?.inventory,
      vendor_id: product?.vendor_id
    }


    if (localStorage.getItem('cart')) {
      //update variant in cart

      let cart = JSON.parse(localStorage.getItem('cart'))
      // console.log(cart)
      let variantFound = false

      // for (let i = 0; i < cart.length; i++) {
      //   if (cart[i].varId == this.state.selected_variant.id) {
      //     let updateQuantity = parseInt(cart[i].detail.quantity) + parseInt(productDetail.quantity)
      //     variantFound = true
      //     cart[i].detail.quantity = updateQuantity
      //   }
      // }
      // if (variantFound == false) {
      //   // create new lineitem in cart

      //   cart.push({
      //     varId: productDetail.variantId,
      //     detail: productDetail
      //   })

      // }
      // localStorage.setItem('cart', JSON.stringify(cart))

      this.props.dispatch(Add_to_cart([
        {
          varId: productDetail.variantId,
          detail: productDetail
        }])
      )
      this.props.dispatch(Update_minicart())
    }
    else {
      let cart = [{
        varId: productDetail.variantId,
        detail: productDetail
      }]
      // localStorage.setItem('cart', JSON.stringify(cart))

      this.props.dispatch(Add_to_cart(cart))
      this.props.dispatch(Update_minicart())

    }

    document.querySelector('.pro-added-to-cart').classList.add('show')

    let cartTotal = parseInt(localStorage.getItem('cartTotal'))

    if (cartTotal) {
      let varPrice = parseInt(productDetail.quantity) * parseInt(productDetail.variantPrice.original_price)
      localStorage.setItem('cartTotal', cartTotal + varPrice)
    }
    else {
      localStorage.setItem('cartTotal', parseInt(productDetail.quantity) * parseInt(productDetail.variantPrice.original_price))
    }

    this.updateMiniCart()

    setTimeout(() => {
      if (document.querySelector('.pro-added-to-cart')) {
        document.querySelector('.pro-added-to-cart').classList.remove('show')
      }
    }, 3000)
  }

  buyItNow = () => {
    this.addToCart()
    // window.location.href = '/cart'
  }

  updateMiniCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart'))
    let totalprice = 0
    let totalCount = 0

    for (let i = 0; i < cart.length; i++) {
      const lineitem = cart[i];
      totalCount += parseInt(lineitem.detail.quantity)
      totalprice += lineitem.detail.variantPrice.original_price * lineitem.detail.quantity
    }

    let quant = document.querySelector('.cart-total-quantity')
    if (quant) {
      document.querySelector('.cart-total-quantity').innerHTML = totalCount
    }
    // document.querySelector('.cart-count').innerHTML = totalCount
    let count = document.querySelector('.cart-count')
    if (count) {
      document.querySelector('.cart-count').innerHTML = totalCount
    }

  }

  postWishList = (variant_id) => {
    Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist', variant_id, {
      headers: {
        "pushpa": sessionStorage.getItem('pcb-customer-token')
      }
    })
      .then((response) => {
        this.setState({ wishListStatus: "Remove from" })
      })
  }

  deleteWishList = (variantID) => {
    let doesExist = false;
    let i = 0;
    let wishlist = JSON.parse(localStorage.getItem("wishList"));
    if (localStorage.getItem("wishList")) {
      for (i; i < wishlist.length; i++) {
        if (wishlist[i].variant_id === variantID) {
          doesExist = true
          break
        }
      }
    }

    Axios.delete(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist?variiant_id=' + variantID, {
      headers: {
        "pushpa": sessionStorage.getItem('pcb-customer-token')
      }
    })
      .then((response) => {
        if (doesExist) {
          wishlist.splice(i, 1);
          localStorage.setItem('wishList', JSON.stringify(wishlist));
          this.setState({ wishListStatus: "Add to" });
          this.setState({
            wishListStyle: "outline"
          })

        }
      })
  }

  addToWishList = () => {
    // debugger
    let product = this.state.product;

    if (sessionStorage.getItem('pcb-customer-token')) {
      let variant_id = { variant_id: this.state.selected_variant.id };

      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product.images.length ? product.images[0].cdn_link : null

      let productDetail = {
        title: product.title,
        variant_id: this.state.selected_variant.id,
        image: productImg,
        product_handle: this.state.handle,
        variant_price: this.state.selected_variant.variant_detail.original_price,
        vendor_id: product.vendor_id,
        sku: this.state.selected_variant.sku,
      }

      singleProductDetail.push(productDetail);

      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj.length; i++) {
          if (wishlistObj[i].variant_id === productDetail.variant_id) {
            this.doesExist = true
            break
          }
        }
        if (!this.doesExist) {
          wishlistObj.push(productDetail);
          this.postWishList(variant_id);
          this.setState({
            wishListStyle: ""
          })
        } else {
          this.doesExist = false;
          wishlistObj.splice(i, 1);
          this.deleteWishList(this.state.selected_variant.id);
          this.setState({
            wishListStyle: "outline"
          })
        }
        localStorage.setItem('wishList', JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail));
      }

    } else {
      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))

      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product.images.length ? product.images[0].cdn_link : null

      // debugger

      let productDetail = {
        title: product.title,
        variant_id: this.state.selected_variant.id,
        image: productImg,
        product_handle: this.state.handle,
        variant_price: this.state.selected_variant.variant_detail.original_price,
        vendor_id: product.vendor_id,
        sku: this.state.selected_variant.sku,
      }

      // debugger

      singleProductDetail.push(productDetail);

      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj.length; i++) {
          if (wishlistObj[i].variant_id === productDetail.variant_id) {
            this.doesExist = true
            break
          }
        }

        if (!this.doesExist) {
          wishlistObj.push(productDetail)
          this.setState({ wishListStatus: "Remove from" })
          this.setState({
            wishListStyle: ""
          })
        } else {
          this.doesExist = false;
          wishlistObj.splice(i, 1);
          this.setState({ wishListStatus: "Add to" })
          this.setState({
            wishListStyle: "outline"
          })
        }

        localStorage.setItem('wishList', JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail));
      }
    }

  }

  isInWishlist = () => {
    let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
    let i = 0;

    for (i; i < wishlistObj.length; i++) {
      if (wishlistObj[i].variant_id === this.state.product.variants[0].id) {
        this.setState({ inWishlist: true })
        break
      }
    }

    if (this.state.inWishlist) {
      this.setState({ wishListStatus: "Remove from" })
      this.setState({
        wishListStyle: ""
      })
    } else {
      this.setState({ wishListStatus: "Add to" })
      this.setState({
        wishListStyle: "outline"
      })
    }
  }

  render() {
    //slick slider settings
    const { activeIndex, product, selected_variant, panes, thumbnailsImages } = this.state
    let relatedProducts = {
      title: "RELATED PRODUCTS",
      products: product.related_products
    }
    let visitedProducts = {
      title: "RECOMENDED FOR YOU",
      products: this.state.visitedProducts
    }
    const productMobileSettings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    };

    return (
      <div className='product-page-wrapper'>
        <div className="container-xl">
          <div className="product-page">
            {
              this.state.product?.title ?
                <>
                  {/* <div className="breadcrumbs">
                    <p>Home / Product / <span>{this.state.product.title}</span></p>
                  </div> */}

                  <div className="pro-upper-wrapper">
                    <div className="product-images">
                      <div className="pro-thumbnails">
                        <div>
                          <Slider {...this.state.settings}>
                            {
                              thumbnailsImages ?
                                thumbnailsImages
                                :
                                null
                            }
                          </Slider>
                        </div>
                      </div>
                      <Tab
                        className="pro-main-image"
                        panes={panes}
                        activeIndex={activeIndex}
                        onTabChange={this.handleTabChange}
                      />
                      <div className="pro-image-mobile">
                        <Slider {...productMobileSettings}>
                          {
                            thumbnailsImages ?
                              thumbnailsImages
                              :
                              null
                          }
                        </Slider>
                      </div>
                    </div>

                    <div className="product-details">
                      <div className="product-details-inner">
                        <div className="pro-detail-wrapper">

                          {/* <div className="breadcrumbs">
                            <p>Home / Product / <span>{this.state.product.title}</span></p>
                             </div> */}

                          <h2 className="pro-title">{product.title}</h2>

                          {/* <div className="k-row"> */}

                          <div className="pro-sku k-row">
                            <h5>SKU</h5>
                            <p>{selected_variant ? selected_variant.sku : null}</p>
                          </div>

                          {
                            product.warranty ?
                              <div className="pro-warranty k-row">
                                <h5>Warranty</h5>
                                <p>{product.warranty}</p>
                              </div>
                              : null
                          }

                          {/* </div> */}

                          {
                            product.brand ?
                              <div className="pro-brand k-row">
                                <h5>Brand</h5>
                                <p>{product.brand}</p>
                              </div> : null
                          }

                          {/* {
                            product.vendor_key ?
                              <div className="pro-brand k-row">
                                <h5>Vendor</h5>
                                <Link to={'/vendor/' + `${product.vendor_key}`}>
                                  <p>{product.vendor_name}</p>
                                </Link>
                              </div> : null
                          } */}

                          {/* <div className="pro-brand k-row">
                      <h5>Category</h5>
                      <p>{product.category}</p>
                    </div> */}

                          {/* <div className="pro-category k-row-simple">
                    <h5>Category</h5>
                    <p>Personal Care</p>
                  </div> */}

                          <div className="price-and-whatsapp">
                            <div className="pro-price k-row">
                              <h5>Price</h5>
                              {
                                selected_variant?.variant_detail ?
                                  <p>
                                    {selected_variant?.variant_detail?.original_price < selected_variant?.variant_detail?.compare_price ?
                                      <>
                                        <span className="compare-at-price">{product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {selected_variant?.variant_detail?.compare_price}</span>
                                        <span className="original-price">{product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {selected_variant?.variant_detail?.original_price}</span>
                                      </>
                                      :
                                      <>
                                        <span className="">{product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {selected_variant?.variant_detail?.original_price} </span>
                                      </>
                                    }
                                  </p>
                                  :
                                  null
                              }
                            </div>
                            {/* {
                              product.whatsapp ?
                                <div className="order-by-whatsapp k-row-simple">
                                  <h5>Order by:</h5>
                                  <a href="https://wa.me/+97466605252"><p>Whatsapp</p></a>
                                  <a href="https://wa.me/+97466605252"><img src={whatsappIcon} alt="" /></a>
                                </div> : null
                            } */}
                          </div>

                          <br></br>

                          <div className="k-row quantity-picker-wrapper">

                            <h5>Quantity</h5>

                            <div className='space'>

                              <Input id='quantity' className="quantity-picker" max='5' type='number' placeholder='1' value="1">
                                <Button icon="minus" onClick={this.quantityDecreament} basic />
                                <input max='5' />
                                <Button icon="plus" onClick={this.quantityIncreament} basic />
                              </Input>

                              {/* {
                                product.whatsapp ?
                                  <div className="order-by-whatsapp">
                                    <h5>Order by:</h5>
                                    <a href="https://wa.me/+92000000000"><p>Whatsapp</p></a>
                                    <a href="https://wa.me/+92000000000"><img src={whatsappIcon} alt="" /></a>
                                  </div> : null
                              } */}
                            </div>

                            {/* <div className="pro-rating k-row">
                                <Rating maxRating={5} clearable />
                                <p className="pro-reviews">Reviews 0</p>
                              </div> 
                            */}

                            {/* <div>
                              {
                              product.whatsapp ?
                                <div className="order-by-whatsapp">
                                  <h5>Order by:</h5>
                                  <a href="https://wa.me/+97466605252"><p>Whatsapp</p></a>
                                  <a href="https://wa.me/+97466605252"><img src={whatsappIcon} alt="" /></a>
                                </div> : null
                            }
                            </div> */}

                          </div>

                          {/* <div>
                            {
                              product.whatsapp ?
                                <div className="order-by-whatsapp">
                                  <h5>Order by:</h5>
                                  <a href="https://wa.me/+97466605252"><p>Whatsapp</p></a>
                                  <a href="https://wa.me/+97466605252"><img src={whatsappIcon} alt="" /></a>
                                </div> : null
                            }
                          </div> */}


                          <div className="swatch-delivery-wrapper">
                            <div className="pro-var-swatch">
                              {
                                product.id ?
                                  product.options.map((opt, index) => {
                                    index++
                                    return <>
                                      <div className={"swatch-option-wrap swatch-option-" + index}>
                                        <h5>{opt.name}</h5>
                                        <div className="swatch-options k-row">
                                          {
                                            opt.values.split(',').reverse().map((val) => {
                                              return <>
                                                <div onClick={this.changeSelectedVariant} className='swatch' option={'option' + index} value={val.toLowerCase().replace(/\s+/g, '')}>
                                                  <p>{val}</p>
                                                </div>
                                              </>
                                            })
                                          }

                                        </div>
                                      </div>
                                    </>

                                  })
                                  : null
                              }
                            </div>

                            {/* <div className="k-row delivery-wrapper" >

                              {
                                product.cod_available ?
                                  <div className='k-row cod-availability'>
                                    <img src={tic} alt="" />
                                    <p>COD Available</p>
                                  </div>
                                  : null
                              }

                              {
                                product.tat ?
                                  <div className='k-row deivery-time'>
                                    <img src={deliveryIcon} alt="" />
                                    <p>{product.tat + " Days"}</p>
                                  </div>
                                  : null
                              }
                            </div> */}

                          </div>

                          {
                            this.state.sizeChartModal?.length ?
                              <>
                                <div className='size_chartt'>
                                  <img src={SizeImg} width='18px' />
                                  <SizeChartModal sizeChart={this.state.sizeChartModal} />
                                </div>
                              </>
                              : null
                          }

                          {/* <div className='size_chartt'>
                            <img src={SizeImg} width='18px' />
                            <SizeChartModal sizeChart={this.state.sizeChartModal} />
                          </div> */}

                          <div className='k-row wish-list-button' onClick={this.addToWishList}>
                            <Button basic icon >
                              <Icon color='black' name={`heart ${this.state?.wishListStyle}`} />
                            </Button>
                            <p className='wishListStatus'>{this.state?.wishListStatus}  wishlist</p>
                          </div>

                          <div className='k-row add-to-cart-wrapper'>
                            {
                              this.state?.showSoldout ?
                                <> <Button className="add-to-cart" basic onClick={this.addToCart} disabled > Sold Out</Button>
                                  <Button className="buy-it-now" onClick={this.buyItNow} basic disabled>Buy It Now</Button></>

                                : (this.state?.selected_variant?.id && this.state?.selected_variant?.variant_detail?.inventory > 0) ?
                                  <> <Button id="AddToCart" className="add-to-cart" basic onClick={this.addToCart} > Add to Cart</Button>
                                    <Link to='/cart' ><Button className="buy-it-now" onClick={this.buyItNow} basic>Buy It Now</Button></Link>
                                  </>

                                  : <> <Button className="add-to-cart" basic onClick={this.addToCart} disabled > Sold Out</Button>
                                    <Button className="buy-it-now" onClick={this.buyItNow} basic disabled>Buy It Now</Button></>

                            }
                          </div>
                          <p className='pro-added-to-cart'>Product added to cart</p>

                        </div>

                        {/* tabs */}

                        <div className='pro-detail-tabs'>
                          {/* {product.title ? <ProTabs product={product} /> : null} */}
                        </div>

                        {/* share */}
                        <div className='share-pro-wrapper'>
                          Share this:
                          <FacebookShareButton url={"https://shop.pcb.com.pk/product/" + product.handle} quote={"PCB | Official Merchandise"} hashtag="#shop.pcb.com.pk" >
                            <img src={facebookIcon} alt="facebook icon" /> |
                          </ FacebookShareButton>
                          <TwitterShareButton url={"https://shop.pcb.com.pk/product/" + product.handle} quote={"PCB | Official Merchandise"} hashtag="#shop.pcb.com.pk" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <g clip-path="url(#clip0)">
                                <path d="M0 3.56291C0 3.48792 0 3.41321 0 3.33822C0.133134 3.08375 0.319375 3.07196 0.536452 3.17616C0.586377 3.20003 0.640463 3.23009 0.705072 3.22054C0.516628 2.76918 0.435867 2.30435 0.487995 1.81086C0.527641 1.43534 0.639484 1.09381 0.832087 0.788507C0.967669 0.573924 1.21069 0.584036 1.33819 0.806482C1.37025 0.862375 1.39693 0.922762 1.42703 0.980339C2.16416 2.39142 3.22263 3.2534 4.65406 3.47809C4.77178 3.49663 4.77104 3.49691 4.77006 3.36097C4.76419 2.51949 4.99717 1.78727 5.51478 1.18032C6.11731 0.473374 7.11631 0.262442 7.89382 0.691046C7.97042 0.733176 8.02695 0.730087 8.10062 0.687676C8.46869 0.474778 8.83995 0.269183 9.20925 0.0593755C9.31718 -0.00185362 9.4251 -0.0257273 9.53474 0.0464556C9.67889 0.141389 9.72245 0.332098 9.64096 0.524773C9.50611 0.843557 9.3671 1.16009 9.23128 1.47804C9.21659 1.51258 9.18771 1.54348 9.20044 1.59488C9.33676 1.58224 9.47332 1.5755 9.60841 1.55584C9.74888 1.53533 9.87076 1.56511 9.95152 1.70638C10.0357 1.85412 10.0002 1.9968 9.92289 2.13611C9.78853 2.3785 9.65882 2.62454 9.52544 2.86805C9.50195 2.91102 9.48824 2.95175 9.49583 3.00399C9.5274 3.22559 9.54478 3.44888 9.55946 3.67301C9.61379 4.51365 9.51125 5.32788 9.26138 6.11881C9.03231 6.84373 8.68455 7.48803 8.24697 8.06915C7.94546 8.46967 7.61115 8.82833 7.21689 9.10864C6.40512 9.68554 5.50915 9.92624 4.56865 9.98747C4.11957 10.0167 3.67097 10.0015 3.22385 9.94338C2.46176 9.84451 1.71948 9.65268 1.01025 9.31171C0.758178 9.19037 0.515649 9.04601 0.31497 8.82468C0.256723 8.76065 0.216587 8.6865 0.210469 8.59156C0.196275 8.36715 0.330877 8.21211 0.54673 8.21632C0.956901 8.22419 1.36658 8.22924 1.77259 8.1447C2.19059 8.05763 2.57213 7.87591 2.91475 7.56387C2.88123 7.55263 2.85675 7.54365 2.83228 7.53606C2.14679 7.31951 1.51195 6.99483 0.999239 6.4067C0.910402 6.30474 0.856561 6.19239 0.88911 6.04578C0.922393 5.89636 1.01343 5.81828 1.14143 5.78345C1.23247 5.75845 1.3262 5.73964 1.41626 5.68796C1.4028 5.67672 1.39791 5.67195 1.39252 5.6683C1.34749 5.6388 1.30197 5.60988 1.25719 5.5801C0.712903 5.2175 0.328185 4.70295 0.116982 4.01792C0.0707274 3.86822 0.0614276 3.70672 0 3.56291Z" fill="#7C7C7C" />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect width="10" height="10" fill="white" />
                                </clipPath>
                              </defs>
                            </svg> |
                          </ TwitterShareButton>
                          <LinkedinShareButton url={"https://shop.pcb.com.pk/product/" + product.handle} quote={"PCB | Official Merchandise"} hashtag="#shop.pcb.com.pk" >
                            <img src={linkedinIcon} alt="linkedin icon" /> |
                          </ LinkedinShareButton >
                          < WhatsappShareButton url={"https://shop.pcb.com.pk/product/" + product.handle} quote={"PCB | Official Merchandise"} hashtag="#shop.pcb.com.pk" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <g clip-path="url(#clip0)">
                                <path d="M0 10.0001C0.229641 9.16199 0.453143 8.34382 0.679636 7.52659C0.696792 7.46468 0.693644 7.41672 0.66248 7.36045C-0.675386 4.94278 0.217207 1.9085 2.65559 0.600367C3.59005 0.0989643 4.59219 -0.105578 5.64328 0.0522565C7.71193 0.36291 9.09686 1.52731 9.76186 3.4928C10.4001 5.37929 9.71842 7.55261 8.15831 8.79992C7.20701 9.56041 6.12255 9.93768 4.90304 9.91605C4.12519 9.90226 3.39031 9.71057 2.7017 9.34803C2.65574 9.32374 2.61435 9.32061 2.56304 9.33409C1.74631 9.54913 0.928951 9.76167 0.111909 9.97467C0.0796424 9.98298 0.046904 9.9894 0 10.0001ZM1.19385 8.82532C1.22249 8.81858 1.23839 8.81513 1.25397 8.8109C1.70775 8.69225 2.16215 8.57595 2.61466 8.4526C2.71634 8.42485 2.79504 8.43927 2.88649 8.49147C4.16454 9.21982 5.48745 9.30195 6.81257 8.66435C8.93065 7.64508 9.75887 5.14214 8.68071 3.06099C7.86146 1.47935 6.14694 0.618705 4.37215 0.892996C3.5721 1.01666 2.86429 1.34973 2.26414 1.89267C1.38257 2.6903 0.917147 3.68527 0.883779 4.87318C0.860012 5.71847 1.08934 6.49589 1.54815 7.20606C1.59238 7.27456 1.60607 7.33333 1.5823 7.4164C1.44977 7.87894 1.32559 8.34382 1.19385 8.82532Z" fill="#7C7C7C" />
                                <path d="M3.40475 2.6795C3.62762 2.62041 3.72646 2.7632 3.80186 2.9574C3.91345 3.24423 4.0348 3.52745 4.15679 3.81021C4.19787 3.9055 4.19377 3.98873 4.13601 4.07462C4.04299 4.21318 3.94178 4.34562 3.83334 4.47195C3.76109 4.55597 3.75794 4.63245 3.81398 4.72603C4.2199 5.40407 4.78558 5.89529 5.5233 6.18839C5.6245 6.22867 5.70493 6.21268 5.77324 6.12757C5.89711 5.97319 6.02382 5.82099 6.14674 5.66598C6.23158 5.55893 6.27817 5.53714 6.40645 5.58824C6.76767 5.73244 7.11221 5.91284 7.45895 6.0876C7.51955 6.11817 7.53828 6.16974 7.53687 6.23384C7.52506 6.76471 7.36955 7.02207 6.80214 7.25828C6.48152 7.39182 6.14958 7.35922 5.81967 7.26768C4.62189 6.93556 3.74 6.18525 3.03392 5.19702C2.81262 4.88731 2.6132 4.56803 2.52994 4.19186C2.41111 3.65535 2.54584 3.19141 2.94279 2.80536C3.06871 2.68326 3.22122 2.65866 3.40475 2.6795Z" fill="#7C7C7C" />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect width="10" height="10" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </ WhatsappShareButton>
                        </div>
                      </div>

                    </div>

                  </div>
                </> :
                <div className="home-loader">
                  <Loader active inline='centered' />
                </div>
            }
          </div>
        </div>
        {
          this.state.product.title ?
            this.state.product.related_products.length ?
              <CollectionSlider data={relatedProducts} />
              : null
            : null
        }
        {
          this.state.visitedProducts.length ?
            <CollectionSlider data={visitedProducts} />
            : null
        }

      </div>
    );

  }
}

const mapStateToProps = (state) => {
  // console.log('cart', state);
  return {
    cart: state.cart,
    country: state?.multiLocation?.defaultCountry,
    defaultCurrency: state?.multiLocation?.defaultCurrency
  };
};

export default connect(mapStateToProps)(ProductPage);