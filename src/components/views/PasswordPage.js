import React from 'react';
import { Button, Form } from 'semantic-ui-react'
import Axios from 'axios'

class PasswordPage extends React.Component {
  state = { 
    passwordChecked: false
   }

  checkPassword = () => {
    var val = document.getElementById("store-password").value
     Axios.post(process.env.REACT_APP_BACKEND_HOST + '/storefront/check_password', {
      password: val
     })
     .then((res) => {
        // console.log(res.data)
        this.props.changePasswordEnabledState()
        sessionStorage.setItem('passwordMatched', 'true');
        this.setState({
          passwordChecked: true
        })
     })
     .catch((err) => {
       console.log(err)
        document.getElementsByClassName("error-message")[0].style.display = 'block'
     })
  }

  render() { 
    return ( 
      <div className='password-page'>
        <Form>
          <Form.Field>
            <label>Password</label>
            <input id='store-password' placeholder='Enter your password' type='password' />
          </Form.Field>
          <Button type='submit' value='submit' onClick={this.checkPassword}>Submit</Button>
          <p className='error-message'>Wrong password</p>
        </Form>
      </div>
     );
  }
}
 
export default PasswordPage;