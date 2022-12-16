import React from "react";
// import cartIcon from "../../../../assets/svg/cartIcon.svg";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Update_minicart,
} from "../../../../redux/slices/cartSlice";
import { Icon } from "semantic-ui-react";
import { Drawer } from 'antd';
import SideCart from "../../../views/SideCart";



class MiniCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      totalProducts: 0,
      totalAmount: 0,
      showSideCart: false,
    };
  }


  showDrawer = () => {
    this.setState({
      showSideCart: true
    })
  };

  onClose = () => {
    this.setState({
      showSideCart: false
    })
  };

  updateCart = () => {
    this.props.dispatch(Update_minicart());

    // this.props.disptach(Add_to_cart())
    // let cart = JSON.parse(localStorage.getItem("cart"));
    // // let cartTotal = localStorage.getItem('cartTotal')
    // let totalCount = 0,
    //   totalprice = 0;

    // if (cart) {
    //   for (let i = 0; i < cart.length; i++) {
    //     const lineitem = cart[i];

    //     totalCount += parseInt(lineitem.detail.quantity);
    //     totalprice +=
    //       lineitem.detail.variantPrice.original_price *
    //       lineitem.detail.quantity;
    //   }
    //   this.setState({ totalProducts: totalCount, totalAmount: totalprice });
    // }
  };

  componentDidMount() {
    this.updateCart();
  }

  render() {
    return (
      <>
        <div className="micicart cart-icon k-row">
          <div className=" k-row">
            {/* <Link className="cart-link" to="/cart"> */}

            <button onClick={this.showDrawer} className="cart_btn">
              <div >
                {/* <Icon name='shopping bag' /> */}
                <p id="cart-total">
                  <span>
                    {/* {this.props.cart.PKR} */}
                    <Icon name='shopping bag' />
                    (<span className="cart-total-quantity">
                      {this.props.cart.totalCount}
                    </span>)
                  </span>
                </p>
              </div>
            </button>

            {/* <img src={cartIcon} alt="cart-icon" /> */}
            {/* <span className="cart-count">{this.props.cart.totalCount}</span> */}
            {/* </Link> */}

            {/* <Link to="/cart">
              <p id="cart-total">
                <span> */}
            {/* {this.props.cart.PKR} */}
            {/* <span className="cart-total-quantity">
                    ({this.props.cart.totalCount})
                  </span>
                </span>
              </p>
            </Link> */}
          </div>
        </div>


        <Drawer title="Order Summary" placement="right" onClose={this.onClose} visible={this.state.showSideCart}>
          <SideCart isOpen={this.state.showSideCart} onClose={this.onClose} />
        </Drawer>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

export default connect(mapStateToProps)(MiniCart);
