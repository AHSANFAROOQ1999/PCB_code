import React from 'react';
import { Link } from 'react-router-dom'
// import defaultImage from '../assets/img/product1.png';
import defaultImage from '../../assets/img/productImagePlaceholder.png';
// import {productClicks} from '../services/GAEvents'
import { Icon } from 'semantic-ui-react';
import Axios from 'axios';
// import Money from './Money';
import { connect } from 'react-redux';

class ProductCard extends React.Component {

  constructor(props) {
    super(props);
    if (this.props.product) {
      this.state = {
        product: this.props.product,
        wishList: [],
        wishListStyle: 'outline'
      }
    }

    else {
      //dummy data
      this.state = {
        product: {
          title: 'Product Name Here',
          price: '600.00',
          image: defaultImage
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    // debugger
    if (this.props.product) {
      if (this.props.product.id !== prevProps.product.id) {
        this.setState({
          product: this.props.product
        })
      }
    }
  }

  componentDidMount() {
    this.changeColor();

  }

  productClicks = (productObj) => {

    window.dataLayer = window.dataLayer || [];

    // window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    // window.dataLayer.push({
    //   'event': 'select_item',
    //   'ecommerce': {
    //      'items': [{
    //       item_name: productObj.name, // Name or ID is required.
    //       item_id: 1,
    //       item_brand: productObj.brand,
    //       item_category: productObj.category,
    //       item_category2: productObj.category_2,
    //       item_category3: productObj.category_3,
    //       item_category4: productObj.category_4,
    //       item_variant: productObj.variant,
    //       item_list_name: productObj.list_name,
    //       item_list_id: productObj.list_id,
    //       index: productObj.index,
    //       quantity: productObj.quantity,
    //       price: productObj.price
    //     }]
    //    }
    //   //  ,
    //   //  'eventCallback': function() {
    //   //    document.location = productObj.url
    //   //  }
    // });
    // debugger

    window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    window.dataLayer.push({
      'event': 'productClick',
      'ecommerce': {
        'click': {
          'products': [{
            'name': productObj.name,                      // Name or ID is required.
            'id': productObj.id,
            'price': productObj.price,
            'brand': productObj.brand,
            'category': productObj.cat,
            'variant': productObj.variant,
            'position': productObj.position
          }]
        }
      }

      // ,
      // 'eventCallback': function() {
      //   document.location = productObj.url
      // }

    });
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
          this.setState({
            wishList: wishlist
          });
        }
      })
  }

