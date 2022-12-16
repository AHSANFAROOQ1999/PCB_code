import React from 'react';
import { isMobile } from "react-device-detect";
// import Slider from "react-slick";
// import arrowLeft from '../assets/svg/arrowLeft.svg';
// import arrowRight from '../assets/svg/arrowRight.svg';
import { Tab } from 'semantic-ui-react'
import CatImage from '../../../../assets/img/catImage.png';
// import ProductCard from './ProductCard'
import SubTab from './SubTab';
// import {sliderSettings as settings } from '../services/context'

class CategoriesTabs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      activeIndex: 0,
      showProduct: true
    }
  }

  componentDidMount() {
    this.getGridItemHeight()
    window.addEventListener('resize', this.getGridItemHeight)
  }

  handleRangeChange = (e) => {
    // debugger
    this.setState({ activeIndex: parseInt(e.target.closest('button').value) })
  }
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

  getGridItemHeight = () => {
    // let gridItemHeight = document.querySelector('.cat-tabs').offsetHeight
    if (document.querySelector('.cat-tabs .product-grid-item')) {
      let gridItemHeight = document.querySelector('.cat-tabs .product-grid-item').offsetHeight
      let getImageWrapWidth = document.querySelector('.cat-tab-image-wrap').offsetWidth
      // let aspectRatio = (gridItemHeight / 2) / getImageWrapWidth * 100
      let aspectRatio = gridItemHeight / getImageWrapWidth * 100
      document.querySelector('.cat-tab-image-wrap').style.paddingBottom = aspectRatio + '%'
    }
  }

  render() {
    const { data, activeIndex } = this.state
    const panes = data.categories.map((cat, key) => {
      return (
        { render: () => <Tab.Pane key={key}> <SubTab activeIndex={activeIndex} products={cat.products} /> </Tab.Pane> }
      )
    })

    const panesMobile = data.categories.map((cat, catkey) => {

      return (
        {
          render: () => <Tab.Pane key={catkey} >
            <SubTab slider={true} products={cat.products} key={catkey} />
          </Tab.Pane>
        }
      )

    })

    return (
      <div className="homepage-categories-tabs">
        <div className="container-xl">

          <h3 className="section-header">{data.title}</h3>
          <div className="inner">
            <div className="cat-tab-buttons-wrapper">
              <div className="cat-tab-image-wrap">
                <img src={data.banner_img ? data.banner_img : CatImage} alt='some text' />
              </div>
              <div className="cat-tab-buttons">
                {
                  data.categories.map((cat, index) => {
                    return <button key={index} onClick={this.handleRangeChange} className={activeIndex === index ? "active-button" : ""} value={index} >{cat.name}</button>
                  })
                }
              </div>
            </div>

            {
              isMobile ?
                <Tab
                  className="cat-tabs"
                  menu={{ attached: false }}
                  panes={panesMobile}
                  activeIndex={activeIndex}
                  onTabChange={this.handleTabChange}
                />

                :
                <Tab
                  className="cat-tabs"
                  menu={{ attached: false }}
                  panes={panes}
                  activeIndex={activeIndex}
                  onTabChange={this.handleTabChange}
                />
            }

          </div>
        </div>
      </div>
    )
  }

}

export default CategoriesTabs;
