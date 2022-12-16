import React, { Component } from 'react';
import StaticBanner from './homepage/sections/StaticBanner'
import ProductCard from '../shared/ProductCard'

class Deals extends Component {
  
  render() { 
    return ( 
      <div className='deals-page'>
        <StaticBanner/>
        <h1>Deals & Promotions</h1>
        <div className='products-wrapper'>
          <ProductCard sale='true' />
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
          <ProductCard sale='true'/>
        </div>
      </div>
     );
  }
}
 
export default Deals;