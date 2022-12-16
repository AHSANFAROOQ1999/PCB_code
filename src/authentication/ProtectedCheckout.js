import React from 'react';
import {
  Route,
  // Redirect
} from 'react-router-dom';

const ProtectedCheckout = ({ component: Component, props, ...rest }) => (

  <Route
    {...rest}
    render={(props) =>
      JSON.parse(localStorage.getItem('cart'))?.length > 0 ? (
        <Component {...props} />
      ) :
        window.location.href = "/cart"
    }
  />

)

export default ProtectedCheckout;