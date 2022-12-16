import React from 'react';
import CategoriesPage from '../components/CategoriesPage'

class CategoryPageWrapper extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      catHandle: this.props.match.params.catHandle
    }
  }
  
  render() { 
    return ( 
      <>
        <CategoriesPage catHandle={this.state.catHandle}/>
      </>
    );
  }
}
 
export default CategoryPageWrapper;