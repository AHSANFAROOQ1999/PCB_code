import axios from 'axios';
import React from 'react';
import pageBanner from '../../assets/img/pageBanner.png';

class PageBanner extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      bannerTitle: this.props.bannerTitle,
      bannerLink: '',
      handle: props.handle,
      productsFrom: props.productsFrom,
    }
  }

  fetchBanner() {

    axios.get(process.env.REACT_APP_BACKEND_HOST + "/storefront/productlistbanner?" + this.state.productsFrom + "=" + this.state.handle)
      .then((response) => {
        // console.log("product list banner", response)
        this.setState({
          bannerLink: response.data.cdn_link
        })
      })
      .catch((err) => {

        console.log(err)
        this.setState({
          bannerLink: null
        })

      })
  }

  componentDidMount() {
    if (this.state.handle) {
      this.fetchBanner()
    }
  }
  componentDidUpdate() {
    // debugger
    // if (window.location.href.includes('promotions') && this.state.productsFrom != "promotions")
    // {
    //   this.setState({ productsFrom : 'promotions' })
    // }
    if (this.props.handle !== this.state.handle || this.props.productsFrom !== this.state.productsFrom) {
      this.setState({
        handle: this.props.handle,
        productsFrom: this.props.productsFrom
      }, () => {
        this.fetchBanner()
      })
    }
  }

  render() {
    const { bannerLink } = this.state
    // let heading
    // if(bannerTitle)
    // {
    //    heading = bannerTitle.split(' ')
    // }

    return (
      <div className="page-banner">
        {
          bannerLink ?
            <>
              <img src={bannerLink ? bannerLink : pageBanner} alt="banner" />
              {/* <div className="banner-content-wrapper"> */}

              {/* <h1 className="banner-heading">{heading[0]} <span>{ bannerTitle.replace(heading[0], '') }</span></h1> */}

              {/* <p className="banner-para">{  } </p> */}
              {/* </div> */}
            </>
            : null
        }
      </div>
    )
  }

}
export default PageBanner;