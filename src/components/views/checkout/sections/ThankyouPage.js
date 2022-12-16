import Axios from 'axios';
import React, { Component } from 'react';
// import thankyou from '../../../../assets/img/thankyou.png';
// import keesLogo from '../../../../../src/assets/img/keesLogo.png';
import PCBLogo from '../../../../assets/pcb-assets/pcblogo.png'
import KeesLoader from '../../../shared/KeesLoader.js';
import defaultImage from '../../../../../src/assets/img/productImagePlaceholder.png';
import { connect } from 'react-redux';
class ThankyouPage extends Component {

  constructor(props) {
    super(props)

    let checkoutID = localStorage.getItem("checkout_id");
    this.state = {
      // detail : this.props.detail.data
      orderNo: props.match.params.id,
      checkoutID: checkoutID,
      loading: true,
      detail: null,
      cartDetail: null,
      defaultCurrency: this.props?.defaultCurrency
    }
  }

  componentWillMount() {
    this.setState({
      defaultCurrency: this.props?.defaultCurrency
    })
  }

  componentDidMount() {
    // window.fbq('track', 'ThankYouPage')
    if (this.state.checkoutID) {
      Axios.get(process.env.REACT_APP_BACKEND_HOST + '/order/checkout_thankyou/' + this.state?.orderNo)
        .then((response) => {
          this.setState({
            loading: false,
            detail: response.data
          });
          // console.log(response);
        });

      let body = {
        "order_id": this.state?.orderNo
      }

      Axios.post(process.env.REACT_APP_BACKEND_HOST + '/order/shipping_price', body)
        .then((response) => {
          this.setState({
            cartDetail: response?.data
          });
        })
        .catch((err) => {
          console.log(err)
        });

      localStorage.removeItem('checkout_id')
      localStorage.removeItem('cart')
      localStorage.removeItem('cartTotal')
      localStorage.removeItem('billingAddress')
      localStorage.removeItem('shippingAddress')
    }
    else {
      window.location.href = '/orderDetail/' + this.state.orderNo
    }
  }

  render() {
    const { detail, cartDetail } = this.state
    return (
      <div className='checkout-page'>
        {
          this.state.loading ?
            <KeesLoader />
            :
            <div className='k-row checkout-wrapper'>
              <div className='checkout-details'>

                {/* <div className='checkout_logo'>
                  <a href="/home">
                    <img src={PCBLogo} alt="logo" width={'110px'} />
                  </a>
                </div> */}

                <div className="thankyou-page">
                  {
                    detail.name ? <>

                      <div className="thankyou-logo-wrapper">
                        {/* <img src={thankyou} alt="" /> */}
                        <a href="/home">
                          <img src={PCBLogo} alt="logo" width={'110px'} />
                        </a>
                        <div >
                          <h2>Thank You</h2>
                          <p>Order no: <span>{detail.order_id}</span></p>
                        </div>
                      </div>
                      <div>
                        <div className="order-confirm-note">
                          <h5>Your order is confirmed</h5>
                          <p>You'll receive a confirmation email with your order number shortly</p>
                        </div>
                        <div className="customer-info-wrapper">
                          <h5>Customer Information</h5>
                          <div className="customer-info">
                            <div>

                              <div className="divi">
                                <h5>Contact Information</h5>
                                <p>{detail.customer_email ? detail.customer_email : detail.customer_phone}</p>
                              </div>

                              <div className="divi detail">
                                <h5>Shipping Address</h5>
                                <p>{detail.shipping_address.first_name + " " + detail.shipping_address.last_name}</p>
                                <p>{detail.shipping_address.phone}</p>
                                <p>{detail.shipping_address.apartment ? detail.shipping_address.apartment : null} {detail.shipping_address.address}</p>
                                <p>{detail.shipping_address.city}</p>
                                <p>{detail.shipping_address.country}</p>
                                <p>{detail.shipping_address.postal_code}</p>
                              </div>

                              {/* <div className="divi">
                            <h5>Shipping Method</h5>
                            <p>Standard</p>
                          </div> */}
                            </div>

                            <div>
                              <div className="divi">
                                <h5>Payment Method</h5>
                                <p>{detail.payment_method}</p>
                              </div>

                              <div className="divi detail">
                                <h5>Billing Address</h5>
                                <p>{detail.billing_address.first_name + " " + detail.billing_address.last_name}</p>
                                <p>{detail.billing_address.phone}</p>
                                <p>{detail.billing_address.apartment ? detail.billing_address.apartment : null} {detail.billing_address.address}</p>
                                <p>{detail.billing_address.city}</p>
                                <p>{detail.billing_address.country}</p>
                                <p>{detail.billing_address.postal_code}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>

                        </div>
                      </div>
                    </>
                      : null
                  }
                </div>
              </div>

              {cartDetail ?
                <div className='cart-details'>
                  <div className="cart-details__wrap">
                    <div className="cart__lineitem-wrap">
                      {
                        cartDetail.list_items.map((lineItem, key) => {
                          {
                            return (
                              // 'vendor-splitting' class for spliting
                              <div className="" key={key}>
                                {/* <h5 className="vendor-title">Vendor: {lineItem.vendor}</h5> */}
                                {
                                  lineItem.items.map((item, key) => {
                                    return <div key={key}>
                                      <div className="cart__lineitem">
                                        <div className="cart__lineitem-img">
                                          {/* <div className="item-quantity">{item.quantity}</div> */}
                                          <img src={item.image ? item.image : defaultImage} alt="" />
                                          <span className='line-item-quant'> {item.quantity} </span>
                                        </div>
                                        <div className="cart__lineitem-info-wrap">
                                          <div className="cart__lineitem-info">
                                            <h5>{item.product}</h5>
                                            <p>{item.variant_name}</p>
                                          </div>
                                          <div className="cart__lineitem-price">
                                            <h5>{this.state?.defaultCurrency} &nbsp; {item.price}</h5>
                                            <p>Shipping: {item.shipping}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  })
                                }
                              </div>
                            )
                          }
                        })
                      }

                    </div>
                    {/* <div className="cart__discountCode-wrap">
                    <Input type="text" placeholder='Discount Code' />
                    <button className="primary-button">Apply</button>
                  </div> */}
                    <div className="cart__SubtotalPrice-wrap">
                      <p>
                        <span>Subtotal</span>
                        <h4>{this.state?.defaultCurrency} &nbsp; {cartDetail.total_price.subtotal}</h4>
                      </p>
                      <p>
                        <span>Total Shipping</span>
                        <h4>{this.state?.defaultCurrency} &nbsp; {cartDetail.total_price.shipping_amount}</h4>
                      </p>
                    </div>
                    <div className="cart__totalPrice-wrap">
                      <p>
                        <h4>Total</h4>
                        <h2><small>{this.state?.defaultCurrency} &nbsp;</small> {cartDetail.total_price.total}</h2>
                      </p>
                    </div>
                  </div>
                </div>
                : null
              }
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    defaultCurrency: state?.multiLocation?.defaultCurrency,
  };
};

export default connect(mapStateToProps)(ThankyouPage);
