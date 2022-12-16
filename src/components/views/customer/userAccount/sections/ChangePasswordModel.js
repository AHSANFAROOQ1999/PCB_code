import React from 'react'
import { Button, Header, Message, Modal, Form } from 'semantic-ui-react'
import Axios from 'axios';


function ChangePasswordModel(props) {
  const [open, setOpen] = React.useState(false)
  const [formError, setFormError] = React.useState(false)
  const [passwordChanged, setPasswordChanged] = React.useState(false)
  const [formErrorContent, setFormErrorContent] = React.useState('')
  const [oldPass, setOldPass] = React.useState('')
  const [newPass, setNewPass] = React.useState('')
  

  const handleChange = (e) => {
    if(e.target.name === 'old-pass' )
    {
      setOldPass(e.target.value)
    }
    if(e.target.name === 'new-pass' )
    {

      setNewPass(e.target.value)
    }
  }

  const saveNewPassword = () => {
    // debugger
    let body = {
      old_password : oldPass,
      new_password : newPass
    }
    Axios.put(process.env.REACT_APP_BACKEND_HOST + '/storefront/account?token='+props.token, body)
    .then( (response) => {
      setPasswordChanged(true)
      setFormError(false)
    })
    .catch( (err) => {
      // debugger
      setFormError(true)
      setFormErrorContent(err.response.data.detail)
    }) 
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button className="change-password-btn">Change Password</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size='tiny'
    >
      <Header content='Change Your Password' />
      <Modal.Content>
        <Form  error={formError}>
          <Form.Field>
            <label>Old Password</label>
            <input type="password" name='old-pass' placeholder='' onChange={handleChange} />
          </Form.Field>
          <Form.Field>
            <label>New Password</label>
            <input type="password" name='new-pass' placeholder='' onChange={handleChange} />
          </Form.Field>
          <Message
            error
            header=''
            content={formErrorContent}
          />
          {
            passwordChanged ? 
              <Message
              info
              content='password changed successfully'
              />
            : null
          }
          
          
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button color='green' onClick={() => saveNewPassword()}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ChangePasswordModel
