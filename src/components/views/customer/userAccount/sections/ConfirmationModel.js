import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import Axios from 'axios';


function ConfirmationModel(props) {
  const [open, setOpen] = React.useState(false)

  const takeAction = (e) => {

    if(props.id)
    {
      Axios.delete(process.env.REACT_APP_BACKEND_HOST + '/storefront/account_address_delete?token='+props.token + '&id=' + props.id)
      .then( (response) => {
        // debugger
        // console.log('customer address deleted', response)
        document.querySelector('.customer-address-item[addressId="'+ props.id +'"]').remove()
        // debugger
        setOpen(false)
      })
      .catch((err) => {
        
        console.log(err)
      })
    }
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button icon='trash'></Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size="mini"
    >
      {/* <Header icon='archive' content='Archive Old Messages' /> */}
      <Modal.Content>
        <p>
          Delete Address ?
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={() => setOpen(false)}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='red' onClick={(e) => takeAction(e)}>
          <Icon name='checkmark' /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmationModel
