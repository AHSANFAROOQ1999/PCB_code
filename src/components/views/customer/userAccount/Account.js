import React, { Component } from 'react';
import Axios from 'axios';
import { Dimmer, Loader, Popup } from 'semantic-ui-react'
import Model from './sections/Model'
import ConfirmationModel from './sections/ConfirmationModel'
import ChangePasswordModel from './sections/ChangePasswordModel'
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment'
import { connect } from 'react-redux'
import { logout } from '../../../../redux/slices/accountSlice'

class Account extends Component {

  constructor(props) {
    super(props)

    this.state = {
      token: sessionStorage.getItem('pcb-customer-token') ? sessionStorage.getItem('pcb-customer-token') : false,
      customerDetail: {},
      routeTo: false
    }
  }

  resetCustomerDetail = (customer) => {
    this.setState({
      customerDetail: customer
    })
  }

  // deleteAddress = (e, id) => {
  //   debugger
  //   if(id)
  //   {
  //     Axios.delete(process.env.REACT_APP_BACKEND_HOST + '/storefront/account_address_delete?token='+this.state.token + '&id=' + id)
  //     .then( (response) => {
  //       console.log('customer address deleted', response)
  //       e.target.closest('.customer-address.wrapper').remove()
  //       debugger
  //     })
  //     .catch((err) => {

  //       console.log(err)
  //     })
  //   }

  // }

  componentDidMount() {
    if (this.state.token) {
      Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/account?token=' + this.state.token,   
    {  headers: {
        "pushpa": sessionStorage.getItem('pcb-customer-token')
      }})
        .then((response) => {
          // console.log('customer detail', response)
          this.setState({
            customerDetail: response.data
          })
        })
        .catch((err) => {
          if (err.response.status === 400) {
            sessionStorage.removeItem('pcb-customer-id')
            sessionStorage.removeItem('pcb-customer-token')
            sessionStorage.removeItem('pcb-customer-email')
            localStorage.removeItem('wishList')
            window.location.href = '/login'
          }
        })
    }
    else {
      window.location.href = '/signin'
    }
  }
  logout = () => {

    this.props.dispatch(logout())
    this.setState({ routeTo: "/home" })
  }
  render() {
    const { customerDetail } = this.state
    return (
      <div className='account-page'>
        {
          this.state.routeTo ?
            <Redirect to={this.state.routeTo} /> : null
        }
        <div className="container-xl">
          {
            customerDetail.email ?
              <>
                <div className="account-page-section account-info">
                  <div className="section-header">
                    <h2 className="section-header-title">My Account</h2>
                    <div className="section-header-action">
                      <ChangePasswordModel token={this.state.token} />
                      <button onClick={this.logout} className="logout">Logout</button>
                    </div>
                  </div>
                  <div className="section-body">
                    <h4>{customerDetail.first_name + ' ' + customerDetail.last_name}</h4>
                    <p>{customerDetail.email}</p>
                  </div>
                </div>

                {/* <div className='heading'>
              <div className="account-detail">
                <h1>MY ACCOUNT</h1>
                <h4>{customerDetail.first_name + ' ' + customerDetail.last_name }</h4>
                <p>{customerDetail.email}</p>
              </div>
              <div className="logout-wrapper">
                /* <a href="/">Change Password</a> 
                <ChangePasswordModel token={this.state.token} />
                <button onClick={this.logout} className="logout">Logout</button>
              </div>
            </div> */}

                <div className="account-page-section order-details">
                  <div className="section-header">
                    <h2 className="section-header-title">Order Histroy</h2>

                  </div>
                  <div className="section-body">
                    <div className="order-table-wrap">
                      {
                        customerDetail.orders.length ?
                          <table className='order-history'>
                            <tr>
                              <th>order no</th>
                              <th>date</th>
                              <th>payment status</th>
                              <th>track order</th>
                              <th>fullfillment status</th>
                              <th>review status</th>
                              <th>total</th>
                            </tr>

                            {
                              customerDetail.orders.map((order, key) => {
                                return <tr key={key}>
                                  <td>{order.order_id}</td>
                                  <td>{moment(order.created_at).format('MMMM Do YYYY')}</td>
                                  <td>{order.payment_status}</td>
                                  <td><Link to={"/orderDetail/" + order.order_id}>Track</Link></td>
                                  <td>{order.fulfillment_status}</td>
                                  <td>{order.order_status}</td>
                                  <td>PKR {order.total_price}</td>
                                </tr>
                              })
                            }
                          </table>
                          : <h5>No order history</h5>
                      }
                    </div>
                  </div>
                </div>

                {/* <div className="customer-order-detail-wrapper">
            <div className='table-heading'>
              <h1>ORDER HISTORY</h1>
            </div>
            {
              customerDetail.orders.length ? 
                <table className='order-history'>
                  <tr>
                    <th>order</th>
                    <th>date</th>
                    <th>payment status</th>
                    <th>track order</th>
                    <th>fullfillment status</th>
                    <th>review status</th>
                    <th>total</th>
                  </tr>

                  {
                    customerDetail.orders.map( (order) => {
                      return<>
                      <tr>
                        <td>{order.name}</td>
                        <td>{order.created_at}</td>
                        <td>{order.payment_status}</td>
                        <td><a href="/">Track</a></td>
                        <td>{order.fulfillment_status}</td>
                        <td>{order.order_status}</td>
                        <td>PKR{  order.total_price}</td>
                      </tr>
                      </>
                    })
                  }                
                  

                </table>
              : <h5>No order history</h5> 
            }
            </div> */}


                <div className="account-page-section account-addressess">
                  <div className="section-header">
                    <h2 className="section-header-title">Customer Addresses</h2>
                    <div className="section-header-action">
                      <Model address={{}} buttonName="Create new address" resetCustomerDetail={this.resetCustomerDetail} />
                    </div>
                  </div>
                  <div className="section-body">
                    <div className="customer-addressess-wrap">
                      {
                        customerDetail.address.length ?
                          customerDetail.address.map((address, key) => {
                            return <div addressId={address.id} key={key} className="customer-address-item">
                              <div>
                                <div className='customer-details'>
                                  <span className='customer-name'>{address.first_name + " " + address.last_name}</span>
                                  <br />
                                  <span className='customer-address'>{(address.apartment != null ? address.apartment : '') + ' ' + address.address}</span>
                                  <span className='customer-address'>{address.city}</span>
                                  <br />
                                  <span className='postal-code'>{address.postal_code}</span>
                                  <span className='country'>{address.country}</span>
                                  <span className='phone-no'>{address.phone}</span>
                                </div>
                                {/* edit address model */}
                                <div className="action-wrapper">
                                  <Model address={address} buttonName="Edit address" resetCustomerDetail={this.resetCustomerDetail} />
                                  <Popup content='Delete Address' trigger={<ConfirmationModel token={this.state.token} id={address.id} />} />
                                </div>
                              </div>
                            </div>
                          })
                          : <h5>No Address Available</h5>
                      }
                    </div>
                  </div>
                </div>


                {/* <div className='customer-details-wrapper'>
              <div className='heading'>
                <h1>Customer Addresses</h1>
                <div>
                  <Model address={{}} buttonName="Create new address" resetCustomerDetail={this.resetCustomerDetail} />
                </div>
              </div>
              <div className="customer-addresses">
                
              </div>
            </div> */}
              </>
              :
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
          }
        </div>
      </div>
    );
  }
}

export default connect()(Account);