import React from 'react';
import Footer from '../../shared/footer/Footer'
import Axios from 'axios';
import { Form, Button, Message } from 'semantic-ui-react'


class ForgotPassword extends React.Component {
  

  constructor(props){
    super(props)
    this.state = {
      tempToken: props.match.params.token,
      tokenValid: false,
      emailError: false,
      newPassword: '',
      confirmPassword: '',
      passwordChanged : false,
      formError: false,
      formErrorMessage : ''
    }
  }

  componentDidMount ()
  {
    let body = {
      key: this.state.tempToken
    } 
    Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/check_forgot_expiry', body)
    .then( (response) => {
      this.setState({
        tokenValid: !response.data.expired
      })
    })
    .catch( (err) => {
      console.log(err)
    })
  }
  handleChange = (event) => {
    let {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  changePasswordApi = () => {
    // debugger
    
    let body = {
      key: this.state.tempToken,
      password : this.state.newPassword,
      confirm_password: this.state.confirmPassword
    }
    Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/set_password', body)
    .then( (response) => {
    //  debugger 
      this.setState({
        passwordChanged : true
      })
    })
    .catch( (err) => {
      // debugger
      console.log(err)
    })
    
  }
  changePassword = () => {
    // debugger
    if(this.state.newPassword.length < 8 || this.state.confirmPassword.length < 8)
    {
      this.setState({
        formError: true,
        formErrorMessage: 'Minimum length for password should be 8'
      })
    }
    else if(this.state.newPassword !== this.state.confirmPassword)
    {
      this.setState({
        formError: true,
        formErrorMessage: 'Password does not match'
      })
    }
    else
    {
      this.setState({
        formError: false
      }, this.changePasswordApi())
    }

  }

  

  render() { 
    return ( <div >
      {
        this.state.tokenValid ? 

      <div className='forgot-password-page k-form'>
        <h1>Create New Password</h1>
        <Form error={this.state.formError} >
          <Form.Input
            fluid
            placeholder='New Password'
            required
            type='password'
            value={this.state.forgotEmail}
            error={this.state.emailError}
            name={"newPassword"}
            onChange={this.handleChange}

          />
          <Form.Input
            fluid
            type='password'
            placeholder='Confirm Password'
            required
            value={this.state.forgotEmail}
            error={this.state.emailError}
            name={"confirmPassword"}
            onChange={this.handleChange}

          />

          {
            this.state.passwordChanged  ? 
            <Message
              info
              content='Password changed. Login with your new Password'
            />
            : null
          }
          {
            this.state.formError ? 
            <Message
              error
              content={this.state.formErrorMessage}
            />
            : null
          }
          {
            this.state.newPassword !== '' && this.state.newPassword !== '' ?
              <Button className='primary-button login' onClick={this.changePassword} >Submit</Button>
            : <Button className='primary-button login' onClick={this.changePassword} disabled >Submit</Button>
            
          }
        </Form>
      </div>
      : <div className='token-expired-fallback'>
        <h1>Token Expired, Go to <a href="/"> home page</a> </h1>
      </div> 
      }
      <Footer/>
    </div>
     );
  }
}
 
export default ForgotPassword;