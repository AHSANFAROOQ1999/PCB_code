import React from "react";
import { Icon } from "semantic-ui-react";
// import axios from "axios";
/*images*/
// import keesLogo from '../assets/img/keesLogo.png';
// import userIcon from "../../../assets/svg/userIcon.svg";
// import walleticon from "../../../assets/svg/wallet.svg";
// import cartIcon from '../assets/svg/cartIcon.svg';
import SearchSuggestions from "../../shared/header/sections/SearchSuggestion";
// import Axios from 'axios';
// import MiniCart from "../header/sections/MiniCart";
// import { keesLogoHeader } from '../../../services/context'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./sections/Navbar";

// import { Modal, Button } from 'antd';
import { Modal } from "semantic-ui-react";

// import ReactFlagsSelect from "react-flags-select";

import {
  changeCountry,
  changeCountryCode,
  changeCurrency,
} from "../../../redux/slices/multiLocationSlice";
import { clearCart } from "../../../redux/slices/cartSlice";

class Headerr1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      categories: props.header.navigation_bar.category_structure,
      selectedCategory: "",
      header: props.header,
      visible: false,
      open: false,

      selectedCountry: this.props?.selectedCountry,
    };
    // console.log("Header Props", props);
  }

  componentDidMount() {
    // debugger
    this.setState({
      selectedCountry: this.props?.selectedCountry
    }, () => {
      // this.location(this.state?.selectedCountry)
    })
  }

  componentDidUpdate() {
    if (this.state?.selectedCountry !== this.props?.selectedCountry) {
      this.setState({
        selectedCountry: this.props?.selectedCountry
      }, () => { })
    }
  }

  countries = this.props?.header?.country_list?.map(
    (country) => country?.short_code
  );


  location(code) {
    // debugger;

    let country = this.props?.header?.country_list.find(
      (country) => country.short_code === code
    );

    this.props.dispatch(changeCountry(country?.country_name));
    this.props.dispatch(changeCountryCode(code));
    this.props.dispatch(changeCurrency(country?.currency));

    if (this.props.country !== country?.country_name) {
      this.props.dispatch(clearCart());
    }

    localStorage.removeItem("cart");
    localStorage.removeItem("wishList");
    localStorage.removeItem("checkout_id");
  };


  // componentDidMount() {
  //   debugger
  //   Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/categories_list')
  //     .then((res) => {
  //       debugger
  //       this.setState({
  //         categories: res.data
  //       })
  //     })
  //   // this.updateMiniCart()

  // }

  // header integration

  // componentDidMount() {
  //   // axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header').then((res => {
  //   //   // const footer = res.data;
  //   //   // debugger
  //   //   this.setState({
  //   //     header: res.data.header,
  //   //     categories: res.data.header.navigation_bar.category_structure
  //   //   });
  //   //   // console.log("header", res.data);
  //   // }))
  //   //   .catch((err) => {
  //   //     console.log("Error", err)
  //   //   })
  // }

  // updateSearchQuery = (query) => {
  //
  //   this.setState({
  //     searchQuery : query
  //   })
  // }

  // updateMiniCart = () => {
  //   let cart = JSON.parse(localStorage.getItem('cart'))
  //   if(cart)
  //   {
  //     let totalprice = 0
  //     for (let i = 0; i < cart.length; i++) {
  //       const lineitem = cart[i];
  //       totalprice += lineitem.detail.variantPrice.original_price * lineitem.detail.quantity

  //     }
  //     document.querySelector('.cart-total-quantity').innerHTML = totalprice
  //   }
  // }

  modal = () => {
    this.setState({
      open: true,
    });
  };

  close = () => {
    this.setState({
      open: false,
    });
  };

  onCurrencyChange = (data) => {
    this.props.dispatch(changeCurrency(data.value));
  };

  redirect = () => {
    // debugger
    // console.log(document.getElementById("country").value);
    let county = document.getElementById("country").value;

    if (county === 'Pakistan') {
      // debugger
      this.props?.dispatch(changeCountry("Pakistan"));
      this.props?.dispatch(changeCountryCode("PK"));
      this.props?.dispatch(changeCurrency("PKR"));
      this.props?.dispatch(clearCart());
    }
    else {
      // debugger
      this.props?.dispatch(changeCountry("United States of America"));
      this.props?.dispatch(changeCountryCode("US"));
      this.props?.dispatch(changeCurrency("USD"));
      this.props?.dispatch(clearCart());
    }
  }

  render() {
    const header = this.state.header;

    const categoriesOptions = [
      {
        key: "all",
        text: "All Categories",
        value: "",
      },
    ];

    // const currencyOptions = [
    //   {
    //     key: "PKR",
    //     text: "PKR",
    //     value: "PKR",
    //   },
    //   {
    //     key: "USD",
    //     text: "USD",
    //     value: "USD",
    //   },
    // ];

    for (let i = 0; i < this.state.categories.length; i++) {
      const category = this.state.categories[i];
      let obj = {
        key: category.handle,
        text: category.name,
        value: category.handle,
      };
      categoriesOptions.push(obj);
    }

    return (
      <>
        <div className="nav-header">
          {/* <div className="container-xl"> */}
          <div className="k-row">
            <div className="logo flex--1">
              <Link to="/home">
                <div>
                  <img src={header ? header.header.logo_image : null} alt="" />
                </div>
              </Link>
            </div>

            <div className="navbar-classification">
              <div className="uper_nav">
                <button
                  type="button"
                  className="search_btn"
                  onClick={this.modal}
                >
                  <p>
                    <Icon name="search" />
                    Search
                  </p>
                </button>

                {/* <div className="currency-converter">
                  <Dropdown
                    text={this.props.currency}
                    options={currencyOptions}
                    onChange={(e, data) => this.onCurrencyChange(data)}
                  />
                </div> */}

                <div className="nav_user_options">
                  {sessionStorage.getItem("pcb-customer-token") ? (
                    <Link to="/account">
                      <p>
                        <Icon name="user" />
                        My Account
                      </p>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <p>
                        <Icon name="user" />
                        My Account
                      </p>
                    </Link>
                  )}

                  {/* <ReactFlagsSelect
                    selected={this.state?.selectedCountry}
                    countries={this.countries}
                    onSelect={(code) => this.location(code)}
                  /> */}

                  <select id="country" name="country" form="selectedCountry" onChange={this.redirect}>
                    <option value="Pakistan" selected={this.props?.selectedCountry === "PK" ? true : null}>Pakistan</option>
                    <option value="global" selected={this.props?.selectedCountry === "US" ? true : null}>Rest of the World</option>
                    {/* <option value="global" selected={true}>Rest of the World</option> */}
                  </select>

                  {/* <Link to="/wishlist">
                      <p> <Icon name='like' /> My Wishlist</p>
                    </Link> */}

                  {/* <MiniCart /> */}
                </div>
              </div>
              <div className="pcb_nav">
                <Navbar navbar={this.state.header} />
              </div>
            </div>
          </div>

          {/* </div> */}
        </div>

        <div className="search_modal">
          <Modal
            // dimmer='blurring'
            centered={true}
            closeIcon
            size="fullscreen"
            onClose={() => this.setState({ open: false })}
            open={this.state.open}
          >
            <Modal.Header>Search...</Modal.Header>
            <Modal.Content image>
              <SearchSuggestions
                cat={this.state.selectedCategory}
                updateSearchQuery={this.updateSearchQuery}
                close={this.close}
              />
              {/* <Image size='large' src={ModalImg} wrapped /> */}
            </Modal.Content>
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state?.account?.loggedIn,
    currency: state?.currency?.currency,
    country: state?.multiLocation?.defaultCountry,
    selectedCountry: state?.multiLocation?.defaultCountryCode
  };
};

export default connect(mapStateToProps)(Headerr1);
