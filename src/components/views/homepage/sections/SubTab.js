import React from 'react';
import ProductCard from '../../../shared/ProductCard';
import Slider from "react-slick";
// import arrowLeft from '../../../../assets/svg/arrowLeft.svg';
// import arrowRight from '../../../../assets/svg/arrowRight.svg';
import { sliderSettings as settings } from '../../../../services/context'


class SubTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      products: props.products,
      showTab: true,
      activeIndex: props.activeIndex,
      slider: props.slider
    }

  }

  componentDidUpdate() {
    // debugger
    if (this.props.products !== this.state.products) {
      this.setState({ products: this.props.products, showTab: false }, () => this.setState({ showTab: true }))
    }
  }

  render() {

    // const settings = {
    //   speed: 500,
    //   slidesToShow: 6,
    //   // slidesToScroll: 1,
    //   arrows: true,
    //   infinite: true,
    //   autoplay: true,
    //   autoplaySpeed:  2500,
    //   nextArrow: <img src={arrowRight} alt="" />,
    //   prevArrow: <img src={arrowLeft} alt="" />,
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       settings: {
    //         slidesToShow: 4,
    //         arrows: false
    //       }
    //     },
    //     {
    //       breakpoint: 800,
    //       settings: {
    //         slidesToShow: 3,
    //         arrows: false
    //       }
    //     },
    //     {
    //       breakpoint: 600,
    //       settings: {
    //         slidesToShow: 2,
    //         arrows: false
    //       }
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 2,
    //         arrows: false
    //       }
    //     }
    //   ]
    // };

    const { products, showTab, slider } = this.state

    if (slider) {
      return (
        <>
          {
            showTab ?
              <Slider {...settings}>
                {
                  products.map((pro, key) => {
                    return <ProductCard product={pro} key={key} />
                  })
                }
              </Slider>
              : null
          }

        </>
      )
    }
    else {
      return (
        <>
          {
            showTab ?
              products.map((pro, index) => {
                if (index < 8) {
                  return <ProductCard product={pro} key={index} />
                }
              })
              : null
          }
        </>
      );
    }

  }
}

export default SubTab;