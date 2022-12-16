import './wallet.scss';
import { Tab,  Icon, Message } from 'semantic-ui-react'
import React, { Component } from 'react';
import Axios from 'axios'
import moment from 'moment';
import { Accordion } from 'semantic-ui-react'
export default class wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wallet: {},
            history: [],
            activeIndex: 0,
            coupon_id: '',
            redeemCoupan: '',
            redeemPoints: '',
            loyaltyPoints: '',
            showRedeemError: false,
            redeemError: false,
            token: sessionStorage.getItem('pcb-customer-token'),
            customer_id: sessionStorage.getItem('pcb-customer-id'),
        }
    }

    componentWillMount() {
        // debugger
        if (this.state.customer_id && this.state.token) {
        }
        else {
            window.location.href = "/"
        }
    }

    componentDidMount() {
        this.getWallet();
    }

    getWallet = () => {
        Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/get_wallet/' + this.state.customer_id + '?token=' + this.state.token)
            .then((response) => {
                // console.log("Wallet", response.data);
                this.setState({
                    wallet: response.data,
                    redeemPoints: response.data.loyalty_points.points
                }, () => this.getHistory())
            })
    }

    getHistory = () => {
        // debugger
        Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/get_wallet_history/' + this.state.wallet.id + '?token=' + this.state.token)
            .then((response) => {
                // console.log('History', response.data);
                this.setState({ history: response.data })
            })
    }

    handleChange = (event) => {
        if (event.target.value <= this.state.redeemPoints) {
            this.setState({ loyaltyPoints: event.target.value });
            // console.log('Less then redeem Points')
        }
        else {
            this.setState({
                showRedeemError: true,
                redeemError: "Input Points are greater then avialable Loyalty Points"
            })
            // console.log('Greater then redeem Points')
        }
    }

    redeemLoyaltyPoints = () => {
        let body = {
            "points": this.state.loyaltyPoints,
            "customer_id": sessionStorage.getItem('pcb-customer-id')
        }
        // debugger
        Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/redeem_loyalty_points' + '?token=' + this.state.token, body)
            .then((response) => {
                // debugger
                this.getWallet()
                // console.log("Points", response);
            })
            .catch((err) => {
                // console.log("Points", err)
                // debugger
                console.log("Redeem Err", err);
                this.setState({
                    redeemError: err.response.data.details,
                    showRedeemError: true
                })
            })
    }

    redeemCoupan = (id) => {
        let body = {
            "coupon_id": id,
            "customer_id": sessionStorage.getItem('pcb-customer-id')
        }
        // debugger
        Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/redeem_coupon' + '?token=' + this.state.token, body)
            .then((response) => {
                // debugger
                this.getWallet()
                // console.log("Points", response);
            })
            .catch((err) => {
                console.log("Points", err)
            })
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { history, showRedeemError, redeemError, activeIndex } = this.state

        const redeemPane = [
            {
                render: () =>
                    <Tab.Pane>
                        <div className="ui input">
                            <div>
                                <input className='points' value={this.state.loyaltyPoints} onChange={this.handleChange} type="text" placeholder="Type points" max={this.state.redeemPoints} />
                            </div>
                            <div >
                                <p className='total-value'>% {this.state.wallet?.loyalty_points?.amount_equal_point} = {this.state.loyaltyPoints / this.state.wallet?.loyalty_points?.amount_equal_point}</p>
                            </div>
                        </div>
                        <button className='button' type='submit' onClick={this.redeemLoyaltyPoints}>
                            REDEEM
                        </button>

                        {
                            showRedeemError ?
                                <Message
                                    className='err-message'
                                    error
                                    header=''
                                    content={redeemError}
                                /> : null
                        }

                    </Tab.Pane>
            }
        ]

        const coupansPane = [
            {
                render: () =>
                    <Tab.Pane>
                        {
                            this.state.wallet.coupons?.length ?
                                <>
                                    {
                                        this.state.wallet.coupons?.map((coupon) => {
                                            return <>
                                                <div className='coupans' >
                                                    <div>

                                                        <p className='coupan-code'>{coupon.name} {coupon.value}</p>
                                                    </div>
                                                    {new Date(coupon.expiry_date) < Date.now() ?
                                                        <button className='redeem expired' type='submit' disabled >Expired</button>
                                                        :
                                                        <button className='redeem' type='submit' onClick={(e) => this.redeemCoupan(coupon.id)} >Redeem</button>
                                                    }
                                                </div>
                                            </>
                                        })
                                    }
                                </>
                                : <p className='detail'>No Coupons Found</p>
                        }
                    </Tab.Pane>
            }
        ]

        const historyPane = [
            {
                render: () =>
                    <Tab.Pane className='c' >
                        {
                            this.state.history?.length ?
                                <>
                                    {
                                        this.state.history.map((his) => {
                                            return <>
                                                <div className='coupans history' >
                                                    <div className='coupans'>
                                                        <div className='arrow-div'>
                                                            {
                                                                his.action === "Debited" ?
                                                                    <Icon className='debit-arrow' name="arrow up" />
                                                                    : <Icon className='credit-arrow' name="arrow down" />
                                                            }
                                                        </div>
                                                        <p>{his.action} by {his.type}</p>
                                                    </div>
                                                    <div>
                                                        <p className='time'>{moment(his.created_at).format('h:mm:ss a, MMM Do YYYY')}</p>
                                                        {
                                                            his.action === "Debited" ?
                                                                <p className='debit_amount'>{his.value}</p>
                                                                : <p className='credit_amount'>{his.value}</p>
                                                        }
                                                        {/* <p className='amount'>{his.value}</p> */}
                                                    </div>
                                                </div>
                                            </>
                                        })
                                    }
                                </>
                                : <p className='detail'>No History Found</p>
                        }

                    </Tab.Pane>
            }
        ]
        return (
            <>
                < div className='wallet-main-container' >

                    <div className='div-styling balance'>
                        <p className='title'>TOTAL BALANCE</p>
                        {
                            this.state.wallet.value ?
                                <p className='details'>{this.state.wallet.value} PKR</p>
                                : <p className='details'>0.00 PKR</p>
                        }
                    </div>

                    <div className='div-styling'>
                        <p className='title'>Your Loyalty Points</p>
                        {
                            (this.state.wallet?.loyalty_points?.points > 0) ?
                                <>
                                    <p className='details'>{this.state.wallet?.loyalty_points?.points} Points</p>
                                </>
                                : <p className='details'>0 Points</p>
                        }
                    </div>

                    <Accordion fluid styled>

                        {
                            (this.state.wallet?.loyalty_points?.points > 0) ?
                                <>
                                    <Accordion.Title
                                        className='accordion-title'
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={this.handleClick}
                                    >
                                        <span className='tab-title'>
                                            Redeem Loyalty Points
                                        </span>
                                        <Icon name='dropdown' />
                                    </Accordion.Title>

                                    <Accordion.Content active={activeIndex === 0}>
                                        {
                                            this.state.wallet ?
                                                <>
                                                    <div className="ui input redeem-input">
                                                        <div>
                                                            <input className='points' value={this.state.loyaltyPoints} onChange={this.handleChange} type="text" placeholder="Type points" max={this.state.redeemPoints} />
                                                        </div>
                                                        <div >
                                                            <p className='total-value'> &divide; {this.state.wallet?.loyalty_points?.amount_equal_point} = {this.state.loyaltyPoints / this.state.wallet?.loyalty_points?.amount_equal_point}</p>
                                                        </div>
                                                    </div>
                                                    <button className='button' type='submit' onClick={this.redeemLoyaltyPoints}>
                                                        REDEEM
                                                    </button>

                                                    {
                                                        showRedeemError ?
                                                            <Message
                                                                className='err-message'
                                                                error
                                                                header=''
                                                                content={redeemError}
                                                            /> : null
                                                    }
                                                </>
                                                : null
                                        }
                                    </Accordion.Content>
                                </>
                                : null
                        }

                    </Accordion>

                    <Accordion fluid styled>

                        <Accordion.Title
                            className='accordion-title'
                            active={activeIndex === 1}
                            index={1}
                            onClick={this.handleClick}
                        >
                            <span className='tab-title'>
                                COUPONS
                            </span>
                            <Icon name='dropdown' />
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === 1}>
                            {
                                this.state.wallet.coupons?.length ?
                                    <>
                                        {
                                            this.state.wallet.coupons?.map((coupon) => {
                                                return <>
                                                    <div className='coupans' >
                                                        <div>

                                                            <p className='coupan-code'>{coupon.name} {coupon.value}</p>
                                                        </div>
                                                        {new Date(coupon.expiry_date) < Date.now() ?
                                                            <button className='redeem expired' type='submit' disabled >Expired</button>
                                                            :
                                                            <button className='redeem' type='submit' onClick={(e) => this.redeemCoupan(coupon.id)} >Redeem</button>
                                                        }
                                                    </div>
                                                </>
                                            })
                                        }
                                    </>
                                    : <p className='detail'>No Coupons Found</p>
                            }
                        </Accordion.Content>
                    </Accordion>

                    <Accordion fluid styled>
                        <Accordion.Title
                            className='accordion-title'
                            active={activeIndex === 2}
                            index={2}
                            onClick={this.handleClick}
                        >
                            <span className='tab-title'>
                                HISTORY
                            </span>
                            <Icon name='dropdown' />
                        </Accordion.Title>

                        <Accordion.Content active={activeIndex === 2}>
                            {
                                this.state.history?.length ?
                                    <>
                                        {
                                            this.state.history.map((his) => {
                                                return <>
                                                    <div className='coupans history' >
                                                        <div className='coupans'>
                                                            <div className='arrow-div'>
                                                                {
                                                                    his.action === "Debited" ?
                                                                        <Icon className='debit-arrow' name="arrow up" />
                                                                        : <Icon className='credit-arrow' name="arrow down" />
                                                                }
                                                            </div>
                                                            <p>{his.action} by {his.type}</p>
                                                        </div>
                                                        <div>
                                                            <p className='time'>{moment(his.created_at).format('h:mm:ss a, MMM Do YYYY')}</p>
                                                            {
                                                                his.action === "Debited" ?
                                                                    <p className='debit_amount'>{his.value}</p>
                                                                    : <p className='credit_amount'>{his.value}</p>
                                                            }
                                                            {/* <p className='amount'>{his.value}</p> */}
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </>
                                    : <p className='detail'>No History Found</p>
                            }
                        </Accordion.Content>

                    </Accordion>
                </div >


            </>
        );
    }
}
