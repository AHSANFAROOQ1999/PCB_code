import React, { Component } from 'react';
import PageBanner from '../shared/PageBanner'
// import { Dropdown, Pagination } from 'semantic-ui-react'
import ProductCard from '../shared/ProductCard'
// import Filters from './productsView/sections/Filters'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from 'semantic-ui-react'


class Search extends Component {

  constructor(props) {
    super(props)

    // console.log(props)

    this.state = {
      isFilterOpen: false,
      query: this.props.match.params.q,
      // category: this.props.match.params.q.split('+')[0],
      searchResults: [],
      activePage: 1,
      totalProductsToPaginate: null,
      hasMoreData: false,

    }
  }

  componentDidMount() {

    this.search(this.state.query)
  }
  componentDidUpdate() {
    // debugger
    if (this.state.query !== this.props.match.params.q) {


      this.setState({
        query: this.props.match.params.q,
        searchResults: [],
        activePage: 1,
        hasMoreData: false,
        totalProductsToPaginate: null
      },
        () => {
          this.search(this.props.match.params.q)
        })

    }

    // this.setState({
    //   query: this.props.match.params.q
    // })

  }

  search = (query) => {
    query = this.props.match.params.q

    let newQuery = ''
    // debugger
    if (query) {
      if (query.includes('+')) {
        newQuery = query.split('+')
        query = newQuery[0] + '&category=' + newQuery[1]
      }
    }
    axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/search_products?q=' + query + '&limit=10&page=' + this.state.activePage)
      .then((response) => {
        this.setState({

          searchResults: this.state.searchResults.concat(response.data.results),
          totalProductsToPaginate: response.data.count,
          hasMoreData: response.data.next ? true : false,
          activePage: this.state.activePage + 1
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage }, () => this.search(this.state.query))

  }


  openFilter = () => {
    this.setState({ isFilterOpen: true })
  }

  closeFilter = () => {
    this.setState({ isFilterOpen: false })
  }


  render() {


    return (
      <div className='search-page'>
        <PageBanner />
        <div className="container-xl">
          <div className="collection-wrapper">
            <div className={"filter-overlay " + (this.state.isFilterOpen ? 'show-overlay' : '')} onClick={this.closeFilter}></div>
            {/* <div className={"filter-wrapper " + (this.state.isFilterOpen ? 'show-filter' : '')}>
              <Filters />
            </div> */}

            <div className="products-wrapper">

              {/* <div className="search-value">
                  <p>Search Results For : Laptops-notebooks</p>
                </div> */}

              {/* <div className="search-detail">
                <div className="search-swatch">
                  <p>Choose By Category: </p>
                  <div className="search-tags">
                    <span>Laptops</span>
                    <span>Gaming Laptops</span>
                    <span>Refurbished Laptops</span>
                    <span>Laptops</span>
                    <span>Gaming Laptops</span>
                    <span>Refurbished Laptops</span>
                    <span>Laptops</span>
                    <span>Gaming Laptops</span>
                    <span>Refurbished Laptops</span>
                    <span>Laptops</span>
                    <span>Gaming Laptops</span>
                    <span>Refurbished Laptops</span>
                  </div>
                </div>
              </div> */}

              <div className="toolbar">
                <div className="breadcrumbs">
                  <p>Home / Search / <span> {this.state.query} </span> </p>
                </div>
                <button type="button" className="filter-trigger-mobile" onClick={this.openFilter}>
                  <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.15389 4.32698L2.15389 13.4808C2.15389 13.6236 2.09716 13.7606 1.99618 13.8616C1.8952 13.9626 1.75824 14.0193 1.61543 14.0193C1.47262 14.0193 1.33566 13.9626 1.23468 13.8616C1.1337 13.7606 1.07697 13.6236 1.07697 13.4808L1.07696 4.32698C1.07696 4.18417 1.1337 4.04721 1.23468 3.94623C1.33566 3.84525 1.47262 3.78852 1.61543 3.78852C1.75824 3.78852 1.8952 3.84525 1.99618 3.94623C2.09716 4.04721 2.15389 4.18417 2.15389 4.32698Z" fill="black" />
                    <path d="M6.46157 9.71159L6.46157 13.4808C6.46157 13.6236 6.40484 13.7606 6.30386 13.8616C6.20287 13.9626 6.06591 14.0193 5.92311 14.0193C5.7803 14.0193 5.64334 13.9626 5.54235 13.8616C5.44137 13.7606 5.38464 13.6236 5.38464 13.4808L5.38464 9.71159C5.38464 9.56879 5.44137 9.43183 5.54235 9.33084C5.64334 9.22986 5.7803 9.17313 5.9231 9.17313C6.06591 9.17313 6.20287 9.22986 6.30386 9.33084C6.40484 9.43183 6.46157 9.56879 6.46157 9.71159Z" fill="black" />
                    <path d="M3.23083 3.25009C3.23083 3.56959 3.13609 3.8819 2.95859 4.14755C2.78109 4.4132 2.5288 4.62025 2.23363 4.74251C1.93845 4.86478 1.61365 4.89677 1.3003 4.83444C0.986947 4.77211 0.699113 4.61826 0.473197 4.39234C0.247281 4.16643 0.0934309 3.87859 0.0311009 3.56524C-0.0312291 3.25189 0.000760874 2.92708 0.123026 2.63191C0.24529 2.33674 0.452338 2.08445 0.717987 1.90695C0.983636 1.72945 1.29595 1.63471 1.61545 1.63471C2.04387 1.63471 2.45475 1.8049 2.7577 2.10784C3.06064 2.41079 3.23083 2.82167 3.23083 3.25009ZM1.07699 3.25009C1.07699 3.35659 1.10857 3.4607 1.16773 3.54925C1.2269 3.6378 1.311 3.70681 1.40939 3.74757C1.50778 3.78832 1.61604 3.79898 1.7205 3.77821C1.82495 3.75743 1.92089 3.70615 1.9962 3.63084C2.0715 3.55554 2.12279 3.45959 2.14356 3.35514C2.16434 3.25069 2.15368 3.14242 2.11292 3.04403C2.07217 2.94564 2.00315 2.86154 1.9146 2.80238C1.82605 2.74321 1.72194 2.71163 1.61545 2.71163C1.47264 2.71163 1.33568 2.76836 1.2347 2.86934C1.13372 2.97032 1.07699 3.10728 1.07699 3.25009Z" fill="black" />
                    <path d="M7.53845 8.63461C7.53845 8.95411 7.44371 9.26643 7.26621 9.53207C7.08871 9.79772 6.83642 10.0048 6.54124 10.127C6.24607 10.2493 5.92127 10.2813 5.60792 10.219C5.29456 10.1566 5.00673 10.0028 4.78081 9.77686C4.5549 9.55095 4.40105 9.26311 4.33872 8.94976C4.27639 8.63641 4.30838 8.31161 4.43064 8.01643C4.55291 7.72126 4.75996 7.46897 5.0256 7.29147C5.29125 7.11397 5.60357 7.01923 5.92306 7.01923C6.35149 7.01923 6.76237 7.18942 7.06531 7.49236C7.36826 7.79531 7.53845 8.20619 7.53845 8.63461ZM5.3846 8.63461C5.3846 8.74111 5.41618 8.84522 5.47535 8.93377C5.53452 9.02232 5.61861 9.09133 5.717 9.13209C5.81539 9.17284 5.92366 9.18351 6.02811 9.16273C6.13256 9.14195 6.22851 9.09067 6.30381 9.01536C6.37912 8.94006 6.4304 8.84411 6.45118 8.73966C6.47196 8.63521 6.46129 8.52694 6.42054 8.42855C6.37978 8.33016 6.31077 8.24607 6.22222 8.1869C6.13367 8.12773 6.02956 8.09615 5.92306 8.09615C5.78025 8.09615 5.64329 8.15288 5.54231 8.25386C5.44133 8.35485 5.3846 8.49181 5.3846 8.63461Z" fill="black" />
                    <path d="M2.15389 0.557824L2.15389 2.17321C2.15389 2.31602 2.09716 2.45298 1.99618 2.55396C1.8952 2.65494 1.75824 2.71167 1.61543 2.71167C1.47262 2.71167 1.33566 2.65494 1.23468 2.55396C1.1337 2.45298 1.07697 2.31602 1.07697 2.17321L1.07697 0.557824C1.07697 0.415015 1.1337 0.278054 1.23468 0.177073C1.33566 0.0760922 1.47262 0.019362 1.61543 0.0193619C1.75824 0.0193619 1.8952 0.0760922 1.99618 0.177073C2.09716 0.278054 2.15389 0.415015 2.15389 0.557824Z" fill="black" />
                    <path d="M6.46157 0.557729L6.46157 7.55773C6.46157 7.70054 6.40484 7.8375 6.30386 7.93848C6.20287 8.03946 6.06591 8.09619 5.92311 8.09619C5.7803 8.09619 5.64334 8.03946 5.54235 7.93848C5.44137 7.8375 5.38464 7.70054 5.38464 7.55773L5.38464 0.557729C5.38464 0.41492 5.44137 0.277959 5.54235 0.176979C5.64334 0.0759973 5.7803 0.0192671 5.9231 0.0192671C6.06591 0.0192671 6.20287 0.0759973 6.30386 0.176979C6.40484 0.277959 6.46157 0.41492 6.46157 0.557729Z" fill="black" />
                  </svg>
                  <span>Filter</span>

                </button>
                <div className="col-options">
                  {/* <Dropdown text='Sort by'>
                    <Dropdown.Menu>
                      <Dropdown.Item text='Ascending' />
                      <Dropdown.Item text='Descending' />
                    </Dropdown.Menu>
                  </Dropdown> */}
                </div>
              </div>

              <InfiniteScroll
                dataLength={this.state.searchResults.length}
                next={this.search}
                hasMore={this.state.hasMoreData}
                loader={<Loader active inline='centered' />}

                endMessage={
                  <p>
                    <b>No More Results</b>
                  </p>
                }
              >

                <div className="col-product-wrapper">
                  {
                    this.state.searchResults.length ?
                      this.state.searchResults.map((product, key) => {
                        return <ProductCard key={key} product={product} />
                      })
                      : <div className="no-search-results" > <h3>No Search Results</h3></div>
                  }
                </div>

              </InfiniteScroll>

              {/* <div className="pagination-wrapper">
                  {
                    this.state.totalProductsToPaginate > 10 ?
                      <Pagination
                        className="site-pagination"
                        activePage={this.state.activePage}
                        onPageChange={this.handlePaginationChange}
                        totalPages={this.state.totalProductsToPaginate / 10}
                        firstItem={null}
                        lastItem={null}

                      />
                      : null
                  }
                </div> */}
            </div>


            {/* <div className="col-products">
              
              <div className="col-top-bar">

                <div className="breadcrumbs">
                  <p>Home / Products / Collection / <span>BASICS-V</span></p>
                </div>
                <div className="col-options">
                  <Dropdown text='Sort by'>
                    <Dropdown.Menu>
                      <Dropdown.Item text='New' />
                      <Dropdown.Item text='Open...' description='ctrl + o' />
                      <Dropdown.Item text='Save as...' description='ctrl + s' />
                      <Dropdown.Item text='Rename' description='ctrl + r' />
                      <Dropdown.Item text='Make a copy' />
                      <Dropdown.Item icon='folder' text='Move to folder' />
                      <Dropdown.Item icon='trash' text='Move to trash' />
                      <Dropdown.Divider />
                      <Dropdown.Item text='Download As...' />
                      <Dropdown.Item text='Publish To Web' />
                      <Dropdown.Item text='E-mail Collaborators' />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="col-product-wrapper">
                <ProductCard />
              </div>
            </div>
           */}
          </div>

          {/* <div className="pagination-wrapper">
            {
              this.state.totalProductsToPaginate > 10 ?
                <Pagination
                  className="site-pagination"
                  activePage={this.state.activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(this.state.totalProductsToPaginate / 10)}
                  firstItem={null}
                  lastItem={null}
                />
                : null
            }
          </div> */}

        </div>
      </div>
    );
  }
}

export default Search;