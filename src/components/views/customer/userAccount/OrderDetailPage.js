import Axios from 'axios';
import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
// import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';

class OrderDetailPage extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)

    this.state = {
      orderId: props.match.params.id,
      orderDetail: {},
      isDeleted: false
    }
  }

  componentDidMount() {

    if (this.state.orderId) {
      Axios.get(process.env.REACT_APP_BACKEND_HOST + '/order/order_detail?order_id=' + this.state.orderId)
        .then((response) => {
          // console.log("order detail", response)
          this.setState({
            orderDetail: response.data,
            isDeleted: response.data.line_items[0].deleted
          })
          // console.log(this.state.isDeleted);
        })
        .catch((err) => {
          console.log(err);
          window.location.href = '/trackyourorder/error'
        })
    }
  }

  render() {
    const { orderDetail } = this.state
    let date
    if (orderDetail.created_at) {
      date = new Date(orderDetail.created_at)
    }
    return (
      <div className="order-detail-page">
        <div className='line-items-wrapper'>
          {
            orderDetail.order_id ?
              <>
                <div className="order-token-wrapper">
                  <h1>ORDER # <span>{this.state.orderId}</span> </h1>
                  {
                    date ?
                      <>
                        <p className="placed-by">Placed By <span>{orderDetail.first_name}  {orderDetail.last_name}</span> </p>
                        <p>Placed on {moment(orderDetail.created_at).format('MMMM Do YYYY')} </p>
                      </>
                      : null
                  }
                </div>
                <div className="order-detaill-info">

                  <Table singleLine>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>SKU</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Total</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {
                        orderDetail.line_items.map((item, key) => {
                          return <div key={key}>
                            <Table.Row>
                              <Table.Cell width="20px" className={"product-title-table-content" + (this.state.isDeleted ? " product-deleted" : '')}> <> <a href={"/product/"}><p className="product-title-length" >{item.product_title}</p></a>  <p className="variant-title">{item.variant_title}</p></> </Table.Cell>
                              <Table.Cell>{item.sku}</Table.Cell>
                              <Table.Cell>{item.price}</Table.Cell>
                              <Table.Cell>{item.quantity}</Table.Cell>
                              <Table.Cell>{item.total_price}</Table.Cell>
                            </Table.Row>
                          </div>
                        })
                      }


                    </Table.Body>
                    <Table.Footer>
                      <Table.Row >

                        <Table.HeaderCell colSpan='4' floated='left'> <h5> Subtotal</h5></Table.HeaderCell>
                        <Table.HeaderCell floated='right'><h5>{orderDetail.subtotal_price}</h5></Table.HeaderCell>

                      </Table.Row>

                      <Table.Row>
                        <Table.HeaderCell colSpan='4'> <h5>Shipping</h5> </Table.HeaderCell>
                        <Table.HeaderCell><h5>{orderDetail.total_shipping}</h5></Table.HeaderCell>
                      </Table.Row>
                      <Table.Row>
                        <Table.HeaderCell colSpan='4'><h5>Total</h5></Table.HeaderCell>
                        <Table.HeaderCell><h5>{orderDetail.total_price}</h5></Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                  </Table>
                  <div className='address-wrapper'>
                    <div>
                      <p>Fulfillment Status <span>{orderDetail.fulfillment_status}</span> </p>
                      <p>Payment Status <span>{orderDetail.payment_status}</span> </p>
                      <p>Order status <span>{orderDetail.order_status}</span></p>
                    </div>
                    <div>
                      <h1>Shipping Address</h1>
                      <p>{orderDetail.shipping_address.first_name + ' ' + orderDetail.shipping_address.last_name}</p>
                      <p>{orderDetail.shipping_address.phone}</p>
                      <p>{orderDetail.shipping_address.apartment + ' ' + orderDetail.shipping_address.address}</p>
                      <p>{orderDetail.shipping_address.city}</p>
                      <p>{orderDetail.shipping_address.country}</p>
                      <p>{orderDetail.shipping_address.postal_code}</p>
                    </div>
                    <div>
                      <h1>Billing Address</h1>
                      <p>{orderDetail.billing_address.first_name + ' ' + orderDetail.billing_address.last_name}</p>
                      <p>{orderDetail.billing_address.phone}</p>
                      <p>{orderDetail.billing_address.apartment + ' ' + orderDetail.billing_address.address}</p>
                      <p>{orderDetail.billing_address.city}</p>
                      <p>{orderDetail.billing_address.country}</p>
                      <p>{orderDetail.billing_address.postal_code}</p>
                    </div>
                  </div>
                </div>
              </>
              : null
          }




        </div>
      </div>
    );
  }
}

export default OrderDetailPage;