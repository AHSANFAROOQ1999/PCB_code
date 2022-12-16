import React from 'react'
// import { Input, Button } from "semantic-ui-react";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import { connect } from 'react-redux';
import Axios from "axios";
import { Link } from "react-router-dom";
class WishList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wishList: [],
      wishListEmpty: false,
      country: this.props?.country,
    }
  }


  componentDidMount() {

    this.setState({
      country: this.props?.country
    })

    if (localStorage.getItem("wishList")) {
      let wishlist = JSON.parse(localStorage.getItem("wishList"));

      this.setState({
        wishList: wishlist
      });

      if (wishlist) {
        if (!wishlist.length) {
          this.setState({ wishListEmpty: true });
        } else {
          this.setState({ wishListEmpty: false });
        }
      }

    }

  }

  componentDidUpdate() {
    // debugger

    if (this.state?.country !== this.props?.country) {
      localStorage.removeItem("wishList");

      this.setState({
        wishList: [],
        wishListEmpty: true,
        country: this.props?.country
      })

    }

    // if (this.props?.defaultCountry) {
    //   if (this.props?.defaultCountry != this.state?.country) {
    //     localStorage.removeItem("wishList");
    //     this.setState({
    //       wishList: [],
    //       wishListEmpty: true,
    //       country: this.props?.defaultCountry
    //     })
    //   }
    // }
  }

  // getWishList = () => {
  //   Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist_list', {
  //     headers: {
  //       "pushpa": sessionStorage.getItem('pcb-customer-token')
  //     }
  //   })
  //   .then((response) => {
  //     this.setState({
  //       wishList: response.data.results
  //     })
  //       if (response.data.results.length == 0) {
  //         this.setState({ wishListEmpty: true });
  //       } else {
  //         this.setState({ wishListEmpty: false });
  //       }
  //   })
  // }

  deleteWishList = (e, variantID) => {
    let doesExist = false;
    let i = 0;
    let wishlist = JSON.parse(localStorage.getItem("wishList"));
    if (localStorage.getItem("wishList")) {
      for (i; i < wishlist.length; i++) {
        if (wishlist[i].variant_id === variantID) {
          doesExist = true
          break
        }
      }
    }
    if (sessionStorage.getItem('pcb-customer-token')) {
      Axios.delete(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist?variiant_id=' + variantID, {
        headers: {
          "pushpa": sessionStorage.getItem('pcb-customer-token')
        }
      })
        .then((response) => {
          if (doesExist) {
            wishlist.splice(i, 1);
            localStorage.setItem('wishList', JSON.stringify(wishlist));
            this.setState({
              wishList: wishlist
            });

            if (!wishlist.length) {
              this.setState({ wishListEmpty: true });
            } else {
              this.setState({ wishListEmpty: false });
            }

          }
        })
    } else {
      if (doesExist) {
        wishlist.splice(i, 1);
        localStorage.setItem('wishList', JSON.stringify(wishlist));
        this.setState({
          wishList: wishlist
        });

        if (!wishlist.length) {
          this.setState({ wishListEmpty: true });
        } else {
          this.setState({ wishListEmpty: false });
        }

      }
    }


  }

  render() {
    // debugger
    let wishlist = this.state?.wishList
    return (
      <div className="wish-list-page">
        <div className="container-xl">

          <h3 style={{ textAlign: "center" }}>My Wishlist</h3>

          {/* <div className="breadcrumbs">
            <p>
              Home / <span>Your Wishlist</span>
            </p>
          </div> */}

          <div className="wish-list-wrapper">
            <div>
              <table>
                <tr>
                  <th>
                    <p>Product</p>
                  </th>
                  <th>
                    <p>Price</p>
                  </th>
                  <th>
                    <p>SKU</p>
                  </th>
                  <th>
                    <p>Remove</p>
                  </th>
                </tr>

                {wishlist?.length && wishlist[0] != null
                  ? wishlist?.map((data, index) => {
                    // debugger
                    const items = data.product_data ? data.product_data : data;
                    return (
                      <tr variantId={items?.variant_id} key={index}>
                        <td>
                          <div className="k-row">
                            <Link to={"/product/" + items?.product_handle}>
                              <div className="cart-product-img">
                                <img
                                  className=""
                                  src={
                                    items?.image
                                      ? items?.image
                                      : ''
                                  }
                                  alt=""
                                />
                              </div>
                            </Link>
                            <div className="cart-product-title-wrap">
                              <h5>
                                <Link
                                  to={"/product/" + items?.product_handle}
                                >
                                  {items?.title}
                                </Link>
                              </h5>
                              <p className="cart-item-brand">
                                {items?.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="cart-item-price">
                            <span>Price: </span>
                            {this.props?.defaultCurrency} &nbsp;
                            {items?.variant_price?.original_price ? items?.variant_price?.original_price : items?.variant_price}
                          </p>
                        </td>
                        <td>
                          <p className="cart-item-total-price">
                            {items?.sku}
                          </p>
                        </td>

                        <td>
                          <button
                            variantId={items?.variant_id}
                            onClick={(e) => this.deleteWishList(e, items?.variant_id)}
                            className="delete-button">
                            <img src={deleteIcon} alt="" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                  : null}
                {this.state.wishListEmpty ? (
                  <div className="empty-msg">
                    <h4>Wishlist Empty</h4>
                  </div>
                ) : null}
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  // debugger
  // console.log('wishlist', state);
  return {
    country: state?.multiLocation?.defaultCountry,
    defaultCurrency: state?.multiLocation?.defaultCurrency
  };
};

export default connect(mapStateToProps)(WishList);