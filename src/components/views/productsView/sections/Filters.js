import React, { Component } from 'react';
import { Accordion, Form, Menu, Input } from 'semantic-ui-react'
import Axios from 'axios'
import debounce from 'lodash/debounce';


class Filters extends Component {

  constructor(props) {
    super(props)
    this.state = {
      handle: this.props.handleToSearch,
      brandFilters: [],
      tagsFilters: [],
      product_optionsFilters: [],
      priceFilters: {},
      collectionFilters: [],
      discountFilters: [],
      // BrandsForm: '',
      // TagsForm: '',
      // product_optionsForm: '',
      // PricesForm: '',
      // CollectionsForm: '',
      // DiscountForm: '',
      products: '',
      brandFilterTags: [],
      tagFilterTags: [],
      product_optionTags: [],
      priceFilterTags: [],
      collectionFilterTags: [],
      discountFilterTags: [],
      props: this.props,
      productsFrom: this.props.productsFrom,
      promotion_filter: null,
      promotions: this.props.promotions,
      activeIndex: null,
      resetCheckbox: null,
      priceFilterFrom: null,
      priceFilterTo: null,
      allFilters: null,
      priceFilterMinMax: {}
    }
  }


  componentDidUpdate() {
    if (this.props.handleToSearch !== this.state.handle) {
      this.setState({
        handle: this.props.handleToSearch,
        brandFilterTags: [],
        priceFilterTags: [],
        collectionFilterTags: [],
        discountFilterTags: [],
      })
    }
  }

  priceFilterChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
    const debouncedFilterPrice = debounce(() => this.appendToUrl(), 3000);
    debouncedFilterPrice();
  }
  componentDidMount() {

    // populating states from url if exist on reload
    if (window.location.search) {
      let tagsFromUrl = window.location.search.replace('?', '').split('&')
      tagsFromUrl.map((tagType) => {
        if (tagType.indexOf('brands') > -1) {
          let tags = tagType.replace('brands=', '').split('+')
          this.setState({ brandFilterTags: tags })
        }
        // if(tagType.indexOf('prices') > -1)
        // {
        //   let tags = tagType.replace('prices=','').split('+')
        //   this.setState({ priceFilterTags: tags })
        // }
        if (tagType.indexOf('collections') > -1) {
          let tags = tagType.replace('collections=', '').split('+')
          this.setState({ collectionFilterTags: tags })
        }
      })
    }
    let body
    if (this.state.productsFrom === 'brand_handle') {
      body = {
        brand_handle: this.state.handle
      }
    }
    else if (this.state.productsFrom === 'category_handle') {
      body = {
        category_handle: this.state.handle
      }
    }
    if (this.state.promotions) {
      body = {
        promotions: true
      }
    }

    //fetching filter list from api   

    this.state.promotion_filter = this.state.promotions ? 'promotion_filter_list' : 'filter_list'

    let request = this.state.promotions ? Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/${this.state.promotion_filter}`, body) : Axios.post(process.env.REACT_APP_BACKEND_HOST + `/storefront/${this.state.promotion_filter}`, body)

    // Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/${this.state.promotion_filter}`, body)

    request.then((response) => {
      // debugger
      let brands = [], prices = [], collections = [], tags = [], product_options = [], allTags = [], allProductOptions = []

      this.setState({ allFilters: response.data })

      for (let filters of response.data) {
        if (filters.type === "brands") {
          brands = filters.data
        }
        if (filters.type === "price") {
          this.setState({ priceFilterMinMax: filters })
        }
        if (filters.type === "collections") {
          collections = filters.data
        }
        if (filters.type === "tags") {
          filters.data = filters.data.split(',')
          tags.push(filters)
        }
        if (filters.type === "product_options") {
          filters.data = filters.data.split(',')
          product_options.push(filters)
          // product_options = filters.data.split(',')
        }
      }

    })


    //       // console.log("tags array :", tags);
    //       // console.log("product_options array :", product_options);

    //       // this.setState({activeIndex : 0})
    //       // rendering filter list

    //       // if (tags) {
    //       //   for (var tagFilter of tags) {
    //       //     debugger
    //       //     let tagFilterHtml = {
    //       //       filterTitle : '',
    //       //       filterTags  : []
    //       //     }
    //       //     for(var filter of tagFilter.data )
    //       //     {
    //       //       tagFilterHtml.filterTitle = tagFilter.title
    //       //       window.location.search.indexOf(filter.handle) > -1 ?
    //       //         tagFilterHtml.filterTags.push(<Form.Checkbox label={filter} onClick={this.filterProducts} name='tag' value={filter} defaultChecked />)
    //       //         :
    //       //         tagFilterHtml.filterTags.push(<Form.Checkbox label={filter} onClick={this.filterProducts} name='tag' value={filter} />)
    //       //     }
    //       //     this.state.tagsFilters.push(tagFilterHtml)
    //       //   }
    //       //   // debugger
    //       //   // this.state.TagsForm = (
    //       //   //   <Form>
    //       //   //     <Form.Group grouped>
    //       //   //       {this.state.tagsFilters}
    //       //   //     </Form.Group>
    //       //   //   </Form>
    //       //   // )
    //       // }

    //       // if (product_options) {

    //       //   for (var product_option of product_options) {
    //       //     {
    //       //       let optionFilterHtml = {
    //       //         filterTitle : '',
    //       //         filterTags  :[]
    //       //       }
    //       //       optionFilterHtml.filterTitle = product_option.title
    //       //       for(var filter of product_option.data )
    //       //       {
    //       //         window.location.search.indexOf(product_option.handle) > -1 ?
    //       //           optionFilterHtml.filterTags.push(<Form.Checkbox label={filter} onClick={this.filterProducts} name='product_options' value={filter} defaultChecked />)
    //       //           :
    //       //           optionFilterHtml.filterTags.push(<Form.Checkbox label={filter} onClick={this.filterProducts} name='product_options' value={filter} />)
    //       //       }
    //       //       this.state.product_optionsFilters.push(optionFilterHtml)
    //       //     }
    //       //   }
    //       //   // this.state.product_optionsForm = (
    //       //   //   <Form>
    //       //   //     <Form.Group grouped>
    //       //   //       {this.state.product_optionsFilters}
    //       //   //     </Form.Group>
    //       //   //   </Form>
    //       //   // )
    //       // }

    //       // if (brands) {

    //       //   for (var brand of brands) {
    //       //     {
    //       //       window.location.search.indexOf(brand.handle) > -1 ?
    //       //         this.state.brandFilters.push(<Form.Checkbox label={brand.name} onClick={this.filterProducts} name='brand' value={brand.handle} defaultChecked />)
    //       //         :
    //       //         this.state.brandFilters.push(<Form.Checkbox label={brand.name} onClick={this.filterProducts} name='brand' value={brand.handle} />)
    //       //     }
    //       //   }
    //       //   this.state.BrandsForm = (
    //       //     <Form>
    //       //       <Form.Group grouped>
    //       //         {this.state.brandFilters}
    //       //       </Form.Group>
    //       //     </Form>
    //       //   )
    //       // }

    //       // if (prices) {
    //       // this.setState({
    //       //   priceFilters: prices
    //       // })
    //       // this.state.PricesForm = (
    //       //   <Form>

    //       //     <Form.Group grouped className="price-filters">
    //       //       {/* {this.state.priceFilters} */}
    //       //       <Input
    //       //         placeholder='From'
    //       //         type="number"
    //       //         name='priceFilterFrom'
    //       //         value={this.state.priceFilterFrom}
    //       //         onChange={this.priceFilterChange}
    //       //       />
    //       //       <span>-</span>
    //       //       <Input
    //       //         placeholder='To'
    //       //         type="number"
    //       //         name='priceFilterTo'
    //       //         value={this.state.priceFilterTo}
    //       //         onChange={this.priceFilterChange}
    //       //       />
    //       //     </Form.Group>
    //       //   </Form>
    //       // )
    //       // }

    //       // if (collections.length) {
    //       //   for (var collection of collections) {
    //       //     {
    //       //       window.location.search.indexOf(collection.handle) > -1 ?
    //       //         this.state.collectionFilters.push(<Form.Checkbox onClick={this.filterProducts} label={collection.title} name='collection' value={collection.handle} defaultChecked />)
    //       //         :
    //       //         this.state.collectionFilters.push(<Form.Checkbox onClick={this.filterProducts} label={collection.title} name='collection' value={collection.handle} />)
    //       //     }
    //       //   }
    //       //   this.state.CollectionsForm = (
    //       //     <Form>
    //       //       <Form.Group grouped>
    //       //         {this.state.collectionFilters}
    //       //       </Form.Group>
    //       //     </Form>
    //       //   )
    //       // }

    //       //promotions -------------------------
    //       // if (this.state.promotions) {
    //       //   if (response.data.discount.length) {
    //       //     for (var discount of response.data.discount) {
    //       //       {
    //       //         window.location.search.indexOf(discount.handle) > -1 ?
    //       //           this.state.discountFilters.push(<Form.Checkbox onClick={this.filterProducts} label={discount.title} name='promotion' value={discount.handle} defaultChecked />)
    //       //           :
    //       //           this.state.discountFilters.push(<Form.Checkbox onClick={this.filterProducts} label={discount.title} name='promotion' value={discount.handle} />)
    //       //       }
    //       //     }
    //       //     this.state.DiscountForm = (
    //       //       <Form>
    //       //         <Form.Group grouped>
    //       //           {this.state.discountFilters}
    //       //         </Form.Group>
    //       //       </Form>
    //       //     )
    //       //   }
    //       // }

    //     })
    // }
  }

  handleClick = (e, titleProps) => {
    // tabs toggling
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    // chanding index to toggle tabs
    this.setState({ activeIndex: newIndex })
  }

  filterProducts = (event) => {
    // get all the checked checkboxes creating arrays and appending to the window url

    let target = event.target.previousSibling
    let value = target.getAttribute('value')
    let brandFilters = this.state.brandFilterTags
    let priceFilters = this.state.priceFilterTags

    let tagFilters = this.state.tagFilterTags
    let product_optionFilters = this.state.product_optionTags

    let collectionFilters = this.state.collectionFilterTags
    let discountFilters = this.state.discountFilterTags

    let toRemove = brandFilters.indexOf(value)
    let tagRemove = tagFilters.indexOf(value)
    let product_optionRemove = product_optionFilters.indexOf(value)

    if (target.getAttribute('name') === 'promotion') {
      if (discountFilters.indexOf(value) > -1) {
        discountFilters.splice(toRemove, 1)
        this.setState({ discountFilterTags: discountFilters })
      }
      else if (discountFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        discountFilters.push(value)
        this.setState({ discountFilterTags: discountFilters })
      }
    }
    if (target.getAttribute('name') === 'brands') {
      if (brandFilters.indexOf(value) > -1) {
        brandFilters.splice(toRemove, 1)
        this.setState({ brandFilterTags: brandFilters })
      }
      else if (brandFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        brandFilters.push(value)
        this.setState({ brandFilterTags: brandFilters })
      }
    }


    if (target.getAttribute('name') === 'tags') {

      if (tagFilters.indexOf(value) > -1) {
        tagFilters.splice(tagRemove, 1)
        this.setState({ tagFilterTags: tagFilters })
      }
      else if (tagFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        tagFilters.push(value)
        this.setState({ tagFilterTags: tagFilters })
      }
    }

    if (target.getAttribute('name') === 'product_options') {
      if (product_optionFilters.indexOf(value) > -1) {
        product_optionFilters.splice(product_optionRemove, 1)
        this.setState({ product_optionTags: product_optionFilters })
      }
      else if (product_optionFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        product_optionFilters.push(value)
        this.setState({ product_optionTags: product_optionFilters })
      }
    }


    if (target.getAttribute('name') === 'price') {
      if (priceFilters.indexOf(value) > -1) {
        let toRemove = priceFilters.indexOf(value)
        priceFilters.splice(toRemove, 1)
        this.setState({ priceFilterTags: priceFilters })
      }
      else if (priceFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        priceFilters.push(target.getAttribute('value'))
        this.setState({ priceFilterTags: priceFilters })
      }

    }
    if (target.getAttribute('name') === 'collections') {
      if (collectionFilters.indexOf(value) > -1) {
        let toRemove = collectionFilters.indexOf(value)
        collectionFilters.splice(toRemove, 1)
        this.setState({ collectionFilterTags: collectionFilters })
      }
      else if (collectionFilters.indexOf(value) === -1 && target.checked) {
        target.checked = false
      }
      else {
        collectionFilters.push(target.getAttribute('value'))
        this.setState({ collectionFilterTags: collectionFilters })
      }

    }

    this.appendToUrl()

  }

  appendToUrl = () => {
    //creating strings to append to url
    let brandFilters = this.state.brandFilterTags
    // let priceFilters = this.state.priceFilterTags
    let collectionFilters = this.state.collectionFilterTags
    let discountFilters = this.state.discountFilterTags
    let tagFilters = this.state.tagFilterTags
    let product_optionFilters = this.state.product_optionTags

    let urlToAppend = this.state.handle + '?'
    if (this.state.promotions) {
      urlToAppend = 'promotions?'
    }
    else {
      urlToAppend = this.state.handle + '?'
    }
    let brandString = brandFilters.join('+')
    // let priceString = priceFilters.join('+')
    let collectionString = collectionFilters.join('+')
    let discountString = discountFilters.join('+')
    let tagString = tagFilters.join('+')
    let product_optionFiltersString = product_optionFilters.join('+')

    if (brandFilters.length) {
      urlToAppend += '&brands=' + brandString.replace(/ /g, "_")
    }
    if (this.state.priceFilterFrom || this.state.priceFilterTo) {
      urlToAppend += '&prices=' + (this.state.priceFilterFrom ? this.state.priceFilterFrom : this.state.priceFilterMinMax.min) + '-' + (this.state.priceFilterTo ? this.state.priceFilterTo : this.state.priceFilterMinMax.max)
    }
    if (collectionFilters.length) {
      urlToAppend += '&collections=' + collectionString.replace(/ /g, "_")
    }
    if (discountFilters.length) {
      urlToAppend += '&discount=' + discountString.replace(/ /g, "_")
    }
    if (tagFilters.length) {
      urlToAppend += '&tags=' + tagString.replace(/ /g, "_")
    }
    if (product_optionFilters.length) {
      urlToAppend += '&product_options=' + product_optionFiltersString.replace(/ /g, "_")
    }
    //appending params to url
    this.props.setActivePage()
    window.history.pushState(null, null, urlToAppend);
    // fetching products based on these params (calling parent component function)
    // this.props.fetchProducts()
  }


  clearFilters = () => {

    this.setState({
      brandFilterTags: [],
      tagFilterTags: [],
      product_optionTags: [],
      priceFilterTags: [],
      collectionFilterTags: [],
      discountFilterTags: [],
      tagsFilters: [],
      priceFilterFrom: null,
      priceFilterTo: null
    })
    let newUrl = window.location.href.split('?')
    window.history.replaceState({}, document.title, newUrl[0]);
    this.props.resetFilters()
  }


  render() {

    const { activeIndex
      // , PricesForm 
    } = this.state

    return (
      <div>
        <div className="filters-head">
          <h5 className="k-sm-heading">FILTERS</h5>
          <button className="clear-filter-btn" onClick={this.clearFilters}>Clear all filters</button>
        </div>
        <div className="filter-tabs">
          <Accordion as={Menu} vertical>
            {
              this.state.allFilters?.map((filter, index) => {
                {
                  if (filter.type !== "price" && filter.data.length) {
                    return <>
                      <Menu.Item key={index}>
                        <Accordion.Title
                          active={activeIndex === index}
                          content={filter.title}
                          index={index}
                          onClick={this.handleClick}
                          icon={activeIndex === index ? 'minus' : 'plus'}
                        />
                        <Accordion.Content active={activeIndex === index} content={
                          <Form>
                            <Form.Group grouped>
                              {
                                Array.isArray(filter.data) ?
                                  filter.data.map((singleFilter, key) => {
                                    // debugger
                                    return <Form.Checkbox key={key} label={singleFilter.title ? singleFilter.title : singleFilter} onClick={this.filterProducts} name={filter.type} value={singleFilter.handle ? singleFilter.handle : singleFilter} defaultChecked={window.location.search.indexOf(singleFilter.handle ? singleFilter.handle : singleFilter.replaceAll(' ', '_')) > -1} />
                                  })
                                  : null
                              }
                            </Form.Group>
                          </Form>
                        } />
                      </Menu.Item>
                    </>
                  }
                  if (filter.type === "price") {
                    return <>
                      <Menu.Item key={index}>
                        <Accordion.Title
                          active={activeIndex === index}
                          content={filter.title}
                          index={index}
                          onClick={this.handleClick}
                          icon={activeIndex === index ? 'minus' : 'plus'}
                        />
                        <Accordion.Content active={activeIndex === index} content={<>
                          <Form>
                            <Form.Group grouped className="price-filters">
                              {/* {this.state.priceFilters} */}
                              <Input
                                placeholder='From'
                                type="number"
                                name='priceFilterFrom'
                                value={this.state.priceFilterFrom}
                                onChange={this.priceFilterChange}
                              />
                              <span>-</span>
                              <Input
                                placeholder='To'
                                type="number"
                                name='priceFilterTo'
                                value={this.state.priceFilterTo}
                                onChange={this.priceFilterChange}
                              />
                            </Form.Group>
                          </Form></>} />
                      </Menu.Item>
                    </>
                  }
                }
              })
            }
          </Accordion>
        </div>
      </div>
    );
  }
}

export default Filters;