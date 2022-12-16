import React from 'react';
import Slider from "react-slick";
import arrowLeft from '../../../../assets/svg/arrowLeft.svg';
import arrowRight from '../../../../assets/svg/arrowRight.svg';
import ProductCard from '../../../shared/ProductCard'
// import {sliderSettings } from '../services/context'
import { isMobile } from 'react-device-detect';


class CollectionSlider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  render() {
    // let settings = sliderSettings
    const settings = {
      speed: 500,
      slidesToShow: 4,
      // slidesToScroll: 1,
      autoplay: false,
      autoplayspeed: 2500,
      infinite: false,
      arrows: true,
      nextArrow: <img src={arrowRight} alt="" />,
      prevArrow: <img src={arrowLeft} alt="" />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            arrows: false
          }
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 3,
            arrows: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            arrows: false
          }
        }
      ]
    };
    const { data } = this.state
    if (data.products.length > 4) {
      settings.infinite = true
    }
    if (isMobile) {
      if (data.products.length > 2) {
        settings.infinite = true
      }
    }
    else {
      if (data.products.length > 4) {
        settings.infinite = true
      }
    }
    return (
      <div className="collection-slider-wrapper">
        <div className="container-xl">
          <h3 className="section-title"> <hr /> {data.title ? data.title : null} <hr /></h3>
          <div className="collection-slider-inner">
            <Slider {...settings}>
              {
                data.products.map((product, key) => {
                  return <ProductCard product={product} key={key} />
                })
              }
            </Slider>
          </div>
        </div>
      </div>
    )

  }

}

export default CollectionSlider;