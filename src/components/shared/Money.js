import React from 'react';
import { connect } from 'react-redux';

class Money extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let price = 0;

        if (this.props.currency === "PKR") {
            price = this.props.price;
        } else {
            price = this.props.price / this.props.rates["USDPKR"];
            price = Math.round(price * 100) / 100
        }
        
        const displayPrice = this.props.format.replaceAll("currency", this.props.currency).replaceAll("price", price);

        return (
            <>
                <span>{displayPrice}</span>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currency: state.currency.currency,
        rates: state.currency.rates
    };
};

export default connect(mapStateToProps)(Money);
