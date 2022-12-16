import React from 'react';
import Axios from 'axios';
import PCB_Logo from '../src/assets/pcb-assets/pcblogo.png';
import './App.css';
import { isMobile } from "react-device-detect";
import Announcement from './components/shared/header/sections/Announcement'
import Header from './components/shared/header/Header1'
// import Navbar from './components/shared/header/sections/Navbar'
import Homepage from './components/views/homepage/Homepage';
import Footer from './components//shared/footer/Footer'
// import CategoriesPage from './components/CategoriesPage'
// import CategoryPageWrapper from './components/CategoryPageWrapper'
import BrandsPage from './components/views/BrandsPage'
import VendorsPage from './components/views/venders/VendorsPage'
import CollectionPage from './components/views/productsView/CollectionPage'
// import ProductPage from './components/ProductPage'
import Cart from './components/views/Cart'
import Checkout from './components/views/checkout/Checkout'
import Login from './components/views/customer/Login'
import Signup from './components/views/customer/Signup'
import Account from './components/views/customer/userAccount/Account'
import Search from './components/views/Search'
import Deals from './components/views/Deals'
import PasswordPage from './components/views/PasswordPage'
import ForgotPassword from './components/views/customer/ForgotPassword'
import ContactUs from './components/views/ContactUs'
import OrderDetailPage from './components/views/customer/userAccount/OrderDetailPage'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
  // useLocation,
  // Redirect,
} from "react-router-dom";
// import { matchPath, location } from "react-router";
import ProductPageWrapper from './components/views/productPage/ProductPageWrapper';
import MobileHeader from './components/shared/header/MobileHeader';
import { Loader } from 'semantic-ui-react'
// import MiniCart from './components/MiniCart';
import CustomPage from '../src/components/views/CustomPage';
import CategoriesPage from '../src/components/views/categoriesPage/CategoriesPage';
import AboutUs from './components/views/AboutUs';
import Careers from '../src/components/views/Career';
import TrackOrder from '../src/components/views/TrackOrder';
import ThankyouPage from './components/views/checkout/sections/ThankyouPage';
import VenderPage from './components/views/venders/VenderPage';
import wallet from './components/views/wallet/wallet';
import Protected from './authentication/Protected';
import ProtectedCheckout from './authentication/ProtectedCheckout';
// import { notify } from './firebase';
import ScrollButton from './components/shared/scrollButton/scrollButton';
import MerchandiseModal from './components/shared/modals/merchandiseModal/merchandiseModal';
import LandingPage from './components/views/landingPage/landingPage';
import SideCart from './components/views/SideCart';
import WishList from './components/views/wishList/WishList';
import { connect } from 'react-redux';
// import { setDefaultCountry } from './redux/slices/multiLocationSlice';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordChecked: false, //if password enabled api is checked
      passwordEnabled: false, //if passowrd enabled api returns true
      showHeaderFooter: window.location.href.includes('checkout') || window.location.href.includes('thankyou') ? false : true,
      header: null,
      country: null,
      location: window.location.pathname
    }
    this.changePasswordEnabledState = this.changePasswordEnabledState.bind(this)
  }

  changePasswordEnabledState = () => {
    this.setState({
      passwordEnabled: false
    })
  }

  componentDidMount() {

    this.setState({
      country: this.props?.country,

    }, () => {
      this.getHeader()
    })

    if (sessionStorage.getItem('passwordMatched') === 'true') {
      this.setState({
        passwordEnabled: false,
        passwordChecked: true
      });

    }
    else {

      Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/check_protect_password')
        .then((response) => {
          // handle success
          // console.log(response)
          // debugger
          this.setState({
            passwordChecked: true,
            passwordEnabled: response.data.enable_password
          })
        })
        .catch((err) => {
          console.log(err)
        })

    }
    //firebase function call
    // notify();
  }

  componentDidUpdate() {
    document.querySelector('body').scrollTo({ top: 0, behavior: 'smooth' })
  }

  getHeader() {
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header').then((res => {
      // const footer = res.data;
      // debugger
      this.setState({
        header: res.data?.header,
        categories: res.data?.header?.navigation_bar?.category_structure
      })

      // debugger

      // if (this?.props?.country === "" || res?.data?.header?.country_list[0]) {
      if (this?.props?.country === "") {
        // this?.props?.dispatch(setDefaultCountry(res?.data?.header?.country_list[0]));
      }

      // console.log("header", res.data);
    }))
      .catch((err) => {
        console.log("Error", err)
      })
  }

  render() {

    return (
      <div className="App">

        {
          this.state.passwordChecked ?
            <header className="App-header" >
              {this.state.passwordEnabled ?
                <PasswordPage changePasswordEnabledState={this.changePasswordEnabledState} />
                :
                <Router>
                  {
                    this.state.showHeaderFooter ?
                      isMobile && this.state.location !== '/' ?
                        <>
                          <MobileHeader />
                          <Announcement announcement={this.state.header} />
                          <ScrollButton />
                        </>
                        :
                        <>
                          {
                            this.state.header && this.state.location !== '/' ?
                              <>
                                <Header header={this.state.header} />
                                <Announcement announcement={this.state.header} />
                                <ScrollButton />
                                <MerchandiseModal />
                              </>
                              : null
                          }
                        </>
                      : null
                  }
                  <Switch>

                    <Route exact path="/"><LandingPage /></Route>

                    <Route exact path="/home">
                      <Homepage />
                    </Route>

                    <Route path="/categories/:catHandle" component={CategoriesPage} />

                    <Route path="/brands/all">
                      <BrandsPage />
                    </Route>

                    <Route path="/vendors/all">
                      <VendorsPage />
                    </Route>

                    <Route exact path="/collection/:handle" component={CollectionPage} />
                    <Route exact path="/brand/:handle" component={CollectionPage} />
                    <Route exact path="/promotions/:handle" component={CollectionPage} />
                    <Route exact path="/vendor/:handle" component={CollectionPage} />

                    <Route path="/product/:handle" component={ProductPageWrapper} />

                    <Route path="/cart">
                      <Cart />
                    </Route>

                    <Route path="/sidecart">
                      <SideCart />
                    </Route>

                    <Route path="/trackyourorder" component={TrackOrder} />
                    <Route path="/trackyourorder/error" component={TrackOrder} />
                    <Route path="/orderDetail/:id" component={OrderDetailPage} />
                    <Route path="/forgotPassword/:token" component={ForgotPassword} />
                    <Route path="/page/contactus" component={ContactUs} />
                    <Route path="/page/aboutus" component={AboutUs} />
                    <Route path="/page/careers" component={Careers} />
                    <Route path="/sellwithus" component={VenderPage} />

                    <Route exact path="/page/:pageHandle" component={CustomPage} />

                    <Route path="/login">
                      <Login />
                    </Route>

                    <Route path="/signup">
                      <Signup />
                    </Route>

                    <Protected path="/account" component={() => <Account />} />

                    <Protected path="/wallet" component={wallet} />
                    <Route path="/wishlist">
                      <WishList />
                    </Route>

                    <Route path="/search/:q" component={Search} ></Route>

                    <Route path="/deals">
                      <Deals />
                    </Route>

                    <ProtectedCheckout path="/checkout" component={() => <Checkout />} />

                    <Route path="/thankyou/:id" exact component={ThankyouPage} ></Route>

                    <Route>
                      <div className="page-notfound">
                        <div className="container-xl">
                          <h3>404 Not Found</h3>
                        </div>
                      </div>
                    </Route>

                  </Switch>
                  {
                    this.state.showHeaderFooter && this.state.location !== '/' ?
                      <Footer />
                      : null
                  }

                </Router>
              }
            </header>
            :
            <div className="homepage-loader">
              <div className="kees-loader">
                <img style={{ width: '180px', height: 'auto' }} src={PCB_Logo} alt="" />
                <Loader active inline='centered' />
              </div>
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rates: state?.currency?.rates,
    country: state?.multiLocation?.defaultCountry
  };
};

export default connect(mapStateToProps)(App);
