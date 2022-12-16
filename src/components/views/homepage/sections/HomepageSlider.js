import React from 'react';
import Slider from "react-slick";
import { isMobileOnly } from "react-device-detect";
import { Link } from 'react-router-dom';
// import { angleright } from 'semantic-ui-react'

// import sliderImage from '../../../../assets/img/slider.png';
// import sliderImageMobile from '../../../../assets/img/sliderMobile.png'

class HomepageSlider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data.slides
    }
  }

  render() {
    const { data } = this.state
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnFocus: true,
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 3000,
      // nextArrow: <NextArrow />,
      // prevArrow: angleright,

    };

    // console.log("Home img", data);

    // console.log("Mobile view", isMobileOnly)
    return (
      <div className="homepage-slider">
        {
          data.length ?
            isMobileOnly ?

              <Slider {...settings}>
                {
                  data.map((banner, key) => {
                    return <div key={key}>
                      <Link to={banner.link}>
                        <img className="slider-image" src={banner.mobile_img} alt="some text" />
                      </Link>
                    </div>
                  })
                }
              </Slider>
              :
              <Slider {...settings}>
                {
                  data.map((banner, index) => {
                    return <div key={index}>
                      <Link to={banner.link}>
                        <img className="slider-image" src={banner.desktop_img} alt="some text" />
                      </Link>
                    </div>
                  })
                }
              </Slider>
            : null
        }
      </div>
    );
  }
}

export default HomepageSlider;