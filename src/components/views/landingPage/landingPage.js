// import axios from 'axios';
import './landingPage.scss'
import { connect } from 'react-redux';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
// import ReactFlagsSelect from "react-flags-select";
import { clearCart } from '../../../redux/slices/cartSlice';
import { changeCountry, changeCountryCode, changeCurrency,
    //  countriesList, setDefaultCountry
     } from '../../../redux/slices/multiLocationSlice';

class landingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // defaultCountry: this.props?.defaultCountry,
            // countriesList: this?.props?.countriesList,
            // countries: []
        }
        // console.log(this.state.countriesList);
    }

    // componentDidMount() {
    //     this.getHeader()
    //     this.listofCountries()
    // }

    // async getHeader() {
    //     try {
    //         const response = await axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header')

    //         // console.log("response", response);

    //         this?.props?.dispatch(setDefaultCountry(response?.data?.header?.country_list[0]))
    //         this?.props.dispatch(countriesList(response?.data?.header?.country_list))

    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // listofCountries() {
    //     this.setState({
    //         countries: this.state?.countriesList?.map((country) => country?.short_code)
    //     }, () => { })
    // }

    // location(code) {
    //     let country = this.state?.countriesList?.find((country) => country?.short_code == code);

    //     this.props.dispatch(changeCountry(country?.country_name));
    //     this.props.dispatch(changeCountryCode(code));
    //     this.props.dispatch(changeCurrency(country?.currency));

    //     this.props.dispatch(clearCart());

    //     localStorage.removeItem("cart");
    //     localStorage.removeItem("wishList");
    //     localStorage.removeItem("checkout_id");

    // };

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

        window.location.href = '/home'
    }

    render() {
        return (
            <>
                {
                    this.state.redirectToHome ?
                        <Redirect exact to='/home' />
                        : <div className='landing_page'>

                            <div className='country_options'>

                                <form>
                                    <select id="country" name="country" form="selectedCountry">
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="global">Rest of the World</option>
                                    </select>

                                    {/* <ReactFlagsSelect
                                    className='country_select'
                                    selected={this.props?.defaultCountry}
                                    countries={this.state?.countries}
                                    onSelect={(code) => this.location(code)}
                                /> */}

                                    {
                                        this.state?.defaultCountry !== '' ?
                                            <button className='enter' type='button' onClick={this.redirect}>ENTER</button>
                                            : <button className='enter' disabled >ENTER</button>
                                    }
                                </form>
                            </div>

                        </div>
                }
            </>

        )
    }
}



const mapStateToProps = (state) => {
    return {
        // countriesList: state?.multiLocation?.countriesList,
        // defaultCountry: state?.multiLocation?.defaultCountryCode
    };
};

export default connect(mapStateToProps)(landingPage);