  postWishList = (variant_id) => {
    let i = 0;
    let doesExist = false;
    for (i; i < this.state.wishList.length; i++) {
      if (this.state.wishList.product_data.variant_id === this.state.product.price.variant_id) {
        doesExist = true;
        break
      }
    }

    if (!doesExist) {
      Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist', variant_id, {
        headers: {
          "pushpa": sessionStorage.getItem('pcb-customer-token')
        }
      })
        .then((response) => {
        })
    }

  }

  changeColor = () => {
    let product = this.state.product;
    if (localStorage.getItem('wishList')) {

      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false
      let i = 0;
      for (i; i < wishlistObj.length; i++) {
        if (wishlistObj[i].variant_id === product?.variant_detail?.variant_id) {
          doesExist = true;
          break
        }
      }

      if (doesExist) {
        this.setState({
          wishListStyle: ""
        })
      } else {
        this.setState({
          wishListStyle: "outline"
        })
      }

    }

  }

  addToWishList = (event) => {
    event.preventDefault();
    let product = this.state.product;

    let variant_id = {
      variant_id: product?.variant_detail?.variant_id
    };

    if (sessionStorage.getItem('pcb-customer-token')) {
      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product?.image?.length ? product?.image : null
      let sku = product.price ? product?.variant_detail?.sku : ''

      let productDetail = {
        title: product.title,
        image: productImg,
        variant_id: variant_id,
        product_handle: product.handle,
        variant_price: product.variant_detail?.original_price,
        sku: sku
      }

      singleProductDetail.push(productDetail);

      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj.length; i++) {
          if (wishlistObj[i].variant_id === productDetail.variant_id) {
            this.doesExist = true;
            break
          }
        }

        if (!this.doesExist) {
          wishlistObj.push(productDetail)
          this.postWishList(variant_id);
        } else {
          this.doesExist = false;
          wishlistObj.splice(i, 1);
          this.deleteWishList(this.state.product?.variant_detail?.variant_id)
        }

        localStorage.setItem('wishList', JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail));
      }

    } else {
      let wishlistObj = JSON.parse(localStorage.getItem('wishList'))
      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product?.image?.length ? product?.image : null
      let sku = product?.variant_detail ? product?.variant_detail?.sku : '';

      let productDetail = {
        title: product?.title,
        image: productImg,
        variant_id: product?.variant_detail?.variant_id,
        product_handle: product?.handle,
        variant_price: product?.variant_detail?.original_price,
        sku: sku
      }

      singleProductDetail.push(productDetail);

      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj.length; i++) {
          if (wishlistObj[i].variant_id === productDetail?.variant_id) {
            this.doesExist = true;
            break
          }
        }
        if (!this.doesExist) {
          wishlistObj.push(productDetail);
        } else {
          this.doesExist = false;
          wishlistObj.splice(i, 1);
        }
        localStorage.setItem('wishList', JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem('wishList', JSON.stringify(singleProductDetail));
      }
    }

    this.changeColor();

  }

  render() {

    let { product } = this.state

    let saleTag = null;
    let price = <p className="product-price"> {product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {product?.variant_detail?.original_price} </p>;

    if (product?.variant_detail?.original_price < product?.variant_detail?.compare_price) {
      saleTag = (
        <div className="saleTag">Sale</div>
      )
      price = (
        // <p className="product-price sale-price"> <span className="original-price"><Money price={product?.variant_detail?.compare_price} format="currency: price" /> </span> <Money price={product?.variant_detail?.original_price} format="currency: price" /></p>
        <p className="product-price sale-price">
          <span className="original-price">
            {product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {product?.variant_detail?.compare_price} &nbsp;
          </span>
          {product?.variant_detail ? product?.variant_detail?.currency : this.props?.defaultCurrency}: &nbsp; {product?.variant_detail?.original_price}
        </p>
      )
    }

    // if(product.sold_out == true) {
    //   soldTag = (
    //     <div className="soldTag">sold</div>
    //   )
    // }

    let productObjectGA = {
      'name': product?.title,                      // Name or ID is required.
      'id': product?.id,
      'price': product?.variant_detail?.original_price,
      // 'brand': ,
      // 'category': productObj.cat,
      // 'variant': productObj.variant,
      // 'position': productObj.position
    }

    return (

      <div className="product-wrapper product-grid-item">
        <Link to={'/product/' + product.handle}>
          <div onClick={() => { this.productClicks(productObjectGA) }} className='product-card-inner-wrapper'>
            {saleTag}
            {
              product.sold_out === true ?
                <div className="soldTag">
                  <span>
                    sold out
                  </span>
                </div>
                : null
            }

            <div className="grid-item-image">

              <img className="product-img" src={product.image ? product.image : defaultImage} alt="" />
              <Icon circular onClick={(e) => this.addToWishList(e)} className='wishlistButton' color='black' name={`heart ${this.state.wishListStyle}`} />

            </div>

            <p className="product-title">{product.title}</p>
            {price}
            {/* <button className="btn-1">Buy It Now</button> */}
          </div>
        </Link>
      </div>
    )
  }

}


const mapStateToProps = (state) => {
  // console.log('cart', state);
  return {
    // cart: state.cart,
    defaultCurrency: state?.multiLocation?.defaultCurrency
  };
};


export default connect(mapStateToProps)(ProductCard);