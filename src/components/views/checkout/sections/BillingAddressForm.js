import React, { Component } from 'react'
import { Input, Dropdown } from 'semantic-ui-react'
import {
  validatePhoneNumber,
  //countryOptions,
  //cityOptions,
} from '../../../../services/context'
import Axios from 'axios'

export default class BillingAddressForm extends Component {
  state = {
    firstName: { valid: false, value: '' },
    lastName: { valid: false, value: '' },
    address: { valid: false, value: '' },
    phoneNo: { valid: false, value: '' },
    appartment: { valid: false, value: '' },
    city: { valid: false, value: '' },
    country: { valid: false, value: '' },
    countryList: [],
    cityList: [],
    defaultCountry: this.props?.defaultCountry,

    postalCode: { valid: false, value: '' },
    formValid: false,
  }

  getCountries = () => {
    debugger
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/order/countries').then(
      (response) => {
        let countries = []
        // if default country pakistan then in shipping address dropdown show pakistan. If rest of world is selected then remove pakistan from list
        if (this.state.defaultCountry === 'Pakistan') {
          countries.push(
            response?.data?.find(
              (country) => country.text === this.state.defaultCountry
            )
          )
          countries = [
            { ...countries[0], flag: countries[0].flag?.toLowerCase() },
          ]
        } else {
          const newCountries = response?.data?.map((country) => {
            return {
              ...country,
              flag: country.flag?.toLowerCase(),
            }
          })
          countries = newCountries.filter(
            (country) => country.text !== 'Pakistan'
          )
        }

        this.setState({ countryList: countries }, () => {
          if (this.state.country?.value) {
            // debugger;
            let country = response.data.find(
              (country) => country?.value === this.state.country?.value
            )

            if (country) {
              this.getCities(country.key)
            }
          } else {
            this.setState({
              country: { value: response?.data[0]?.value, valid: true },
            })
            this.getCities(response?.data[0]?.key)
          }
        })
      }
    )
  }

  getCities = (countryId) => {
    Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
        '/order/cities?country_id=' +
        countryId
    ).then((response) => {
      this.setState({ cityList: response.data })
    })
  }
  handleDropDownSelect = (event, data) => {
    this.setState({
      [data.name]: { valid: true, value: data.value },
    })
    if (data.name === 'country') {
      let country = this.state.countryList.find(
        (country) => country.value === data.value
      )
      this.getCities(country.key)
    }
  }
  componentDidMount() {
    this.getCountries()

    let billingAddress = JSON.parse(localStorage.getItem('billingAddress'))
    if (billingAddress) {
      this.setState(
        {
          firstName: billingAddress.first_name,
          lastName: billingAddress.last_name,
          address: billingAddress.address,
          phoneNo: billingAddress.phone,
          appartment: billingAddress.apartment,
          city: billingAddress.city,
          country: billingAddress.country,
          postalCode: billingAddress.postal_code,
        },
        () => {
          this.setBillingAddress()
        }
      )
    }
  }

  handleRadioChange = (e, data) => {
    this.setState({
      billingAddress: data.value,
    })
  }

  ifIncludesNumber = (input) => {
    var hasNumber = /\d/
    return hasNumber.test(input)
  }

  handleRangeChange = (e) => this.setState({ activeIndex: e.target.value })
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

  // handleDropDownSelect = (event, data) => {
  //   // debugger
  //   this.setState(
  //     {
  //       [data.name]: { valid: true, value: data.value },
  //     },
  //     () => {
  //       this.setBillingAddress()
  //     }
  //   )
  // }

  setBillingAddress = () => {
    const {
      firstName,
      lastName,
      address,
      appartment,
      city,
      country,
      postalCode,
      phoneNo,
    } = this.state

    let billingAddress = {
      first_name: firstName,
      last_name: lastName,
      phone: phoneNo,
      address: address,
      apartment: appartment,
      city: city,
      country: country,
      postal_code: postalCode,
    }

    this.props.setBillingAddress(billingAddress)
    localStorage.setItem('billingAddress', JSON.stringify(billingAddress))
  }

  handleChange = (event) => {
    let { name, value } = event.target
    this.setState(
      {
        [name]: { valid: true, value: value },
      },
      () => {
        this.setBillingAddress()

        if (name === 'firstName' || name === 'lastName' || name === 'city') {
          let ifIncludesNumber = this.ifIncludesNumber(value)
          if (ifIncludesNumber) {
            this.setState(
              {
                [name]: { valid: false, value: value },
              },
              () => {
                this.setBillingAddress()
              }
            )
          }
        }

        if (name === 'phoneNo') {
          let ifPhoneNo = validatePhoneNumber(this.state[name].value)
          if (!ifPhoneNo) {
            this.setState(
              {
                [name]: { valid: false, value: value },
              },
              () => {
                this.setBillingAddress()
              }
            )
          }
        }

        if (
          name === 'address' ||
          name === 'city' ||
          name === 'country' ||
          name === 'postalCode' ||
          name === 'firstName' ||
          name === 'lastName' ||
          name === 'phoneNo'
        ) {
          if (value === '') {
            this.setState(
              {
                [name]: { valid: false, value: value },
              },
              () => {
                this.setBillingAddress()
              }
            )
          }
        }
      }
    )
  }

  render() {
    // const countryOptions = [
    //   { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
    //   { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
    //   { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
    //   { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
    //   { key: 'as', value: 'as', flag: 'as', text: 'American Samoa' },

    // ]

    // const { activeIndex, cartDetail, country, address, city, customerEmailPhone, firstName, lastName, phoneNo, postalCode } = this.state
    return (
      <div className='billing-address-form'>
        <form onSubmit={this.continueToPayment}>
          <div className='tabInfo__shipping-info-head'>
            <h4>Billing Address</h4>
          </div>
          <div className='tabInfo__shipping-info-content'>
            <div className='k-row persnalInfo'>
              <div className='input-wrapper-half'>
                <Input
                  id='customer-fname'
                  value={this.state.firstName.value}
                  onChange={this.handleChange}
                  name='firstName'
                  required
                  type='text'
                  placeholder='First name'
                />
                {this.state.firstName.valid === false &&
                this.state.firstName.value !== '' ? (
                  <span className='error' name='firstName'>
                    First Name Should not include nubmers
                  </span>
                ) : null}
              </div>
              <div className='input-wrapper-half'>
                <Input
                  id='customer-lname'
                  name='lastName'
                  value={this.state.lastName.value}
                  onChange={this.handleChange}
                  required
                  type='text'
                  placeholder='Last name'
                />
                {this.state.lastName.valid === false &&
                this.state.lastName.value !== '' ? (
                  <span className='error' name='lastname'>
                    Last Name Should not include nubmers
                  </span>
                ) : null}
              </div>
            </div>
            <div>
              <Input
                id='customer-address'
                value={this.state.address.value}
                onChange={this.handleChange}
                name='address'
                required
                type='text'
                placeholder='Address'
              />
            </div>
            <div>
              <Input
                id='customer-phoneno'
                value={this.state.phoneNo.value}
                onChange={this.handleChange}
                name='phoneNo'
                required
                type='number'
                placeholder='Your Phone no'
              />
              {this.state.phoneNo.valid === false &&
              this.state.phoneNo.value !== '' ? (
                <span className='error' name='phoneNo'>
                  Enter valid phone number (00974 xxxx xxxx)
                </span>
              ) : null}
            </div>

            <Input
              id='customer-appartment'
              value={this.state.appartment.value}
              onChange={this.handleChange}
              name='appartment'
              type='text'
              placeholder='Appartment, suite, etc. (optional)'
            />
            <div className='cityField'>
              <Dropdown
                required
                placeholder='Select Country'
                fluid
                search
                name='country'
                selection
                id='customer-country'
                onChange={this.handleDropDownSelect}
                options={this.state.countryList}
                value={this.state.country.value}
              />
            </div>

            <div class='countryZipField'>
              <div className='cityField'>
                {/* <Input id='customer-city' value={this.state.city.value} onChange={this.handleChange} name="city" required type="text" placeholder='City' /> */}
                <Dropdown
                  required
                  id='customer-city'
                  placeholder='Select City'
                  fluid
                  search
                  name='city'
                  selection
                  onChange={this.handleDropDownSelect}
                  // onChange={this.handleChange}
                  options={this.state.cityList}
                  // value={this.state.country.value}
                  value={this.state.city.value}
                />
                {this.state.city.valid === false &&
                this.state.city.value !== '' ? (
                  <span className='error' name='phoneNo'>
                    Enter valid City name
                  </span>
                ) : null}
              </div>
              <div className='input-wrapper-half'>
                <Input
                  id='customer-postal-code'
                  value={this.state.postalCode.value}
                  onChange={this.handleChange}
                  name='postalCode'
                  required
                  type='number'
                  placeholder='Postal code'
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
