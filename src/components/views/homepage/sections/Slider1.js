import React from 'react';
import Slider from "react-slick";
import ProductCard from '../../../shared/ProductCard';
import arrowLeft from '../../../../assets/svg/arrowLeft.svg';
import arrowRight from '../../../../assets/svg/arrowRight.svg';
// import {Link} from 'react-router-dom'
// import {sliderSettings} from '../services/context'
import { isMobile } from 'react-device-detect';

class Slider1 extends React.Component {
  // state = {  }

  constructor(props)
  {
    super(props)
    
    this.state = {
      products : props.products,
      showSlider : true,
      catHandle : props.catHandle
    }
  }
  
  componentDidUpdate(){
    
    if(this.props.products !== this.state.products)
    {
      this.setState({
        products : this.props.products,
        showSlider: false,
        catHandle : this.props.catHandle
      }, () => this.setState({ showSlider: true }))
    }
  }

  render() { 
 
    const sliderSettings = {
      speed: 500,
      slidesToShow: 6,
      autoplay:true,
      autoplayspeed: 2500,
      slidesToScroll: 1,
      arrows: true,
      infinite: false,
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

    const {products, showSlider} = this.state

    if(isMobile)
    {
      if (products.length > 2 )
      {
        sliderSettings.infinite = true
      }
    }
    else {
      if (products.length > 6 )
      {
        sliderSettings.infinite = true
      }
    }


    return ( 
      <div>
        {
          showSlider ? 
            <Slider {...sliderSettings}> 
            {
              products.length ? 
              products.map( (pro,key)=> {
              return <ProductCard product={pro} key={key}/>
              })
              : null

            }
            {/* <Link to={'/collection/'+ this.state.catHandle}>
              
              <div className="view-all-card">
                <div className="product-card-inner-wrapper">
                  <button className="btn-view" ><h3>View All</h3></button>
                </div>
              </div>
            </Link>   */}
            
            
            </Slider>
          : null  
        }
      </div>
     );
  }
}
 
export default Slider1;