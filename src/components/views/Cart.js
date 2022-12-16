import React from "react";
import defaultImage from "../../assets/img/productImagePlaceholder.png";
// import { updateGlobalMinicart } from '../../services/context';
import deleteIcon from "../../assets/svg/deleteIcon.svg";
import { Input, Button } from "semantic-ui-react";
import Axios from "axios";
import { Link } from "react-router-dom";
// import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import {
  Add_to_cart,
  Remove_from_cart,
  Update_minicart,
  Update_decr_Qty,
  Update_incr_Qty,
  clearCart,
} from "../../redux/slices/cartSlice";

import cartIcon from "../../assets/svg/cartIcon.svg";
class Cart extends React.Component {
  // state = {  }
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      deletedLineItems: [],
      cartEmpty: false,
      allowCheckout: false,

      checkout_settings: {},
      count: 0,
      country: this.props?.country,
      defaultCurrency: this.props?.defaultCurrency,
    };
  }

  componentDidMount() {
    // debugger

    if (localStorage.getItem("cart")) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (cart.length) {
        this.setState({
          allowCheckout: true,
        });
      }
      this.setState({
        cart: cart,
      });
    }

    // if (!isMobile)
    // {

    this.updateMiniCart();
    this.props.dispatch(Update_minicart());
    this.checkout_settings();

    //  this.render_cart_detail(this.props.cart.totalprice,this.props.cart.totalCount);
    // console.log('price',this.props);
    // }
  }

  componentDidUpdate() {
    // debugger;

    if (this.state?.country != this.props?.country) {
      // debugger

      this.setState(
        {
          cart: [],
          country: this.props?.country,
          cartEmpty: true,
        },
        () => { }
      );
      this.props.dispatch(clearCart());
      localStorage.removeItem("cart");
      localStorage.removeItem("wishList");
      localStorage.removeItem("checkout_id");
    }
  }

  checkout_settings = () => {
    Axios.get(
      process.env.REACT_APP_BACKEND_HOST +
      "/storefront/checkout_setting" +
      "?token=" +
      sessionStorage.getItem("pcb-customer-token")
    ).then((response) => {
      this.setState({
        checkout_settings: response.data,
      });
    });
  };

  updateCart = (newQuantity, e) => {
    if (newQuantity !== 0) {
      let variantId = e.target
        .closest(".quantity-picker")
        .getAttribute("variantid");
      // update cart
      let cart = JSON.parse(localStorage.getItem("cart"));
      for (let i = 0; i < cart?.length; i++) {
        const lineItem = cart[i];
        if (lineItem.varId === variantId) {
          lineItem.detail.quantity = newQuantity;
          break;
        }
      }
      this.setState({
        cart: cart,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  quantityDecrement = (e, id) => {
    let quantityPicker = e.target.closest("button").nextSibling;

    let newQuantity = parseInt(quantityPicker.value) - 1;
    if (newQuantity !== 0) {
      quantityPicker.value = newQuantity;
      this.updateCart(newQuantity, e);
    }
    this.props.dispatch(Update_decr_Qty(id));
    this.props.dispatch(Update_minicart());
    // this.updateMiniCart();
  };

  quantityIncrement = (e, id) => {
    let quantityPicker = e.target.closest("button").previousSibling;
    let newQuantity = parseInt(quantityPicker.value) + 1;

    let maxQuantity = e.target.closest("button").getAttribute("maxinventory");
    if (newQuantity <= maxQuantity) {
      quantityPicker.value = newQuantity;
      this.updateCart(newQuantity, e);
      // this.updateMiniCart();

      this.props.dispatch(Update_incr_Qty(id));
      this.props.dispatch(Update_minicart());
    }
    // window.updateGlobalMinicart()
  };

  deleteLineitem = (e) => {
    let varId = e.target.closest(".delete-button").getAttribute("variantId");

    let cart = JSON.parse(localStorage.getItem("cart"));
    // let deletedItems = JSON.parse( localStorage.getItem('deletedItems'))

    for (let i = 0; i < cart?.length; i++) {
      const lineItem = cart[i];
      if (lineItem.varId == varId) {
        cart?.splice(i, 1);

        this.props.dispatch(
          Remove_from_cart([
            {
              varId: lineItem.varId,
            },
          ])
        );

        if (lineItem.detail.id) {
          Axios.delete(
            process.env.REACT_APP_BACKEND_HOST +
            "/order/delete_line_item?checkout_id=" +
            localStorage.getItem("checkout_id") +
            "&line_item=" +
            lineItem.detail.id
          )
            .then((response) => {
              // debugger
              // document.querySelector('tr[variantid="'+ varId +'"]').remove()

              this.setState({ cart: cart });

              // let stateCart = this.state.cart
              // for (let i = 0; i < stateCart.length; i++) {
              //   const item = stateCart[i]
              //   if(varId == item.varId)
              //   {
              //     stateCart.splice(i, 1)
              //     break
              //   }

              // }
              // this.setState({cart : stateCart})
            })
            .catch((err) => {
              console.log("line item not deleted", err);
            });
        } else {
          this.setState({ cart: cart });

          // document.querySelector('tr[variantid="'+ varId +'"]').remove()
        }
        if (!cart.length) {
          this.setState({ allowCheckout: false });
          this.props.dispatch(clearCart());
          localStorage.removeItem("cart");
          localStorage.removeItem("wishList");
          localStorage.removeItem("checkout_id");
        }
      }
    }
    // console.log(cart)

    // this.updateMiniCart(cart);
    this.props.dispatch(Update_minicart(cart));

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // render_cart_detail

  // render_cart_detail = (totalprice, totalCount) => {
  //   debugger;
  //   if (document.querySelector(".cart-total-quantity")) {
  //     document.querySelector(".cart-total-quantity").innerHTML = totalprice;
  //   }

  //   if (document.querySelector(".cart-count")) {
  //     document.querySelector(".cart-count").innerHTML = totalCount;
  //   }
  //   debugger;
  // document.querySelector(".subtotal h4 span").innerHTML = totalprice;
  // };

  updateMiniCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let totalprice = 0;
    let totalCount = 0;
    if (cart) {
      if (!cart.length) {
        this.setState({ cartEmpty: true });
      } else {
        this.setState({ cartEmpty: false });
      }
      // this.props.dispatch(Add_to_cart(cart))
      // for (let i = 0; i < cart.length; i++) {
      //   const lineitem = cart[i];
      //   totalCount += parseInt(lineitem.detail.quantity);
      //   totalprice +=
      //     lineitem.detail.variantPrice.original_price *
      //     lineitem.detail.quantity;
      // }
      // cart = localStorage.setItem("cart", JSON.stringify(cart));

      //  this.render_cart_detail(totalprice,totalCount);
    }
  };

  checkout = () => {
    // window.fbq("track", "Checkout");

    let cart = JSON.parse(localStorage.getItem("cart"));
    let country = this.state?.country

    if (cart) {
      let lineItems = [];
      for (let i = 0; i < cart.length; i++) {
        const lineItem = cart[i];
        let item = {
          variant_id: lineItem.detail.variantId,
          vendor: parseInt(lineItem.detail.vendor_id),
          quantity: parseInt(lineItem.detail.quantity),
        };
        if (lineItem.detail.id) {
          item.id = lineItem.detail.id;
        }
        lineItems.push(item);
      }
      if (localStorage.getItem("checkout_id")) {
        let body = {
          checkout_id: localStorage.getItem("checkout_id"),
          line_items: lineItems,
          country: country,
        };

        if (sessionStorage.getItem("pcb-customer-id")) {
          body["customer"] = sessionStorage.getItem("pcb-customer-id");
        }

        Axios.put(process.env.REACT_APP_BACKEND_HOST + "/order/checkout", body)
          .then((response) => {
            // console.log(response)
            // update ids for products added to cart
            let respCart = response.data.lineItems;

            for (let i = 0; i < cart.length; i++) {
              const item = cart[i];
              for (let j = 0; j < respCart.length; j++) {
                const respLineItem = respCart[j];
                if (respLineItem.variant === item.varId) {
                  item.detail.id = respLineItem.id;
                }
              }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            // localStorage.removeItem('deletedItems')

            {
              // debugger
              this.state.checkout_settings?.customer_accounts === "required" &&
                !sessionStorage.getItem("pcb-customer-token") ? (
                <>{(window.location.href = "/login")}</>
              ) : (
                (window.location.href = "/checkout")
              );
            }

            // window.location.href = "/checkout";
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 404) {
              let unavailableVariants = err.response.data;
              for (let i = 0; i < unavailableVariants.length; i++) {
                const variant = unavailableVariants[i];
                document.querySelector(
                  'tr[variantid="' +
                  variant.variant_id +
                  '"] .quant-unavailable span'
                ).innerHTML = variant.available_quantity;
                document
                  .querySelector('tr[variantid="' + variant.variant_id + '"]')
                  .classList.add("quantity-error");
              }
            }
          });
      } else {
        // debugger
        // console.log('checkout create')
        let body = {
          line_items: lineItems,
          country: country,
        };

        if (sessionStorage.getItem("pcb-customer-id")) {
          body["customer"] = sessionStorage.getItem("pcb-customer-id");
        }

        Axios.post(process.env.REACT_APP_BACKEND_HOST + "/order/checkout", body)
          .then((response) => {
            // debugger
            // console.log(response)
            localStorage.setItem("checkout_id", response?.data?.checkout_id);

            // update ids for products added to cart
            let respCart = response.data.lineItems;
            for (let i = 0; i < cart?.length; i++) {
              const item = cart[i];
              for (let j = 0; j < respCart.length; j++) {
                const respLineItem = respCart[j];
                if (respLineItem.variant === item.varId) {
                  item.detail.id = respLineItem.id;
                }
              }
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            window.location.href = "/checkout";
          })
          .catch((err) => {
            if (err.response.status === 404) {
              let unavailableVariants = err.response.data;
              for (let i = 0; i < unavailableVariants.length; i++) {
                const variant = unavailableVariants[i];
                document.querySelector(
                  'tr[variantid="' +
                  variant.variant_id +
                  '"] .quant-unavailable span'
                ).innerHTML = variant.available_quantity;
                document
                  .querySelector('tr[variantid="' + variant.variant_id + '"]')
                  .classList.add("quantity-error");
              }
            }
          });
      }
    }
  };

  render() {
    const { cart } = this.state;

    return (
      <div className="cart-page">
        <div className="container-xl">
          <h3 className="">Shopping Basket</h3>
          {!this.state?.cartEmpty ? (
            <>
              {/* <h3 className="">Shopping Basket</h3> */}

              {/* <div className="breadcrumbs">
                        <p>
                          Home / <span>Your Shopping Cart</span>
                        </p>
                      </div> */}

              <div className="cart-wrapper">
                <div>
                  <table>
                    <tr>
                      <th>#</th>
                      <th>
                        <p> Product</p>
                      </th>
                      {/* <th>

                                        <p> Price</p>
                                      </th> */}
                      <th>
                        <p> QTY</p>
                      </th>
                      <th>
                        <p> Amount</p>
                      </th>
                      {/* <th>

                                    <p> Remove</p>
                                  </th> */}
                    </tr>

                    {/* print lineitems   */}

                    {cart && cart?.length && cart[0] != null
                      ? cart?.map((lineItem, index) => {
                        // debugger

                        const itemDetail = lineItem.detail;
                        return (
                          <tr variantId={lineItem.varId}>
                            <td>
                              {index + 1}
                              {/* {this.setState({ count: this.state.count + 1 })}
                                            {this.state.count} */}
                            </td>
                            <td>
                              <div className="k-row">
                                <Link
                                  to={"/product/" + itemDetail?.productHandle}
                                >
                                  <div className="cart-product-img">
                                    <img
                                      className=""
                                      src={
                                        itemDetail?.image
                                          ? itemDetail?.image
                                          : defaultImage
                                      }
                                      alt=""
                                    />
                                  </div>
                                </Link>
                                <div className="cart-product-title-wrap">
                                  <h5>
                                    <Link
                                      to={
                                        "/product/" +
                                        itemDetail?.productHandle
                                      }
                                    >
                                      {itemDetail?.title}
                                    </Link>
                                  </h5>
                                  <p className="cart-item-brand">
                                    {itemDetail?.brand}
                                  </p>

                                  {itemDetail?.variantTitle ===
                                    "Default Title" ? null : <p className="variant-title">
                                    Size: &nbsp;
                                    {itemDetail?.variantTitle}
                                  </p>}

                                  <p className="cart-item-price">
                                    <span>Price: &nbsp;</span>
                                    {this.state?.defaultCurrency} &nbsp;
                                    {itemDetail?.variantPrice}
                                    {/* <Money price={itemDetail?.variantPrice} format="currency price" /> */}
                                  </p>
                                  <button
                                    variantId={lineItem.varId}
                                    onClick={this.deleteLineitem}
                                    className="delete-button"
                                  >
                                    {/* <img src={deleteIcon} alt="" /> */}
                                    remove
                                  </button>
                                  <p className="quant-unavailable">
                                    Quantity Unavailable. Max available
                                    inventory
                                    <span></span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/* <td>
                                            <p className="cart-item-price">
                                              <span>Price: </span>
                                              {this.props.cart.PKR}
                                              {itemDetail?.variantPrice.original_price}
                                            </p>
                                          </td> */}
                            <td>
                              <div className="k-row quantity-picker-wrapper">
                                <Input
                                  variantId={lineItem.varId}
                                  className="quantity-picker"
                                  type="number"
                                  value={itemDetail?.quantity}
                                >
                                  <Button
                                    icon="minus"
                                    onClick={(e) =>
                                      this.quantityDecrement(
                                        e,
                                        lineItem.varId
                                      )
                                    }
                                    basic
                                  />
                                  <input
                                    max={itemDetail?.inventoryQuantity}
                                    className="quantity-picker"
                                    type="number"
                                    min="0"
                                  />
                                  <Button
                                    maxInventory={
                                      itemDetail?.inventoryQuantity
                                    }
                                    icon="plus"
                                    onClick={(e) =>
                                      this.quantityIncrement(
                                        e,
                                        lineItem.varId
                                      )
                                    }
                                    basic
                                  />
                                </Input>
                              </div>
                            </td>
                            <td>
                              <p className="cart-item-total-price">
                                <span>Total Price: &nbsp;</span>
                                {this.state?.defaultCurrency} &nbsp;
                                {itemDetail?.quantity *
                                  itemDetail?.variantPrice}
                                {/* <Money price={itemDetail?.quantity * itemDetail?.variantPrice} format="currency price" /> */}
                              </p>
                            </td>
                            {/* <td>
                                    <button
                                      variantId={lineItem.varId}
                                      onClick={this.deleteLineitem}
                                      className="delete-button"
                                    >
                                      <img src={deleteIcon} alt="" />
                                    </button>
                                  </td> */}
                          </tr>
                        );
                      })
                      : null}

                    {/* {this.state.cartEmpty ? (
                          <div className="empty-msg">
                            <h4>Cart Empty</h4>
                          </div>
                        ) : null} */}
                  </table>
                </div>

                <div className="subtotal-wrapper k-row">
                  <div className="add-note">
                    <p>Add a note to your order</p>
                  </div>
                  <div className="subtotal">
                    <h5>
                      Total: &nbsp;
                      {this.state?.defaultCurrency} &nbsp;
                      {this.props?.cart?.totalprice}
                      {/* <Money price={this.props?.cart?.totalprice} format="currency price" /> */}
                    </h5>
                    {/* <p>Shipping, and discounts will be calculated at checkout.</p> */}

                    <div className="k-row cart-action-btns">
                      {/* <button className="secondary-button">Continue Shipping</button>
                            <button className="secondary-button">Update Cart</button> */}

                      {this.state.allowCheckout ? (
                        <button
                          onClick={this.checkout}
                          className="primary-button "
                        >
                          Proceed to Checkout
                        </button>
                      ) : (
                        <button
                          onClick={this.checkout}
                          className="primary-button disabled "
                          disabled
                        >
                          Proceed to Checkout
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty_cart">
              <img src={cartIcon} width="50px" />
              <h4>Your Cart is Empty</h4>
              <p>Add Some Products in your Cart</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("cart", state);
  return {
    cart: state.cart,
    country: state?.multiLocation?.defaultCountry,
    defaultCurrency: state?.multiLocation?.defaultCurrency,
  };
};

export default connect(mapStateToProps)(Cart);
