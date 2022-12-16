import React from 'react';
import HomepageSlider from './sections/HomepageSlider'
import CollectionTabs from './sections/CollectionTabs'
import BrandsSlider from './sections/BrandsSlider'
import CollectionSlider from './sections/CollectionSlider'
import StaticBanner from './sections/StaticBanner'
import CategoriesTabs from './sections/CategoriesTabs'
import TwoBannerSection from './sections/TwoBannerSection'
import BadgesSection from './sections/BadgesSection'
import { Loader } from 'semantic-ui-react'
import Axios from 'axios';
import VideoSection from './sections/VideoSection';
import FourBannerSection from "./sections/FourBannerSection"
import { connect } from 'react-redux';
import { clearCart } from '../../../redux/slices/cartSlice';
import { changeCountry, changeCountryCode, changeCurrency } from '../../../redux/slices/multiLocationSlice';

class Homepage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      homepage: {},
      country: null
    }
  }

  componentDidMount() {
    // debugger
    if (this.props?.country !== "") {
      // debugger
      this.setState({
        country: this.props?.country
      }, () => {
        this.homepage()
      })
    }
    else {
      // debugger
      this.props?.dispatch(changeCountry("Pakistan"));
      this.props?.dispatch(changeCountryCode("PK"));
      this.props?.dispatch(changeCurrency("PKR"));
      this.props?.dispatch(clearCart());

      this.setState({
        country: "Pakistan"
      }, () => {
        this.homepage()
      })
    }

    // this.homepage()

    // Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/homepage')
    //   .then((response) => {
    //     this.setState({ homepage: response.data.homepage })
    //   })
    //   .catch(function (error) {
    //     // console.log(error);
    //   });
  }

  componentDidUpdate() {
    // debugger

    if (this.state?.country !== this.props?.country) {
      // debugger
      this.setState({
        homepage: {},
        country: this.props?.country
      }, () => {
        this.homepage()
      })
    }

  }

  homepage = () => {
    // debugger
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/homepage' +
      '?country=' +
      this.state?.country)

      .then((response) => {
        this.setState({ homepage: response?.data?.homepage })
      })

      .catch(function (error) {
        // console.log('HomePage Api Error', error)
      });
  }

  render() {
    const { homepage } = this.state
    return (
      <>
        <div className="page-height homepage">
          {
            homepage.length ?
              homepage.map((section, index) => {
                // debugger
                return <div key={index}>
                  {
                    section.type === "banner_slider" ?
                      <HomepageSlider data={section} /> : null
                  }
                  {
                    section.type === "categories_carousel" ?
                      <CollectionTabs data={section} /> : null
                  }
                  {
                    section.type === "brands_slider" ?
                      <BrandsSlider data={section} /> : null
                  }
                  {
                    section.type === "products_carousel" ?
                      <CollectionSlider data={section} /> : null
                  }
                  {
                    section.type === "single_banner" ?
                      <StaticBanner data={section} /> : null
                  }
                  {
                    section.type === "categories_tabs" ?
                      <CategoriesTabs data={section} /> : null
                  }
                  {
                    section.type === "two_banners" ?
                      <TwoBannerSection data={section} /> : null
                  }
                  {
                    section.type === "features_icons" ?
                      <BadgesSection data={section} /> : null
                  }
                  {
                    section.type === "four_banners" ?
                      <FourBannerSection data={section} /> : null
                  }

                </div>

              })
              :

              <div className="home-loader">
                <Loader active inline='centered' />
              </div>

          }
        </div>

        <div className='video_section'>
          <VideoSection />
        </div>

      </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    country: state?.multiLocation?.defaultCountry
  };
};

export default connect(mapStateToProps)(Homepage);