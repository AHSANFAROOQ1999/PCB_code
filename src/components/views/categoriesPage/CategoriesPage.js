import React from 'react'
import CategoryCard from './sections/CategoryCard'
import PageBanner from '../../shared/PageBanner'
import Axios from 'axios'
import {Loader} from 'semantic-ui-react'

class CategoriesPage extends React.Component {

  constructor(props){
    super(props)
    
    this.state = {
      catHandle: this.props.match.params.catHandle,
      categories : [],
      data: {},
      showLoader : true

    }
  }

  fetchData = () => {
    
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/sub_category_list/' + this.state.catHandle )
    .then( (response) => {
      // console.log(response)
      this.setState({
        categories: response.data.sub_category,
        data: response.data,
        showLoader : false

      })

    })
    .catch(function (error) {
      // console.log(error)
      this.setState({showLoader : false})

    })
  }

  componentDidMount(){
    this.fetchData()
  }

  componentDidUpdate () {
    
    if(this.props.match.params.catHandle !== this.state.catHandle)
    {
      this.setState({ catHandle: this.props.match.params.catHandle }, () => {this.fetchData()})
    }
  }

  render(){
    const {categories, showLoader} = this.state

    const colorList = ['#F3EAEF', '#DAF6F8', '#EBEBEB', '#F5EFE7', '#E2EFF5', '#FEEBF3', '#FFF3DB', '#F3EAEF', '#F3EAEF', '#DAF6F8']

    return(
      <>
      {
        showLoader ? 
        <div className="home-loader">
          <Loader active inline='centered' />
        </div>
        :
        categories.length > 0 ? 
          <>
            <PageBanner handle={this.state.catHandle} productsFrom={'category_handle'} />
            <div className="categories-page">
              <div className="container-xl">
                <div className="cat-card-wrapper">
                  {
                    categories.length > 0 ? 

                      categories.map( (cat, index )=>{
                        const colorIndex = index % colorList.length
                        return <CategoryCard color={colorList[colorIndex]} cat={cat} />
                      })

                    : "No Categories"
                  }
                </div>
              </div>
            </div>
          </>
        :null
      }
      </>
    )
  }
}

export default CategoriesPage;