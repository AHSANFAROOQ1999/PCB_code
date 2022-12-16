import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Protected = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            sessionStorage.getItem('pcb-customer-token') ? (
                <Component {...props} />
            ) : <Redirect to='/login' />
        }
    />
)

export default Protected;