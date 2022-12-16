import React from 'react'
import { Button } from 'semantic-ui-react'
import categoryImage from '../../../../assets/img/unnamed1.png';
import {Link } from 'react-router-dom'

class CategoryCard extends React.Component
{

  constructor(props){
    super(props)

    this.state = {
      cat : this.props.cat
    }
  }

  componentDidUpdate () {
    if( this.state.cat !== this.props.cat )
    {
      this.setState({ cat: this.props.cat })
    }
    
  }

  render (){
    const { cat } = this.state 
    const style  ={ backgroundColor : this.props.color  }
    return(
      <div  className="category-card" >
        <div style={style}>
          <div>
            <h4>{cat.name}</h4>
          </div>
          <div>
          <Link to={'/collection/' + cat.handle}><Button className="cat-button" basic>  Shop Now </Button></Link>
          </div>
          <div className="cat-card-img">
            <div className="white-bg"></div>
            <img src={ cat.image.cdn_link ? cat.image.cdn_link : categoryImage} alt="" />
          </div>
        </div>
            
      </div>
    
    )
  }
} 
export default CategoryCard ;