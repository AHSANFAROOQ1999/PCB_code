import React from 'react'
// import dummyBrandImage from '../../../../src/assets/img/placeholderBrand.png';
import Axios from 'axios';
import { Link } from "react-router-dom"
import { Loader } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Icon } from 'semantic-ui-react'
// import { Search, Grid ,Pagination} from 'semantic-ui-react'
// import debounce from 'lodash/debounce';

class VendorsPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            vendors: [],
            showLoader: true,
            totalvendorsToPaginate: null,
            vendorsLimit: 35,
            // totalResults: 0,
            activePage: 1,
            hasMoreData: false,
            query: '',
            search: false
        }

    }
    fetchvendors = () => {
        // this.setState({ activePage: this.state.activePage + 1 })
        Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/vendor?limit=${this.state.vendorsLimit}&page=${this.state.activePage}&search=${this.state.query}   `)
            .then((response) => {
                this.setState({
                    vendors: this.state.vendors.concat(response.data.results),
                    totalvendorsToPaginate: response.data.count,
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

    searchVendor = () => {
        // debugger
        {
            this.setState({
                activePage: 1,
                vendors: [],
            }, () => {
                this.fetchvendors()
            })
            // this.state.query === '' ? this.fetchvendors() :

            // Axios.get(process.env.REACT_APP_BACKEND_HOST + `/storefront/brand_list?search=${this.state.query}`)
            //   .then((response) => {
            //     // console.log("search data => ", response.data)
            //     this.setState({
            //       // vendors: [],
            //       vendors: response.data.results,
            //       // vendors: this.state.vendors.concat(response.data.results),
            //       totalvendorsToPaginate: response.data.count,
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
        this.fetchvendors();
    }

    componentDidUpdate() {
        // debugger

    }


    setActivePage = () => {
        this.setState({ activePage: 1 }, () => this.fetchvendors())
    }

    handlePaginationChange = (e, { activePage }) => {
        // debugger
        this.setState({ activePage }, () => this.fetchvendors())

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
        // const debouncedSearch = debounce(() => this.searchVendor(), 3000);
        // debouncedSearch();
    }



    render() {
        const { vendors } = this.state
        return (
            <div className="brands-page">
                <div className="container-xl">
                    <h1>Shop By Vendors</h1>

                    <div className="brand-search">
                        <div className="ui input">
                            <input type="text" value={this.state.query} onChange={this.onInputchange} placeholder="Search vendors..." />
                            <Button className="search-btn" icon onClick={this.searchVendor} >
                                <Icon name={"search"} />
                            </Button>
                        </div>

                    </div>

                    <InfiniteScroll
                        dataLength={this.state.vendors.length}
                        next={this.fetchvendors}
                        hasMore={this.state.hasMoreData}
                        loader={<Loader active inline='centered' />}

                        endMessage={
                            <p>
                                <b>No More Vendors</b>
                            </p>
                        }
                    >
                        <div className="brands-wrapper">
                            {
                                vendors.length ?
                                    vendors.map((vendor) => {
                                        return <div className="brand-card">
                                            <div>
                                                <Link to={"/vendor/" + vendor.handle}>
                                                    {/* <img src={brand.image ? brand.image.cdn_link : dummyBrandImage} alt="brandImage" /> */}
                                                    <h4>{vendor.name}</h4>
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
              this.state.totalvendorsToPaginate > this.state.vendorsLimit ?
                <Pagination
                  className="site-pagination"
                  activePage={this.state.activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(this.state.totalvendorsToPaginate / this.state.vendorsLimit)}
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
export default VendorsPage;
