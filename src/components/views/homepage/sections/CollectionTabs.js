import React from 'react';
import { Tab } from 'semantic-ui-react'
// import Slider from "react-slick";
// // import product1 from '../assets/img/product1.png';
// import arrowLeft from '../assets/svg/arrowLeft.svg';
// import arrowRight from '../assets/svg/arrowRight.svg';
// import ProductCard from './ProductCard'
import Slider1 from './Slider1';

class CollectionTabs extends React.Component {

  constructor(props)
  {
    super(props)
    this.state = {
      data:props.data
    }
  }

  componentDidUpdate(){
  }

  render() {
    const { data } = this.state
    // const settings = {
    //   speed: 500,
    //   slidesToShow: 6,
    //   slidesToScroll: 1,
    //   infinite: true,
    //   arrows: true,
    //   autoplay:true,
    //   autoplayspeed: 2500,
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
    //         slidesToShow: 3.5,
    //         arrows: false
    //       }
    //     },
    //     {
    //       breakpoint: 600,
    //       settings: {
    //         slidesToShow: 2.5,
    //         arrows: false
    //       }
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 1.5,
    //         arrows: false
    //       }
    //     }
    //   ]
    // };

    // let settings2 = Object.assign({}, settings); 
    // settings2.infinite = true
    
    
    let panes = data.categories.map( (cat,key) => {

      return (
        {
            menuItem: cat.name,
            render: () => <Tab.Pane attached={false} >
              {
                <>
                  <Slider1 catHandle={cat.handle}  products={cat.products} key={key}/>
                </> 
              }
                
          </Tab.Pane>
          }

      )
    })


    return(
      <div className="collection-tabs-wrapper">
        <div className="container-xl">
          <h3 className="collection-name">{ data.title }</h3>
          <Tab className="collection-tabs" menu={{ text: true }} panes={panes} />
        </div>
      </div>
    )

  }

}

export default CollectionTabs;