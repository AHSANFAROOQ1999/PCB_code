import Axios from 'axios'
import React from 'react'
import {
  Tab,
  Input,
  Dropdown,
  Radio,
  Icon,
  // Message,
  Checkbox,
} from 'semantic-ui-react'
// import keesLogo from '../../../../src/assets/img/keesLogo.png'
import PCBLogo from '../../../assets/pcb-assets/pcblogo.png'
import defaultImage from '../../../../src/assets/img/productImagePlaceholder.png'
import BillingAddressForm from './sections/BillingAddressForm'
// import ThankyouPage from './sections/ThankyouPage'
import { Link } from 'react-router-dom'
import {
  // countryOptions,
  // cityOptions,
  validatePhoneNumber,
  validateEmail,
} from '../../../services/context'
import KeesLoader from '../../shared/KeesLoader.js'
import Money from '../../shared/Money'
import { connect } from 'react-redux'

function roundToFloat(number, decimals) {
  if (!isNaN(number) && typeof number === 'number') {
    return number.toFixed(decimals)
  } else {
    return 0
  }
}

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      country: '',
      cartDetail: null,
      loginOption: '',
      customerEmailPhone: { valid: false, value: '' },
      firstName: { valid: false, value: '' },
      lastName: { valid: false, value: '' },
      address: { valid: false, value: '' },
      phoneNo: { valid: false, value: '' },
      appartment: { valid: false, value: '' },
      city: { valid: false, value: '' },
      country: { valid: false, value: '' },
      postalCode: { valid: true, value: '' },
      formValid: false,
      billingAddress: 'shippingAddress',
      billingAddressDetail: {},
      paymentMethods: [],
      selectedPaymentMethod: '',
      checkoutId: '',
      shippingAddress: {},
      shippingMethods: [],
      selectedShippingMethods: [],
      orderPlaced: false,
      thankyouPageDetail: {},
      customerAddresses: [],
      customerAddressesDropdown: [],
      selectedAddress: {},
      loading: false,
      countryList: [],
      cityList: [],
      discountCode: { valid: false, value: '' },
      discountApplied: null,
      discountRemoved: null,
      applied_promocodes: [],
      // applied_promocodes: ["test"],
      showWallet: false,
      wallet_amount: null,
      payByWallet: false,
      totalShipping: 0,
      customerToken: null,

      checkout_settings: {},

      defaultCountry: this.props?.defaultCountry,
      defaultCurrency: this.props?.defaultCurrency,
    }
  }

  setBillingAddress = (address) => {
    this.setState({
      billingAddressDetail: address,
    })
  }

  componentWillMount() {
    // debugger
    if (!localStorage.getItem('checkout_id')) {
      window.location.href = '/cart'
    }

    this.setState({
      defaultCountry: this.props?.defaultCountry,
    })
  }

  componentDidMount() {
    // debugger

    this.getWallet()
    this.checkout_settings()

    // window.fbq('track', 'InitiateCheckout', {
    //   content_type: "product_group",
    //   // content_ids: proName,
    //   value: this.state.cartDetail.total_price.total,
    //   num_items: this.state.cartDetail.list_items.length,
    //   currency: "PKR"
    // });

    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    this.setState({
      customerToken: sessionStorage.getItem('pcb-customer-token'),
    })

    // if (!checkout_id) {
    //   window.location.href = "/";
    // }

    //get customer addresses if customer is loged in
    if (sessionStorage.getItem('pcb-customer-token')) {
      let customerToken = sessionStorage.getItem('pcb-customer-token')

      Axios.get(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/account?token=' +
          customerToken
      )
        .then((response) => {
          // debugger
          this.setState({
            customerAddresses: response.data.address,
            customerEmailPhone: {
              valid: true,
              value: response.data.email
                ? response.data.email.trim()
                : response.data.phone,
              disabled: true,
            },
          })
          let addressess = []
          for (let i = 0; i < this.state.customerAddresses.length; i++) {
            const address = this.state.customerAddresses[i]

            let dummy = { key: i, text: address.address, value: address }
            addressess.push(dummy)
          }
          this.setState({
            customerAddressesDropdown: addressess,
          })
          this.handleAddressChange(null, addressess[0])
        })
        .catch((err) => {
          console.log(err)
        })
    }

    this.getLineItems()

    this.getCountries()

    // get payment methods
    Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
        '/order/payment_method_list?checkout_id=' +
        checkout_id
    )
      .then((response) => {
        // debugger
        // console.log('Payment Methods', response)

        // country pakistan - cod + hbl and international - alfla

        let newPaymentMethods = []
        response?.data?.map((pMethod) => {
          if (
            this.state.defaultCountry === 'Pakistan' &&
            (pMethod.type === 'manual' || pMethod.type === 'hbl')
          ) {
            newPaymentMethods.push(pMethod)
          }
          if (
            this.state.defaultCountry !== 'Pakistan' &&
            pMethod.type === 'baf'
          ) {
            newPaymentMethods.push(pMethod)
          }
        })

        this.setState({
          paymentMethods: newPaymentMethods,
          //response?.data,
          selectedPaymentMethod: newPaymentMethods[0]?.gateway_name,
          //response?.data[0]?.gateway_name,
        })
      })
      .catch((err) => {
        console.log(err)
      })

    if (localStorage.getItem('shippingAddress')) {
      this.setState({
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress'))
          .shipping_address,
      })
    }

    if (checkout_id) {
      this.setState({
        checkoutId: checkout_id,
      })
    }

    if (localStorage.getItem('shippingAddress')) {
      let customerInfo = JSON.parse(localStorage.getItem('shippingAddress'))
      let customerEmailPhone = customerInfo.email
        ? customerInfo.email
        : customerInfo.phone
      this.setState({
        firstName: {
          valid: true,
          value: customerInfo.shipping_address.first_name,
        },
        lastName: {
          valid: true,
          value: customerInfo.shipping_address.last_name,
        },
        address: { valid: true, value: customerInfo.shipping_address.address },
        appartment: {
          valid: true,
          value: customerInfo.shipping_address.apartment,
        },
        city: { valid: true, value: customerInfo.shipping_address.city },
        country: { valid: true, value: customerInfo.shipping_address.country },
        customerEmailPhone: { valid: true, value: customerEmailPhone },
        phoneNo: { valid: true, value: customerInfo.shipping_address.phone },
        postalCode: {
          valid: true,
          value: customerInfo.shipping_address.postal_code,
        },
      })
    }
  }

  // componentDidUpdate() {
  //   // debugger
  //   // if (this.state?.country != this.props?.country) {
  //   //   this.getWallet();
  //   //   this.checkout_settings();
  //   // }
  // }

  checkout_settings = () => {
    Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
        '/storefront/checkout_setting' +
        '?token=' +
        sessionStorage.getItem('pcb-customer-token')
    ).then((response) => {
      this.setState({
        checkout_settings: response?.data,
      })
    })
  }

  getWallet = () => {
    if (
      sessionStorage.getItem('pcb-customer-id') &&
      sessionStorage.getItem('pcb-customer-token')
    ) {
      Axios.get(
        process.env.REACT_APP_BACKEND_HOST +
          '/storefront/get_wallet/' +
          sessionStorage.getItem('pcb-customer-id') +
          '?token=' +
          sessionStorage.getItem('pcb-customer-token')
      ).then((response) => {
        // console.log("Wallet", response.data);
        this.setState({
          wallet_amount: parseInt(response?.data?.value),
          // redeemPoints: response.data.loyalty_points.points
        })
        if (response?.data?.value > 0) {
          // debugger
          this.setState({
            showWallet: true,
            payByWallet: true,
          })
        }
      })
    }
  }

  getLineItems = () => {
    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    Axios.post(
      process.env.REACT_APP_BACKEND_HOST + '/order/checkout_line_items',
      {
        checkout_id: checkout_id,
      }
    ).then((response) => {
      if (response) {
        // cartDetail: response.data,
        let subTotal = 0
        this.setState({
          applied_promocodes: response.data.applied_promocodes,
        })
        response.data.list_items.forEach((pg) => {
          pg.items.forEach((item) => {
            subTotal += item.total_price
          })
        })
        let total_shipping = this.state.cartDetail?.total_price?.shipping_amount

        if (total_shipping) {
          response.data.total_price = {
            subtotal: subTotal,
            total: subTotal + total_shipping,
            shipping_amount: total_shipping,
          }
        } else {
          response.data.total_price = {
            subtotal: subTotal,
            total: subTotal,
            shipping_amount: 0,
          }
        }
        this.setState({
          cartDetail: response.data,
          discountApplied: response.data.is_promocode
            ? response.data.is_promocode
            : null,
        })
      }
    })
  }

  tagDelete = (promo) => {
    // let applied_promocodes = this.state.applied_promocodes.length
    // let newPromoCodes = this.state.applied_promocodes
    // debugger
    // for (let i = 0; i < applied_promocodes; i++) {
    //   if (this.state.applied_promocodes[i] == promo) {
    //     newPromoCodes.splice(i, 1)
    //     this.setState({
    //       applied_promocodes: newPromoCodes
    //     })
    //   }
    // }

    this.removeDiscountCode(promo)
  }

  getCountries = () => {
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

  getShippings = () => {
    let checkout_id = localStorage.getItem('checkout_id')
      ? localStorage.getItem('checkout_id')
      : null

    let body = {
      checkout_id: checkout_id,
      country: this.state?.defaultCountry,
    }

    Axios.post(
      process.env.REACT_APP_BACKEND_HOST + '/order/shipping_price',
      body
    )
      .then((response) => {
        let dummyShipping = response.data.total_price

        dummyShipping.map((shipping) => {
          if (shipping.shipping_rule.length) {
            shipping.selectedShippingMethod = shipping.shipping_rule[0].name
          }
        })

        this.setState(
          {
            shippingMethods: dummyShipping,
          },
          () => {
            let proName = []
            this.getTotalShipping()
            JSON.parse(localStorage.getItem('cart')).forEach((x) => {
              proName.push(x.detail.title)
            })
          }
        )
        // console.log('response for shipping price', response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getTotalShipping = () => {
    let totalShipping = 0
    this.state.shippingMethods.forEach((shipping) => {
      let selectedShipping = shipping.shipping_rule.find(
        (shippingRule) => shippingRule.name === shipping.selectedShippingMethod
      )
      totalShipping += selectedShipping.shipping_amount
    })

    let cartdetail = this.state.cartDetail
    cartdetail.total_price.shipping_amount = totalShipping
    cartdetail.total_price.total =
      cartdetail.total_price.subtotal + cartdetail.total_price.shipping_amount
    this.setState({ cartDetail: cartdetail })
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

  // continueToShipping = () => {
  //   this.setState({
  //     activeIndex: 1
  //   })
  // }

  totalOrderAmount() {
    let total = 0
    if (this.state.cartDetail?.total_price.subtotal) {
      total += this.state.cartDetail.total_price.subtotal
    }
    if (this.state.cartDetail.total_price.shipping_amount) {
      total += this.state.cartDetail.total_price.shipping_amount
    }
    return roundToFloat(total, 2)
  }

  continueToShipping = (e) => {
    // this.setState({
    //   activeIndex: 1
    // })
    e.preventDefault()
    let emailOrPhone = this.state?.customerEmailPhone?.value
    let firstName = this.state?.firstName?.value
    let lastName = this.state?.lastName?.value
    let address = this.state?.address?.value
    let shippingPhoneno = this.state?.phoneNo?.value
    let appartment = this.state?.appartment?.value
    let city = this.state?.city?.value
    let country = this.state?.country?.value
    let postalCode = this.state?.postalCode?.value

    let ifEmail, email, phoneNo, shipping_address, checkout_id, body, ifPhoneNo

    if (
      !emailOrPhone ||
      !firstName ||
      !address ||
      !city ||
      !country ||
      !shippingPhoneno
    ) {
      alert('Fill the complete form')
    } else {
      ifEmail = validateEmail(emailOrPhone)
      ifPhoneNo = validatePhoneNumber(emailOrPhone)
      // let country = this.state?.country

      // debugger;
      if (ifEmail || ifPhoneNo) {
        let shippingPhonenoIsCorrect = validatePhoneNumber(shippingPhoneno)

        if (shippingPhonenoIsCorrect) {
          if (ifEmail) {
            email = emailOrPhone
            phoneNo = null
          } else {
            email = null
            phoneNo = emailOrPhone
          }

          shipping_address = {
            first_name: firstName,
            last_name: lastName,
            phone: shippingPhoneno,
            address: address,
            apartment: appartment,
            city: city,
            country: country,
            postal_code: postalCode,
          }

          checkout_id = localStorage.getItem('checkout_id')
            ? localStorage.getItem('checkout_id')
            : null

          // debugger

          body = {
            shipping_address: shipping_address,
            checkout_id: checkout_id,
            email: email,
            phone: phoneNo,
            country: this.state?.defaultCountry,
          }

          if (sessionStorage.getItem('pcb-customer-id')) {
            body['customer'] = sessionStorage.getItem('pcb-customer-id')
          }

          Axios.put(
            process.env.REACT_APP_BACKEND_HOST + '/order/checkout',
            body
          )
            .then((response) => {
              // console.log(response)
              setTimeout(() => {
                this.setState({ loading: false })
              }, 500)
              this.setState(
                {
                  activeIndex: 1,
                  shippingAddress: response.data.shipping_address,
                },
                () => this.setState({ loading: true })
              )

              this.getShippings()

              localStorage.setItem(
                'shippingAddress',
                JSON.stringify(response.data)
              )
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          document.querySelector('.phone-error').classList.add('show')
        }
      } else {
        document.querySelector('.email-or-phone-error').classList.add('show')
      }
    }
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

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

  handleChange = (event) => {
    let { name, value } = event.target
    this.setState(
      {
        [name]: { valid: true, value: value },
      },
      () => {
        if (name === 'customerEmailPhone') {
          document
            .querySelector('.email-or-phone-error')
            .classList.remove('show')
          let ifEmail = validateEmail(this.state[name].value)
          let ifPhoneNo = validatePhoneNumber(this.state[name].value)
          if (!ifEmail && !ifPhoneNo) {
            document
              .querySelector('.email-or-phone-error')
              .classList.add('show')
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }

        if (name === 'firstName' || name === 'lastName' || name === 'city') {
          //
          let ifIncludesNumber = this.ifIncludesNumber(value)
          if (ifIncludesNumber) {
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }

        // if (name == 'phoneNo') {
        //   //
        //   let ifPhoneNo = validatePhoneNumber(this.state[name].value)
        //   if (!ifPhoneNo) {
        //     this.setState({
        //       [name]: { valid: false, value: value },
        //     })
        //   }
        // }

        if (
          name === 'address' ||
          name === 'city' ||
          name === 'country' ||
          name === 'postalCode'
        ) {
          if (value === '') {
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }
      }
    )
  }

  handleEmailChange = (event) => {
    let { name, value } = event.target
    this.setState(
      {
        [name]: { valid: true, value: value },
      },
      () => {
        if (name === 'customerEmailPhone') {
          document
            .querySelector('.email-or-phone-error')
            .classList.remove('show')
          let ifEmail = validateEmail(this.state[name].value)
          // let ifPhoneNo = validatePhoneNumber(this.state[name].value)
          if (!ifEmail) {
            document
              .querySelector('.email-or-phone-error')
              .classList.add('show')
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }

        if (name === 'firstName' || name === 'lastName' || name === 'city') {
          //
          let ifIncludesNumber = this.ifIncludesNumber(value)
          if (ifIncludesNumber) {
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }

        if (name === 'phoneNo') {
          //
          let ifPhoneNo = validatePhoneNumber(this.state[name].value)
          if (!ifPhoneNo) {
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }

        if (
          name === 'address' ||
          name === 'city' ||
          name === 'country' ||
          name === 'postalCode'
        ) {
          if (value === '') {
            this.setState({
              [name]: { valid: false, value: value },
            })
          }
        }
      }
    )
  }

  handlePaymentRadioChange = (e, data) => {
    this.setState({
      payByWallet: false,
      selectedPaymentMethod: data.value,
    })
  }

  handleCheckChange = (e) => {
    this.setState({
      payByWallet: !this.state.payByWallet,
      selectedPaymentMethod: 'COD (Cash on Delivery)',
    })
  }

  checkout = () => {
    // debugger
    this.setState({ loading: true })

    // window.fbq('track', 'Place Order',{
    //   emailOrPhone : this.state.customerEmailPhone.value,
    //   shippingPhoneno : this.state.phoneNo.value
    // });
    // console.log(window.fbq);

    let body = {
      payment_method: this.state.selectedPaymentMethod,
      checkout_id: this.state.checkoutId,
      billing_address: {},
      paid_by_wallet: this.state.payByWallet,
      country: this.state?.defaultCountry,
    }

    if (this.state.billingAddress === 'shippingAddress') {
      // delete this.state.shippingAddress.id
      body.billing_address = this.state.shippingAddress
    } else {
      const { billingAddressDetail } = this.state

      let billingAddress = {
        first_name: billingAddressDetail.first_name.value,
        last_name: billingAddressDetail.last_name.value,
        phone: billingAddressDetail.phone.value,
        address: billingAddressDetail.address.value,
        apartment: billingAddressDetail.apartment.value,
        city: billingAddressDetail.city.value,
        country: billingAddressDetail.country.value,
        postal_code: billingAddressDetail.postal_code.value,
      }
      body.billing_address = billingAddress
    }

    // debugger

    Axios.put(process.env.REACT_APP_BACKEND_HOST + '/order/checkout', body)

      .then((response) => {
        // debugger
        this.setState({
          totalShipping: parseInt(response?.total_shipping),
        })
        // console.log('checkout complete ', response)
        // debugger
        if (this.state?.selectedPaymentMethod || this.state?.payByWallet) {
          // debugger
          let orderBody = {
            checkout_id: this.state?.checkoutId,
            country: this.state?.defaultCountry,
          }

          // getting object of payment method agianst selected payment method
          const paymentObj = this.state.paymentMethods.find(
            (method) => method.gateway_name === this.state.selectedPaymentMethod
          )

          // debugger;

          if (paymentObj.type !== 'manual') {
            window.location.href = `${process.env.REACT_APP_BACKEND_HOST}/order/payment_method?gateway_type=${paymentObj.type}&checkout_id=${this.state.checkoutId}`
            return
          }

          Axios.post(
            process.env.REACT_APP_BACKEND_HOST + '/order/place_order',
            orderBody
          )
            .then((response) => {
              // alert('ORDER PLACED', response)
              // console.log(response)

              this.setState({
                orderPlaced: true,
                thankyouPageDetail: response,
                // loading: false,
              })

              window.location.href = '/thankyou/' + response?.data?.order_id
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          window.location.href =
            process.env.REACT_APP_BACKEND_HOST +
            `/paymentgateway/hbl_request?checkout_id=${this.state.checkoutId}`
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleAddressChange = (e, data) => {
    this.setState({
      selectedAddress: data.value,
      firstName: { valid: true, value: data.value.first_name },
      lastName: { valid: true, value: data.value.last_name },
      address: { valid: true, value: data.value.address },
      appartment: { valid: true, value: data.value.apartment },
      city: { valid: true, value: data.value.city },
      country: { valid: true, value: data.value.country },
      // customerEmailPhone : { valid: true, value : data.value.email ? data.value.email : data.value.phone   },
      phoneNo: { valid: true, value: data.value.phone },
      postalCode: { valid: true, value: data.value.postal_code },
    })
    let country = this.state.countryList.find(
      (country) => country.value === data.value.country
    )
    this.getCities(country.key)
  }

  getProductsByPG = (pgId) => {
    let cart = this.state.cartDetail.list_items
    let products = []
    let productsId = []
    let productGroups = Array.isArray(pgId) ? pgId : [pgId]

    if (cart.length) {
      for (let vendorProducts of cart) {
        for (let product of vendorProducts.items) {
          if (productGroups.indexOf(product.product_group) > -1) {
            products.push(
              <div key={product.id} className='product-thumbnail'>
                <img src={product.image} alt='Product image' />
                <p>{product.product}</p>
              </div>
            )
            productsId.push(product.id)
          }
        }
      }
    }
    let shipping = this.state.shippingMethods.find((shippingMethod) => {
      return (
        productGroups.indexOf(shippingMethod.product_group) > -1 ||
        productGroups === shippingMethod.product_group
      )
    })
    shipping.lineItems = productsId
    if (this.state.shippingMethods.length !== 1) {
      return products
    }
  }

  shippingMethodSelected = (shippingId, ruleName, pg, key) => {
    let dummy = this.state.shippingMethods
    let shippingOfSpecificPG = dummy.find((shipping) => {
      return shipping.product_group === pg
    })
    shippingOfSpecificPG.selectedShippingMethod = ruleName

    // dummy[key].selectedShippingMethod = ruleName
    this.setState({ shippingMethods: dummy }, () => {
      this.getTotalShipping()
    })
  }

  applyDiscountCode = () => {
    if (this.state.discountCode.valid) {
      let data = {
        promo_code: this.state.discountCode.value,
        checkout_id: this.state.checkoutId,
      }
      if (sessionStorage.getItem('pcb-customer-id')) {
        data.customer_id = sessionStorage.getItem('pcb-customer-id')
      }
      Axios.post(
        process.env.REACT_APP_BACKEND_HOST + '/discount/apply_promo',
        data
      )
        .then((response) => {
          if (response.status === 200) {
            // debugger
            this.setState({
              discountApplied: true,
              // applied_promocodes: [...this.state.applied_promocodes, this.state.discountCode]
            })
            this.getLineItems()
          }
        })
        .catch((resp) => {
          this.setState({ discountApplied: false })
        })
    }
  }

  removeDiscountCode = (promo) => {
    // debugger
    // if (this.state.applied_promocodes) {
    let data = {
      promo_code: promo,
      checkout_id: this.state.checkoutId,
    }
    if (sessionStorage.getItem('pcb-customer-id')) {
      data.customer_id = sessionStorage.getItem('pcb-customer-id')
    }
    Axios.delete(process.env.REACT_APP_BACKEND_HOST + '/discount/apply_promo', {
      data: data,
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            discountRemoved: true,
            // applied_promocodes: [...this.state.applied_promocodes, this.state.discountCode]
          })
          this.getLineItems()
        }
      })
      .catch((resp) => {
        this.setState({ discountRemoved: false })
      })
    // }
  }

  continueToPayment = () => {
    let dataToSend = this.state.shippingMethods.map((ship) => {
      return {
        shipping_id: ship.shipping_id,
        line_items: ship.lineItems,
        selected_rule: ship.selectedShippingMethod,
      }
    })

    this.state.loading = true

    let body = {
      checkout_id: this.state.checkoutId,
      shipping_methods: dataToSend,
      country: this.state?.defaultCountry,
    }

    if (sessionStorage.getItem('pcb-customer-id')) {
      body['customer'] = sessionStorage.getItem('pcb-customer-id')
    }
    Axios.put(
      process.env.REACT_APP_BACKEND_HOST + '/order/checkout',
      body
    ).then((response) => {
      // debugger
      this.state.loading = false
      this.setState({
        activeIndex: 2,
        totalShipping: response.data.total_shipping,
      })
      this.getLineItems()
    })
  }

  render() {
    const {
      // customerAddresses,
      activeIndex,
      cartDetail,
      country,
      address,
      city,
      customerEmailPhone,
      firstName,
      lastName,
      phoneNo,
      // postalCode,
    } = this.state

    let customerInfo = null
    if (localStorage.getItem('shippingAddress')) {
      customerInfo = JSON.parse(localStorage.getItem('shippingAddress'))
    }

    const panes = [
      {
        render: () => (
          <Tab.Pane>
            <div className='customer-information'>
              <div className='k-row tabInfo__contact-info-head'>
                <div className='contact-info-checkout'>
                  <h4>Contact Information</h4>
                </div>
                {sessionStorage.getItem('pcb-customer-token') ? null : (
                  <div className='account-login-option'>
                    <p>
                      Already have an account? &nbsp;
                      <span className='checkout-login'>
                        <Link
                          to='/login'
                          onClick={() =>
                            localStorage.setItem('redirectToCheckout', true)
                          }
                        >
                          Log in
                        </Link>
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <form onSubmit={this.continueToShipping}>
                <div className='tabInfo__contact-info-content'>
                  {!sessionStorage.getItem('pcb-customer-token') &&
                  this.state.checkout_settings.customer_contacts === 'both' ? (
                    <>
                      <Input
                        id='customer-email-phone'
                        name='customerEmailPhone'
                        value={this.state.customerEmailPhone.value}
                        onChange={this.handleChange}
                        disabled={this.state.customerEmailPhone.disabled}
                        required
                        type='text'
                        placeholder='Enter Email Address or Phone Number'
                      />
                      <span className='email-or-phone-error'>
                        Enter correct email (abc@xyz.com) or phone number
                      </span>
                      {/* (+92 xxx xxxxxxx) */}
                    </>
                  ) : (
                    <Input
                      id='customer-email-phone'
                      name='customerEmailPhone'
                      value={this.state.customerEmailPhone.value}
                      onChange={this.handleEmailChange}
                      disabled={this.state.customerEmailPhone.disabled}
                      required
                      type='text'
                      placeholder='Enter Email Address'
                    />
                  )}

                  {/* <Input id="customer-email-phone" name='customerEmailPhone' value={this.state.customerEmailPhone.value} onChange={this.handleChange} disabled={this.state.customerEmailPhone.disabled} required type="text" placeholder='Email or mobile phone number' /> */}
                  <span className='email-or-phone-error'>
                    Enter correct email (abc@xyz.com)
                  </span>
                  {/* <Checkbox label='Make my profile visible' /> */}
                </div>

                <div className='tabInfo__shipping-info-head'>
                  <h4>Shipping Address</h4>
                  {sessionStorage.getItem('pcb-customer-token') &&
                  this.state.customerAddressesDropdown.length ? (
                    <div className='customer-addresses'>
                      <span className='address-heading'>Your addresses</span>
                      <Dropdown
                        placeholder='select address'
                        onChange={this.handleAddressChange}
                        options={this.state.customerAddressesDropdown}
                        // placeholder='Choose an option'
                        selection
                        value={this.state.selectedAddress}
                      />
                    </div>
                  ) : null}
                </div>
                <div className='tabInfo__shipping-info-content'>
                  {this.state.checkout_settings.full_name === 'first_name' ? (
                    <>
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
                            type='text'
                            placeholder='Last name (Optional)'
                          />
                          {this.state.lastName.valid === false &&
                          this.state.lastName.value !== '' ? (
                            <span className='error' name='lastname'>
                              Last Name Should not include nubmers
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  {/* <div className="k-row persnalInfo">
                  <div className="input-wrapper-half">
                    <Input id="customer-fname" value={this.state.firstName.value} onChange={this.handleChange} name="firstName" required type="text" required placeholder='First name' />
                    {
                      this.state.firstName.valid == false && this.state.firstName.value != '' ?
                        <span className="error" name="firstName">First Name Should not include nubmers</span>
                        :
                        null
                    }
                  </div>
                  <div className="input-wrapper-half">
                    <Input id="customer-lname" name="lastName" value={this.state.lastName.value} onChange={this.handleChange} required type="text" placeholder='Last name' />
                    {
                      this.state.lastName.valid == false && this.state.lastName.value != '' ?
                        <span className="error" name="lastname">Last Name Should not include nubmers</span>
                        :
                        null
                    }
                  </div>
                </div> */}
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
                        Enter valid phone number
                      </span>
                    ) : null}
                  </div>
                  {/* <span className='phone-error'>Enter valid phone number (12345678)</span> */}
                  {this.state.checkout_settings.address_second_line ===
                  'required' ? (
                    <Input
                      id='customer-appartment'
                      value={this.state.appartment.value}
                      onChange={this.handleChange}
                      required
                      name='appartment'
                      type='text'
                      placeholder='Appartment, suite, etc.'
                    />
                  ) : this.state.checkout_settings.address_second_line ===
                    'optional' ? (
                    <Input
                      id='customer-appartment'
                      value={this.state.appartment.value}
                      onChange={this.handleChange}
                      name='appartment'
                      type='text'
                      placeholder='Appartment, suite, etc. (optional)'
                    />
                  ) : null}
                  {/* <Input id="customer-appartment" value={this.state.appartment.value} onChange={this.handleChange} name="appartment" type="text" placeholder='Appartment, suite, etc. (optional)' /> */}
                  <div className='cityField'>
                    {/* <Input id='customer-city' value={this.state.city.value} onChange={this.handleChange} name="city" required type="text" placeholder='City' /> */}
                    <Dropdown
                      required
                      placeholder='Select Country'
                      fluid
                      search
                      name='country'
                      selection
                      id='customer-country'
                      onChange={this.handleDropDownSelect}
                      options={this.state.countryList} //countryOptions
                      value={this.state.country.value}
                    />
                  </div>
                  <div className='countryZipField'>
                    <div className='cityField'>
                      <Dropdown
                        required
                        id='customer-city'
                        placeholder='Select City'
                        fluid
                        search
                        name='city'
                        selection
                        onChange={this.handleDropDownSelect}
                        options={this.state.cityList} //cityOptions
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
                      {this.state.checkout_settings.postal_code ===
                      'required' ? (
                        <Input
                          id='customer-postal-code'
                          value={this.state.postalCode.value}
                          required
                          onChange={this.handleChange}
                          name='postalCode'
                          type='number'
                          placeholder='Postal code'
                        />
                      ) : this.state.checkout_settings.postal_code ===
                        'optional' ? (
                        <Input
                          id='customer-postal-code'
                          value={this.state.postalCode.value}
                          onChange={this.handleChange}
                          name='postalCode'
                          type='number'
                          placeholder='Postal code (Optional)'
                        />
                      ) : null}

                      {/* <Input id="customer-postal-code" value={this.state.postalCode.value} onChange={this.handleChange} name="postalCode" type="number" placeholder='Postal code' /> */}
                    </div>
                  </div>
                  {/* <Checkbox label='Save this information for next time' /> */}
                  <div className='k-row informationAction'>
                    <a href='/cart'>
                      <Icon name='chevron left' /> Return to cart
                    </a>

                    {/* Continue Shipping Promo Validations ////////////////////////////////////////////////////////////// */}

                    {/* {console.log("promooooo", this.state.applied_promocodes.length)} */}
                    {this.state.checkout_settings?.promo_code === 'required' ? (
                      <>
                        {address.valid &&
                        country.valid &&
                        city.valid &&
                        customerEmailPhone.valid &&
                        firstName.valid &&
                        lastName.valid &&
                        phoneNo.valid &&
                        this.state.applied_promocodes.length ? (
                          <button className='primary-button' type='submit'>
                            CONTINUE TO SHIPPING
                          </button>
                        ) : (
                          <button
                            className='primary-button disabled'
                            type='submit'
                            disabled
                          >
                            CONTINUE TO SHIPPING
                          </button>
                        )}
                      </>
                    ) : this.state.checkout_settings?.promo_code ===
                      'optional' ? (
                      <>
                        {address.valid &&
                        country.valid &&
                        city.valid &&
                        customerEmailPhone.valid &&
                        firstName.valid &&
                        // lastName.valid &&
                        phoneNo.valid ? (
                          <button className='primary-button' type='submit'>
                            CONTINUE TO SHIPPING
                          </button>
                        ) : (
                          <button
                            className='primary-button disabled'
                            type='submit'
                            disabled
                          >
                            CONTINUE TO SHIPPING
                          </button>
                        )}
                      </>
                    ) : this.state.checkout_settings?.promo_code === 'hidden' ? (
                      <>
                        {address.valid &&
                        country.valid &&
                        city.valid &&
                        customerEmailPhone.valid &&
                        firstName.valid &&
                        // lastName.valid &&
                        phoneNo.valid ? (
                          <button className='primary-button' type='submit'>
                            CONTINUE TO SHIPPING
                          </button>
                        ) : (
                          <button
                            className='primary-button disabled'
                            type='submit'
                            disabled
                          >
                            CONTINUE TO SHIPPING
                          </button>
                        )}
                      </>
                    ) : null}

                    {/* {
                    (this.state.checkout_settings?.promo_code == "optional") ?
                      <>
                        {
                          address.valid && country.valid && city.valid && customerEmailPhone.valid && firstName.valid && lastName.valid && phoneNo.valid ?
                            <button className="primary-button" type="submit"  >CONTINUE TO SHIPPING</button>
                            : <button className="primary-button disabled" type="submit"  >CONTINUE TO SHIPPING</button>
                        }
                      </> : null
                  } */}

                    {/* {
                    (this.state.checkout_settings?.promo_code == "hidden") ?
                      <>
                        {
                          address.valid && country.valid && city.valid && customerEmailPhone.valid && firstName.valid && lastName.valid && phoneNo.valid ?
                            <button className="primary-button" type="submit"  >CONTINUE TO SHIPPING</button>
                            : <button className="primary-button disabled" type="submit"  >CONTINUE TO SHIPPING</button>
                        }
                      </> : null
                  } */}

                    {/* // {
                  //   address.valid && country.valid && city.valid && customerEmailPhone.valid && firstName.valid && lastName.valid && phoneNo.valid ?
                  //     <button className="primary-button" type="submit"  >CONTINUE TO SHIPPING</button>
                  //     : <button className="primary-button disabled" type="submit"  >CONTINUE TO SHIPPING</button>
                  // } */}
                  </div>
                </div>
              </form>
            </div>
          </Tab.Pane>
        ),
      },
      {
        render: () => (
          <Tab.Pane>
            <div className='shipping-tab'>
              <div className='checkout__ShippingTab-record'>
                <div className='checkout__ShippingTab-item'>
                  <p>Contact</p>
                  <p>
                    {this.state.shippingAddress
                      ? this.state.shippingAddress.phone
                      : null}
                  </p>
                  <button onClick={() => this.setState({ activeIndex: 0 })}>
                    Change
                  </button>
                </div>
                <div className='checkout__ShippingTab-item'>
                  <p>Ship to</p>
                  <p>
                    {this.state.shippingAddress
                      ? this.state.shippingAddress.apartment +
                        ', ' +
                        this.state.shippingAddress.address +
                        ', ' +
                        this.state.shippingAddress.city +
                        ', ' +
                        this.state.shippingAddress.country
                      : null}
                  </p>
                  <button onClick={() => this.setState({ activeIndex: 0 })}>
                    Change
                  </button>
                </div>
              </div>
              <div className='shipping-method-wrapper'>
                <h3>Shipping Method</h3>
                <div className='shipping-method'>
                  <div className='input-radio'>
                    {this.state.shippingMethods.length ? (
                      this.state.shippingMethods.map((shipping, key) => {
                        return (
                          <>
                            <div className='shipping-methods'>
                              {/* {
                              this.state.shippingMethods.length !== 1 ? */}
                              <div className='pg-products' key={key}>
                                {this.getProductsByPG(shipping.product_group)}
                              </div>
                              {/* : null
                            } */}
                              {shipping.shipping_rule.length ? (
                                <div className='shipping-method-for-pg-wrapper'>
                                  {shipping.shipping_rule.map((method, key) => {
                                    return (
                                      <>
                                        <div
                                          className='shipping-method-for-pg'
                                          key={key + 'shipping'}
                                        >
                                          <div>
                                            <input
                                              checked={
                                                this.state.shippingMethods.find(
                                                  (ship) =>
                                                    ship.product_group ===
                                                    shipping.product_group
                                                ).selectedShippingMethod ===
                                                method.name
                                              }
                                              onChange={() =>
                                                this.shippingMethodSelected(
                                                  shipping.shipping_id,
                                                  method.name,
                                                  shipping.product_group,
                                                  key
                                                )
                                              }
                                              id={shipping.product_group + key}
                                              name={shipping.product_group}
                                              value={method.name}
                                              type='radio'
                                            />
                                            <label
                                              htmlFor={
                                                shipping.product_group + key
                                              }
                                            >
                                              {method.name}
                                            </label>
                                          </div>
                                          <label>
                                            <span>
                                              {this.props?.defaultCurrency}{' '}
                                              {method.shipping_amount}
                                              {/* <Money
                                                price={method.shipping_amount}
                                                format='currency price'
                                              /> */}
                                            </span>
                                          </label>
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                              ) : null}
                            </div>
                          </>
                        )
                      })
                    ) : (
                      <p>No Shippings</p>
                    )}
                  </div>
                </div>
                <p className='shipping-info'>
                  During checking out for delivery in your country, certain
                  duties may be applicable specific to your destination. PCB has
                  no control over these charges and the same may vary.
                </p>
              </div>

              <div className='k-row informationAction'>
                <button
                  className='return-to-info'
                  onClick={() => this.setState({ activeIndex: 0 })}
                >
                  <Icon name='chevron left' /> Return to Information
                </button>

                {address.valid &&
                country.valid &&
                city.valid &&
                customerEmailPhone.valid &&
                firstName.valid &&
                lastName.valid &&
                phoneNo.valid ? (
                  <button
                    className='primary-button'
                    type='submit'
                    onClick={this.continueToPayment}
                  >
                    CONTINUE TO PAYMENT
                  </button>
                ) : (
                  <button
                    className='primary-button disabled'
                    type='submit'
                    onClick={this.continueToPayment}
                  >
                    CONTINUE TO PAYMENT
                  </button>
                )}
              </div>

              {/* <div className="shippingTab__action">
              <button className="return-to-info" value='0' onClick={this.handleRangeChange}> <Icon name="chevron left" /> Return to Information</button>
              <button className="primary-button">CONTINUE TO PAYMENT</button>
            </div> */}
            </div>
          </Tab.Pane>
        ),
      },
      {
        render: () => (
          <Tab.Pane>
            <div className='payment-tab'>
              <div className='checkout__ShippingTab-record'>
                <div className='checkout__ShippingTab-item'>
                  <p>Contact</p>

                  <p>
                    {this.state.shippingAddress
                      ? this.state.shippingAddress.phone
                      : null}
                  </p>
                  <button onClick={() => this.setState({ activeIndex: 0 })}>
                    Change
                  </button>
                </div>
                <div className='checkout__ShippingTab-item'>
                  <p>Ship to</p>
                  <p>
                    {this.state.shippingAddress
                      ? this.state.shippingAddress.apartment +
                        ', ' +
                        this.state.shippingAddress.address +
                        ', ' +
                        this.state.shippingAddress.city +
                        ', ' +
                        this.state.shippingAddress.country
                      : null}
                  </p>
                  <button onClick={() => this.setState({ activeIndex: 0 })}>
                    Change
                  </button>
                </div>
                <div className='checkout__ShippingTab-item'>
                  <p>Method</p>
                  <p>Standard</p>
                </div>
              </div>

              {/* ///////////////////////////////////////////////////////////////////////////////////////// */}

              <div className='payment-method-wrapper'>
                <h3>Payment</h3>
                <span>All transactions are secure and encrypted.</span>

                {/* Without Login ////////////////////////////////////////////////////////////////////// */}

                {!sessionStorage.getItem('pcb-customer-token') ? (
                  <>
                    <div className='payment-method'>
                      {this.state?.paymentMethods?.length
                        ? this.state?.paymentMethods?.map((pMethod, index) => {
                            // debugger
                            // console.log('Without Login', pMethod)
                            // console.log('length', this.state.paymentMethods.length);
                            if (pMethod.type === 'manual') {
                              return ''
                            } else {
                              return (
                                <>
                                  <div key={index} className='input-radio'>
                                    <Radio
                                      name='payment-method'
                                      checked={
                                        this.state.selectedPaymentMethod ===
                                        pMethod?.gateway_name
                                      }
                                      value={pMethod?.gateway_name}
                                      onChange={this.handlePaymentRadioChange}
                                      label={pMethod?.gateway_name}
                                    />
                                  </div>
                                </>
                              )
                            }
                          })
                        : null}
                    </div>
                  </>
                ) : null}

                {/* <hr /> */}

                {/* if User Login & Has Amount ////////////////////////////////////////////////////////////////////// */}

                {this.state?.showWallet &&
                this.state?.checkout_settings.is_wallet ? (
                  <>
                    <div className='payment-method'>
                      <div className='input-radio'>
                        <Checkbox
                          name='wallet'
                          onChange={this.handleCheckChange}
                          label='Pay by your Wallet'
                          checked={this.state?.payByWallet}
                        />
                        <p>
                          <Money
                            price={this.state?.wallet_amount}
                            format='currency price'
                          />
                        </p>
                      </div>
                    </div>

                    {/* If User Do not use Wallet Payment ////////////////////////////////////////////////////////////////////// */}

                    {!this.state?.payByWallet ? (
                      <>
                        <div className='payment-method'>
                          {this.state?.paymentMethods.length
                            ? this.state?.paymentMethods.map(
                                (pMethod, index) => {
                                  // console.log('if user do not use wallet')
                                  if (
                                    pMethod.type === 'manual' &&
                                    cartDetail.total_price.subtotal > 20000
                                  ) {
                                    return ''
                                  } else {
                                    return (
                                      <>
                                        <div
                                          key={index}
                                          className='input-radio'
                                        >
                                          <Radio
                                            name='payment-method'
                                            checked={
                                              this.state
                                                ?.selectedPaymentMethod ===
                                              pMethod?.gateway_name
                                            }
                                            value={pMethod?.gateway_name}
                                            onChange={
                                              this.handlePaymentRadioChange
                                            }
                                            label={pMethod?.gateway_name}
                                          />
                                        </div>
                                      </>
                                    )
                                  }
                                }
                              )
                            : null}
                        </div>
                      </>
                    ) : null}

                    {/* If Total price is more than User wallet amount ////////////////////////////////////////////////////////////////////// */}

                    {cartDetail.total_price.total > this.state?.wallet_amount &&
                    this.state?.payByWallet ? (
                      <>
                        <p>Pay Remaining Amount Through:</p>
                        <div className='payment-method'>
                          {this.state?.paymentMethods.length
                            ? this.state?.paymentMethods.map(
                                (pMethod, index) => {
                                  // console.log('If price is more then total')
                                  if (
                                    pMethod.type === 'manual' &&
                                    cartDetail.total_price.subtotal > 20000
                                  ) {
                                    return ''
                                  } else {
                                    return (
                                      <>
                                        <div
                                          key={index}
                                          className='input-radio'
                                        >
                                          <Radio
                                            name='payment-method'
                                            checked={
                                              this.state
                                                .selectedPaymentMethod ===
                                              pMethod?.gateway_name
                                            }
                                            value={pMethod?.gateway_name}
                                            onChange={
                                              this.handlePaymentRadioChange
                                            }
                                            label={pMethod?.gateway_name}
                                          />
                                        </div>
                                      </>
                                    )
                                  }
                                }
                              )
                            : null}
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}

                {this.state.customerToken != null &&
                this.state.checkout_settings.is_wallet === false ? (
                  <>
                    <div className='payment-method'>
                      {this.state.paymentMethods.length
                        ? this.state.paymentMethods.map((pMethod, index) => {
                            // console.log('User Without Money')
                            if (
                              pMethod.type === 'manual' &&
                              cartDetail.total_price.subtotal > 20000
                            ) {
                              return ''
                            } else {
                              return (
                                <>
                                  <div key={index} className='input-radio'>
                                    <Radio
                                      name='payment-method'
                                      checked={
                                        this.state.selectedPaymentMethod ===
                                        pMethod?.gateway_name
                                      }
                                      value={pMethod?.gateway_name}
                                      onChange={this.handlePaymentRadioChange}
                                      label={pMethod?.gateway_name}
                                    />
                                  </div>
                                </>
                              )
                            }
                          })
                        : null}
                    </div>
                  </>
                ) : null}

                {/* User Without Money ////////////////////////////////////////////////////////////////////// */}

                {this.state.customerToken != null &&
                this.state.showWallet === false ? (
                  <>
                    <div className='payment-method'>
                      {this.state.paymentMethods.length
                        ? this.state.paymentMethods.map((pMethod, index) => {
                            // console.log('User Without Money')
                            if (
                              pMethod.type === 'manual' &&
                              cartDetail.total_price.subtotal > 20000
                            ) {
                              return ''
                            } else {
                              return (
                                <>
                                  <div key={index} className='input-radio'>
                                    <Radio
                                      name='payment-method'
                                      checked={
                                        this.state.selectedPaymentMethod ===
                                        pMethod?.gateway_name
                                      }
                                      value={pMethod?.gateway_name}
                                      onChange={this.handlePaymentRadioChange}
                                      label={pMethod?.gateway_name}
                                    />
                                  </div>
                                </>
                              )
                            }
                          })
                        : null}
                    </div>
                  </>
                ) : null}
              </div>

              <div className='billing-address-wrapper'>
                <h3>Billing address</h3>
                <span>
                  Select the address that matches your card or payment method
                </span>
                <div className='billing-address'>
                  <div className='input-radio'>
                    <div className='radio-wrapper'>
                      <Radio
                        value='shippingAddress'
                        checked={
                          this.state.billingAddress === 'shippingAddress'
                        }
                        onChange={this.handleRadioChange}
                        name='billingAddress'
                        label='Same as shipping address'
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className='input-radio'>
                    <Radio
                      value='billingAddress'
                      checked={this.state.billingAddress === 'billingAddress'}
                      onChange={this.handleRadioChange}
                      name='billingAddress'
                      label='Use a different billing address'
                    />
                  </div>
                  {this.state.billingAddress === 'billingAddress' ? (
                    <div>
                      <BillingAddressForm
                        defaultCountry={this.state.defaultCountry}
                        setBillingAddress={this.setBillingAddress}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='shippingTab__action'>
                <button
                  className='return-to-info'
                  onClick={() => this.setState({ activeIndex: 1 })}
                >
                  <Icon name='chevron left' /> Return to Shipping
                </button>
                {/* <button className="return-to-info" value='0' onClick={this.handleRangeChange}> <Icon name="chevron left" /> Return to Information</button> */}
                {this.state.selectedPaymentMethod ? (
                  this.state.billingAddress === 'billingAddress' ? (
                    this.state.billingAddressDetail.address ? (
                      this.state.billingAddressDetail.address.valid &&
                      this.state.billingAddressDetail.city.valid &&
                      this.state.billingAddressDetail.country.valid &&
                      this.state.billingAddressDetail.first_name.valid &&
                      this.state.billingAddressDetail.last_name.valid &&
                      this.state.billingAddressDetail.phone.valid ? (
                        // this.state.billingAddressDetail.postal_code.valid ?
                        <button
                          className='primary-button'
                          onClick={this.checkout}
                        >
                          Place Order
                        </button>
                      ) : (
                        <button
                          className='primary-button'
                          disabled
                          onClick={this.checkout}
                        >
                          Place Order
                        </button>
                      )
                    ) : null
                  ) : (
                    <button className='primary-button' onClick={this.checkout}>
                      Place Order
                    </button>
                  )
                ) : (
                  <button
                    className='primary-button'
                    disabled
                    onClick={this.checkout}
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </Tab.Pane>
        ),
      },
    ]

    return (
      // <CheckoutHtml />
      <div className='checkout-page'>
        {this.state.loading ? <KeesLoader /> : null}
        <div className='k-row checkout-wrapper'>
          <div className='checkout-details'>
            <div className='checkout_summary_card'>
              <div>
                <a href='/home'>
                  <img src={PCBLogo} alt='logo' width={'70px'} />
                </a>
              </div>
              <div>
                <div className='checkout__tab-button'>
                  {/* <button ><a href="/cart">Cart</a></button> -
                  <button value='0' className={activeIndex == 0 ? 'active' : null} onClick={this.handleRangeChange}>Information</button> -
                  <button className={activeIndex == 1 ? 'active' : null} >Shipping</button> -
                  <button className={activeIndex == 2 ? 'active' : null}>Payment</button> */}
                </div>
                <Tab
                  panes={panes}
                  activeIndex={activeIndex}
                  onTabChange={this.handleTabChange}
                />
              </div>
            </div>
          </div>
          {/* cart detail */}
          {cartDetail ? (
            <div className='cart-details'>
              <div className='cart-details__wrap'>
                <div className='cart__lineitem-wrap'>
                  {cartDetail.list_items.map((lineItem, indexi) => {
                    {
                      return (
                        // 'vendor-splitting' class for spliting
                        <div className='' key={indexi}>
                          <h2>Shopping Bag ({lineItem.items.length} Item)</h2>
                          {lineItem.items.map((item, indexj) => {
                            return (
                              <>
                                <div key={indexj} className='cart__lineitem'>
                                  <div className='cart__lineitem-img'>
                                    {/* <div className="item-quantity">{item.quantity}</div> */}
                                    <img
                                      src={
                                        item.image ? item.image : defaultImage
                                      }
                                      alt=''
                                    />
                                    <span className='line-item-quant'>
                                      {item.quantity}
                                    </span>
                                  </div>
                                  <div className='cart__lineitem-info-wrap'>
                                    <div className='cart__lineitem-info'>
                                      <h5>{item.product}</h5>
                                      <p>{item.variant_name}</p>
                                    </div>
                                    <div className='cart__lineitem-price'>
                                      {item.price * item.quantity !==
                                      item.total_price ? (
                                        <h5 className='compare-at-price'>
                                          {this.props?.defaultCurrency} &nbsp;{' '}
                                          {item.price * item.quantity}
                                          {/* <Money
                                            price={item.price * item.quantity}
                                            format="currency price"
                                          /> */}
                                        </h5>
                                      ) : null}
                                      <h5
                                        className={
                                          item.price * item.quantity !==
                                          item.total_price
                                            ? 'discounted-price'
                                            : ''
                                        }
                                      >
                                        {this.props?.defaultCurrency} &nbsp;{' '}
                                        {item.total_price}
                                        {/* <Money
                                          price={item.total_price}
                                          format="currency price"
                                        /> */}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                          })}
                        </div>
                      )
                    }
                  })}
                </div>
                {
                  // this.state.discountApplied === true ?
                  //   <Message color='green'>
                  //     <Message.Header>Discount code applied</Message.Header>
                  //   </Message>
                  //   :
                  // <div className="cart__discountCode-wrap">
                  //   {/* Promo Discounts Conditions ////////////////////////////////////////////////// */}
                  //   <div>
                  //     {
                  //       (this.state.checkout_settings?.promo_code == "required") ?
                  //         <>
                  //           <div className='cart__discountCode'>
                  //             <Input value={this.discountCode} onChange={this.handleChange} name="discountCode" type="text" placeholder='Discount Code' />
                  //             <button onClick={this.applyDiscountCode} className="primary-button">Apply</button>
                  //           </div>
                  //         </>
                  //         : (this.state.checkout_settings.promo_code == "optional") ?
                  //           <>
                  //             <div className='cart__discountCode'>
                  //               <Input value={this.discountCode} onChange={this.handleChange} name="discountCode" type="text" placeholder='Discount Code (Optional)' />
                  //               <button onClick={this.applyDiscountCode} className="primary-button">Apply</button>
                  //             </div>
                  //           </> : null
                  //     }
                  //     {/* <div className='cart__discountCode'>
                  //       <Input value={this.discountCode} onChange={this.handleChange} name="discountCode" type="text" placeholder='Discount Code' />
                  //       <button onClick={this.applyDiscountCode} className="primary-button">Apply</button>
                  //     </div> */}
                  //     <div>
                  //       {
                  //         this.state.applied_promocodes.length ?
                  //           this.state.applied_promocodes.map((promo) => {
                  //             return <div className='promo-chips'>
                  //               <p className='chips'>
                  //                 {promo}
                  //                 <span class="closebtn" onClick={() => this.removeDiscountCode(promo)}>&times;</span>
                  //               </p>
                  //             </div>
                  //           })
                  //           : null
                  //       }
                  //     </div>
                  //   </div>
                  //   {
                  //     this.state.discountApplied === true ?
                  //       <Message color='green'>
                  //         <Message.Header>Discount code applied</Message.Header>
                  //       </Message>
                  //       :
                  //       this.state.discountApplied === false ?
                  //         <Message color='red'>
                  //           Invalid Discount Code
                  //         </Message>
                  //         : this.state.discountRemoved === true ?
                  //           <Message color='red'>
                  //             Discount Code Removed
                  //           </Message>
                  //           : null
                  //   }
                  // </div>
                }

                <div className='order_summary_card'>
                  <div className='cart__SubtotalPrice-wrap'>
                    <h2>ORDER SUMMARY</h2>
                    <p>
                      <span>Subtotal</span>
                      <h4>
                        {this.props?.defaultCurrency} &nbsp;{' '}
                        {roundToFloat(cartDetail.total_price.subtotal, 2)}
                        {/* <Money
                          price={cartDetail.total_price.subtotal}
                          format="currency price"
                        /> */}
                      </h4>
                    </p>
                    {cartDetail.total_price.shipping_amount ? (
                      <p>
                        <span>Total Shipping</span>
                        <h4>
                          {this.props?.defaultCurrency} &nbsp;{' '}
                          {/* {cartDetail?.total_price?.total_shipping} */}
                          {cartDetail.total_price.shipping_amount}
                          {/* <Money
                            price={cartDetail.total_price.shipping_amount}
                            format="currency price"
                          /> */}
                        </h4>
                      </p>
                    ) : this.state.totalShipping ? (
                      <p>
                        <span>Total Shipping</span>
                        <h4>
                          {this.props?.defaultCurrency} &nbsp;{' '}
                          {this.state?.totalShipping}
                          {/* <Money
                            price={this.state.totalShipping}
                            format="currency price"
                          /> */}
                        </h4>
                      </p>
                    ) : null}
                  </div>
                  <div className='cart__totalPrice-wrap'>
                    <p>
                      <h4>Total</h4>
                      <h2>
                        {this.props?.defaultCurrency} &nbsp;{' '}
                        {this.totalOrderAmount()}
                        {/* {(cartDetail.total_price.total + this.state.totalShipping).toFixed(2)} */}
                        {/* <Money
                          price={
                            parseInt(cartDetail.total_price.total) +
                            parseInt(this.state.totalShipping)
                          }
                          format="currency price"
                        /> */}
                      </h2>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    defaultCountry: state?.multiLocation?.defaultCountry,
    defaultCurrency: state?.multiLocation?.defaultCurrency,
  }
}

export default connect(mapStateToProps)(Checkout)
