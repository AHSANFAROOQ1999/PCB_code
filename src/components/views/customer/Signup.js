import React, { Component } from 'react';
import { Form, Button, Message } from 'semantic-ui-react'
import Axios from 'axios';
import { Link } from "react-router-dom"
// import { BrowserRouter as Link } from "react-router-dom";

class Signup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showFormError: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      passwordError: false,
      formComplete: false,
      errorMessage: '',

    }
  }

  signup = (e) => {
    e.preventDefault()
    const { firstName, lastName, email, password, formComplete } = this.state

    if (formComplete === true) {
      let body = {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "password": password,
        "has_account": true
      }

      Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/signup', body)
        .then((response) => {
          // console.log(response)
          sessionStorage.setItem("pcb-customer-token", response.data.token)
          sessionStorage.setItem("pcb-customer-email", response.data.email)
          sessionStorage.setItem("pcb-customer-id", response.data.id)
          window.location.href = '/account'
        })
        .catch((err) => {
          console.log(err)
          if (err.response.status === 400) {
            // debugger
            let errorMessage = ''
            if (err.response.data.detail) {
              errorMessage = err.response.data.detail
            }
            else {
              errorMessage = "Email already taken"
            }
            this.setState({
              showFormError: {
                content: errorMessage,
              }
            })
          }

        })

    }
    else {
      this.setState({
        showFormError: true
      })
    }
  }

  handleChange = (event) => {

    this.setState({
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      passwordError: false,
      formComplete: true
    })
    let { name, value } = event.target
    this.setState({
      [name]: value
    }, () => {

      if (name === 'email') {
        let ifEmail = this.validateEmail(this.state[name])
        if (!ifEmail) {
          this.setState({
            emailError: {
              content: 'Enter valid email formate',
              pointing: 'below',
            }
          })
        }
      }

      if (name === "firstName") {
        let ifIncludesNumber = this.ifIncludesNumber(value)
        if (ifIncludesNumber) {
          this.setState({
            firstNameError: {
              content: 'First name should not include number',
              pointing: 'below',
            }
          })
        }
      }
      if (name === "lastName") {
        let ifIncludesNumber = this.ifIncludesNumber(value)
        if (ifIncludesNumber) {
          this.setState({
            lastNameError: {
              content: 'Last name should not include number',
              pointing: 'below',
            }
          })
        }
      }

      if (name === "password") {

        if (value.length < 8) {
          this.setState({
            passwordError: {
              content: 'password should be greater then 8 digits',
              pointing: 'below',
            }
          })
        }
      }

      if (name === "lastName" || name === 'firstName' || name === 'email' || name === 'password') {
        if (value === '') {
          this.setState({
            formComplete: false
          })
        }
      }

    })

  }

  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validatePhoneNumber = (inputtxt) => {
    var phoneno = /^(\d{11}(\,\d{11}){0,2})$/
    if (phoneno.test(inputtxt)) { return true }
    else { return false }
  }

  ifIncludesNumber = (input) => {
    var hasNumber = /\d/
    return hasNumber.test(input)

  }


  render() {
    const { showFormError, firstName, lastName, email, password, firstNameError, lastNameError, emailError, passwordError } = this.state
    return (
      <div className='signup-page'>
        <div  >
          <h1>New Customer</h1>
          <div>
            <Form error={showFormError} onSubmit={this.signup} >
              <Form.Input
                fluid
                placeholder='First name'
                id='form-input-first-name'
                required
                value={firstName}
                error={firstNameError}
                name={"firstName"}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                placeholder='Last name'
                required
                value={lastName}
                error={lastNameError}
                name={"lastName"}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                placeholder='Email'
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
              <Message
                error
                header=''
                content={showFormError.content}
              />
              <Link to='/login'>
                <button className='forgot-pass' type="button" onClick={() => this.setState({ forgotPassord: true })}>Already Existing User ?</button>
              </Link>
              <Button type="submit" className='primary-button login'>Sign up</Button>
            </Form>

          </div>
        </div>
      </div>
    );
  }
}

export default Signup;