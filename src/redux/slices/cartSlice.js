import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalprice: 0,
    totalCount: 0,
    // cart:  [JSON.parse(localStorage.getItem('cart'))]
    // Currency: "PKR",
    cart:
      JSON.parse(localStorage.getItem("cart")) == null ||
        JSON.parse(localStorage.getItem("cart")).length === 0
        ? []
        : JSON.parse(localStorage.getItem("cart")).length >= 1
          ? JSON.parse(localStorage.getItem("cart"))
          : [JSON.parse(localStorage.getItem("cart"))],
  },
  reducers: {
    Add_to_cart: (state, action) => {
      // debugger;
      // console.log('actions_add',action);
      // console.log("add_action", action.payload[0]);
      // debugger;
      let cart = state.cart;
      let variantFound = false;
      // console.log("cart-lengt", cart.length);
      if (cart.length != 0 && cart[0] !== null) {
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].varId === action.payload[0].detail.variantId) {
            let updateQuantity =
              parseInt(cart[i].detail.quantity) +
              parseInt(action.payload[0].detail.quantity);
            variantFound = true;
            cart[i].detail.quantity = updateQuantity;
          }
        }
      }
      if (!variantFound) {
        // for adding one item at a time
        state.cart.push(action.payload[0]);
      }

      // if (cart) {
      //   for (let i = 0; i < cart.length; i++) {
      //     const lineitem = cart[i];
      // let totalprice=state.totalprice;
      // let totalCount=state.totalCount;

      //     totalCount += parseInt(action.payload.detail.quantity);
      //     totalprice +=
      //       lineitem.action.payload.detail.variantPrice.original_price *
      //       lineitem.action.payload.detail.quantity;
      //   }
      //   // this.setState({ totalProducts: totalCount, totalAmount: totalprice });
      // }

      //  localStorage.setItem('cart', JSON.stringify(state.cart))

      cart = localStorage.setItem("cart", JSON.stringify(cart));
    },

    Remove_from_cart: (state, action) => {
      let cart = state.cart;
      // console.log("remove", action.payload[0]);
      // debugger;
      for (let i = 0; i < cart.length; i++) {
        const lineItem = cart[i];
        if (lineItem.varId === action.payload[0].varId) {
          // console.log("payload", action.payload[0].varId);
          cart.splice(i, 1);
        }
      }
    },

    Update_minicart: (state, action) => {
      // debugger;

      // updating minicart
      let { cart } = state;
      let totalPrice = 0;
      let totalcount = 0;
      // if (cart.length >= 0 && cart[0] != null) {
      // console.log("true", cart.length);
      for (let i = 0; i < cart?.length; i++) {
        // console.log("count", totalcount);
        // debugger;
        const lineitem = cart[i];

        totalcount += parseInt(lineitem?.detail?.quantity);
        // console.log("qw", parseInt(lineitem?.detail?.quantity));
        totalPrice +=
          lineitem?.detail?.variantPrice * lineitem?.detail?.quantity;
      }
      // console.log("totalCount", totalcount);
      state.totalCount = totalcount;
      state.totalprice = totalPrice;
      // }
    },

    Update_incr_Qty: (state, action) => {
      let cart = state.cart;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].varId === action.payload) {
          let updateQuantity = parseInt(cart[i].detail.quantity) + 1;
          cart[i].detail.quantity = updateQuantity;
        }
      }
    },

    Update_decr_Qty: (state, action) => {
      // debugger;
      let cart = state.cart;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].varId === action.payload) {
          if (cart[i].detail.quantity > 1) {
            let updateQuantity = parseInt(cart[i].detail.quantity) - 1;

            cart[i].detail.quantity = updateQuantity;
            // console.log("cart[i].detail.quantity", cart[i].detail.quantity);
          }
        }
        // console.log("action.payload.id", action.payload);
      }
    },

    clearCart: (state, action) => {
      // debugger;
      state.cart = [];
      state.totalCount = 0;
      state.totalprice = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("wishList");
      localStorage.removeItem("checkout_id");
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  Add_to_cart,
  Remove_from_cart,
  Update_minicart,
  Update_decr_Qty,
  Update_incr_Qty,
  clearCart,
} = cartSlice.actions;

// console.log(cartSlice);

export default cartSlice.reducer;
