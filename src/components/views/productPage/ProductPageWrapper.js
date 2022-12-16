import React from 'react';
import ProductPage from '../productPage/ProductPage'

class ProductPageWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      handle: this.props.match.params.handle,
      products: []
    }
  }
  componentDidUpdate = () => {
    if(this.props.match.params.handle !== this.state.handle)
    {
      this.setState({handle: this.props.match.params.handle })
    }
  }
  
  render() { 
    return ( 
      <>
        <ProductPage handle={this.state.handle}/>
      </>
    );
  }
}
 
export default ProductPageWrapper;