import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Form, Button, Message } from 'semantic-ui-react'
import Axios from 'axios';
import { validateEmail } from '../../../services/context'
import { connect } from 'react-redux'
import { loginn } from '../../../redux/slices/accountSlice'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showFormError: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      formError: '',
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      passwordError: false,
      formComplete: false,
      forgotPassord: false,
      forgotEmail: '',
      forgotPasswordFormError: false,
      mailSent: false,
      routeTo: false,
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target
    this.setState({
      [name]: value
    })

  }
  submitForgotpasswordForm = () => {

    let ifEmail = validateEmail(this.state.forgotEmail)
    if (ifEmail) {
      let body = {
        email: this.state.forgotEmail
      }
      Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/forget_password', body)
        .then((response) => {
          this.setState({
            mailSent: true,
            forgotPasswordFormError: false
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
    else {
      this.setState({
        forgotPasswordFormError: true
      })
    }


  }

  login = () => {

    let body = {
      "email": this.state.email,
      "password": this.state.password
    }

    Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/signin', body)
      .then((response) => {
        // console.log("Login Response", response)

        this.props.dispatch(loginn(response))

        let redirectToCheckout = localStorage.getItem('redirectToCheckout')
        if (redirectToCheckout === "true") {
          localStorage.removeItem('redirectToCheckout')
          this.setState({ routeTo: "checkout" })
        }
        else {
          this.setState({ routeTo: "account" })
        }
      })
      .catch((err) => {
        this.setState({
          showFormError: true,
          // formError: err.response.data.detail
          formError: err.response?.data.detail
        })
      })
  }


  mapVariantId(data) {
    return {variant_id: data.variant_id}
  }

  mapObject(data){
    return data.product_data;
  }

    getWishList = () => {
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist', {
      headers: {
        "pushpa": sessionStorage.getItem('pcb-customer-token')
      }
    })
    .then((response) => {
      localStorage.setItem('wishList', JSON.stringify((response.data.results).map(this.mapObject)));
    })
  }

  postWishList = () => {
    if (localStorage.getItem("wishList")) {
      let wishlist = JSON.parse(localStorage.getItem("wishList"));
      let customerToken = sessionStorage.getItem('pcb-customer-token');
      const variant_id = wishlist.map(this.mapVariantId);

      Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/wishlist', variant_id, {
        headers: {
          "pushpa": customerToken
        }
      })
        .then((response) => {
          this.getWishList();
        })
    }
  }

  render() {
    const { email, password, emailError, passwordError, showFormError, formError } = this.state
    return (

      <div className='login-page'>
        {
          this.state.routeTo ?
            <Redirect to={"/" + this.state.routeTo} /> : null
        }
        <div>
          <h1>Login with your account</h1>
          {/* <p>Enter your e-mail address and password to log in.</p> */}
          <div>
            {
              this.state.forgotPassord ?
                <Form error={this.state.forgotPasswordFormError} onSubmit={this.send} >
                  <Form.Input
                    fluid
                    placeholder='Email address'
                    required
                    value={this.state.forgotEmail}
                    error={emailError}
                    name={"forgotEmail"}
                    onChange={this.handleChange}

                  />
                  <button type="button" className='forgot-pass' onClick={() => this.setState({ forgotPassord: false })}>Sign In with existing Password </button>
                  {
                    this.state.mailSent ?
                      <Message
                        info
                        content='Link sent to your email. Kindly use that link to create new password.'
                      />
                      : null
                  }
                  {
                    this.state.forgotPasswordFormError ?
                      <Message
                        error
                        content='Incorrect email formate'
                      />
                      : null
                  }
                  {
                    this.state.forgotEmail !== '' ?
                      <Button className='primary-button login' type="submit" onClick={this.submitForgotpasswordForm} >Submit</Button>
                      : <Button className='primary-button login' onClick={this.submitForgotpasswordForm} disabled >Submit</Button>
                  }
                </Form>
                :
                <Form error={showFormError} onSubmit={this.signup} >
                  <Form.Input
                    fluid
                    placeholder='Email address'
                    required
                    value={email}
                    error={emailError}
                    name={"email"}
                    onChange={this.handleChange}

                  />
                  <Form.Input
                    fluid
                    type="password"
                    placeholder='Password'
                    required
                    name={"password"}
                    value={password}
                    error={passwordError}
                    onChange={this.handleChange}
                  />

                  <button className='forgot-pass' type="button" onClick={() => this.setState({ forgotPassord: true })}>Forgot password</button>

                  <Message
                    error
                    header=''
                    content={formError}
                  />
                  {
                    email !== '' && password !== '' ?
                      <Button className='primary-button login' type="submit" onClick={this.login} >SIGN IN</Button>
                      : <Button className='primary-button login' onClick={this.login} disabled >SIGN IN</Button>
                  }
                  <div className='or-divider'>
                    <p>OR</p>
                  </div>
                  <Link className="signup" to='/signup'><button type='button' className='secondary-button signup'> CREATE ACCOUNT</button></Link>
                </Form>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn
});

export default connect(mapStateToProps)(Login);

