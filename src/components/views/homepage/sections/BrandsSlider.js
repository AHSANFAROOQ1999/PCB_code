import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import brandLogo from '../../../../assets/img/placeholderBrand.png';
// import brandLogo from '../../../../assets/svg/keesLogo.svg';
import arrowLeft from '../../../../assets/svg/arrowLeft.svg';
import arrowRight from '../../../../assets/svg/arrowRight.svg';

class CollectionTabs extends React.Component {

  constructor(props) {

    super(props)
    this.state = {
      data: props?.data,
    }
  }

  render() {
    const settings = {
      speed: 500,
      slidesToShow: 7,
      // slidesToScroll: 1,
      arrows: true,
      autoplay: true,
      autoplayspeed: 2500,
      infinite: true,
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
            arrows: false,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            arrows: false,
            rows: 2,
          }
        }
      ]
    };


    const { data } = this.state
    return (
      <div className="home-brand-section">
        <div className="container-xl">
          <div className="brands-slider-inner">
            <h3 className="section-title">{data.title ? data.title : null}</h3>
            <div className="brand-slider-wrapper">

              <Slider {...settings}>
                {
                  data?.brands?.map((brand, key) => {
                    return <div className="brand-card-wrapper" key={key}>
                      <Link to={"/brand/" + brand.handle}>
                        <img className="product-img" src={brand.logo ? brand.logo : brandLogo} alt="" />
                      </Link>
                    </div>
                  })
                }
                {/* <Link to="/brands">
              <div>
                <h3>VIEW ALL</h3>
              </div>
              </Link> */}

              </Slider>

            </div>
          </div>
        </div>

      </div>
    )

  }

}

export default CollectionTabs;