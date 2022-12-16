import React from 'react'
import dummyBrandImage from '../../../src/assets/img/placeholderBrand.png';
import Axios from 'axios';
import { Link } from "react-router-dom"
import { Loader } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Icon } from 'semantic-ui-react'
// import debounce from 'lodash/debounce';

class BrandsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      brands: [],
      showLoader: true,
      totalBrandsToPaginate: null,
      brandsLimit: 35,
      // totalResults: 0,
      activePage: 1,
      hasMoreData: false,
      query: '',
      search: false
    }

  }
  fetchBrands = () => {
    // this.setState({ activePage: this.state.activePage + 1 })
    Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/brand_list?limit=${this.state.brandsLimit}&page=${this.state.activePage}&search=${this.state.query}   `)
      .then((response) => {
        this.setState({
          brands: this.state.brands.concat(response.data.results),
          totalBrandsToPaginate: response.data.count,
          showLoader: false,
          // totalResults: response.data.count,
          hasMoreData: response.data.next ? true : false,
          activePage: this.state.activePage + 1
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  searchBrand = () => {
    // debugger
    {
      this.setState({
        activePage: 1,
        brands: [],
      }, () => {
        this.fetchBrands()
      })
      // this.state.query === '' ? this.fetchBrands() :

      // Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/brand_list?search=${this.state.query}`)
      //   .then((response) => {
      //     // console.log("search data => ", response.data)
      //     this.setState({
      //       // brands: [],
      //       brands: response.data.results,
      //       // brands: this.state.brands.concat(response.data.results),
      //       totalBrandsToPaginate: response.data.count,
      //       showLoader: false,
      //       // totalResults: response.data.count,
      //       hasMoreData: response.data.next ? true : false,
      //       activePage: 1
      //     })
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
    }
  }
  componentDidMount() {
    this.fetchBrands();
  }

  componentDidUpdate() {
    // debugger

  }


  setActivePage = () => {
    this.setState({ activePage: 1 }, () => this.fetchBrands())
  }

  handlePaginationChange = (e, { activePage }) => {
    // debugger
    this.setState({ activePage }, () => this.fetchBrands())

  }

  setSortOption = (data, value) => {
    this.setState({ sortOption: value.value },
      () => {
        this.setActivePage()
      })
  }


  onInputchange = (event) => {
    this.setState({
      query: event.target.value
    });
    // const debouncedSearch = debounce(() => this.searchBrand(), 3000);
    // debouncedSearch();
  }



  render() {
    const { brands } = this.state
    return (
      <div className="brands-page">
        <div className="container-xl">
          <h1>Shop By Brands</h1>

          <div className="brand-search">
            <div className="ui input">
              <input type="text" value={this.state.query} onChange={this.onInputchange} placeholder="Search brands..." />
              <Button className="search-btn" icon onClick={this.searchBrand} >
                <Icon name={"search"} />
              </Button>
            </div>

          </div>

          <InfiniteScroll
            dataLength={this.state.brands.length}
            next={this.fetchBrands}
            hasMore={this.state.hasMoreData}
            loader={<Loader active inline='centered' />}

            endMessage={
              <p>
                <b>No More Brands</b>
              </p>
            }
          >
            <div className="brands-wrapper">
              {
                brands.length ?
                  brands.map((brand, key) => {
                    return <div className="brand-card" key={key}>
                      <div>
                        <Link to={"/brand/" + brand.handle}>
                          <img src={brand.image ? brand.image.cdn_link : dummyBrandImage} alt="brandImage" />
                          <h4>{brand.name}</h4>
                        </Link>
                      </div>
                    </div>
                  })
                  : null
              }
            </div>

          </InfiniteScroll>

          {/* <div className="pagination-wrapper">
            {
              this.state.totalBrandsToPaginate > this.state.brandsLimit ?
                <Pagination
                  className="site-pagination"
                  activePage={this.state.activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(this.state.totalBrandsToPaginate / this.state.brandsLimit)}
                  firstItem={null}
                  lastItem={null}

                />
                : null
            }
          </div> */}
        </div>
      </div>
    )
  }
}
export default BrandsPage;
