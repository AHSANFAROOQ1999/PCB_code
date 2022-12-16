import React, {  useEffect } from 'react'
import { Button, Header, Modal, Form, Message } from 'semantic-ui-react'
// import { } from '../services/context'
import Axios from 'axios';
import { 
  // countryOptions,
  //  cityOptions,
   validatePhoneNumber } from '../../../../../services/context'

function Model(props) {
  const [open, setOpen] = React.useState(false)
  const [firstName, setfirstName] = React.useState(props.address.first_name)
  const [lastName, setlastName] = React.useState(props.address.last_name)
  const [appartment, setappartment] = React.useState(props.address.apartment)
  const [address, setaddress] = React.useState(props.address.address)
  const [phone, setphone] = React.useState(props.address.phone)
  const [city, setcity] = React.useState(props.address.city)
  const [country, setcountry] = React.useState(props.address.country)
  const [postalCode, setpostalCode] = React.useState(props.address.postal_code)
  const [phoneError, setphoneError] = React.useState(false)
  const [formError, setformError] = React.useState(false)

  const [cityOptions, setCities] = React.useState()
  const [countryOptions, setCountries] = React.useState()

  useEffect(() => {
    getCountries();

  }, [])

  const getCountries = () => {
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/order/countries')
      .then((response) => {
        setCountries(response.data, () => {
          if (countryOptions.value) {
            // debugger;
            let country = response.data.find(countryOptions => countryOptions.value === countryOptions.value)
            if (country) {
              getCities(country.key)
            }
          } else {
            setCountries({ country: { value: response.data[0].value, valid: true } })
            getCities(response.data[0].key)
          }
        })
      })
  }

  const getCities = (countryId) => {
    Axios.get(process.env.REACT_APP_BACKEND_HOST + '/order/cities?country_id=' + countryId)
      .then((response) => {
        setCities(response.data)
      })
  }



  const updateAddress = () => {
    let token = sessionStorage.getItem('pcb-customer-token')
    let body = {
      "address":
      {
        // "id" : props.address.id,
        "first_name": firstName,
        "last_name": lastName,
        "phone": phone,
        "address": address,
        "apartment": appartment,
        "city": city,
        "country": country,
        "postal_code": postalCode,
        "primary_address": false
      }
    }
    if (props.address.id) {
      body.address.id = props.address.id
    }
    // debugger
    if (firstName && lastName && address && phone && city && country && phoneError === false) {
      setformError(false)
      // debugger
      Axios.put(process.env.REACT_APP_BACKEND_HOST + '/storefront/account?token=' + token, body)
        .then((response) => {
          // console.log('customer detail updated', response)
          props.resetCustomerDetail(response.data)
          setOpen(false)
        })
        .catch((err) => {
          console.log(err.response)
          // debugger
          sessionStorage.removeItem('pcb-customer-token')
          sessionStorage.removeItem('pcb-customer-email')
          window.location.href = '/login'
        })
    }
    else {
      setformError(true)
    }
  }

  const updatePhoneNo = (value) => {
    setphone(value)
    let phoneValid = validatePhoneNumber(value)
    // debugger
    if (phoneValid) {
      setphoneError(false)
    }
    else {
      setphoneError({
        content: 'Phone nmber should be 00974 xxxx xxxx',
        pointing: 'below',
      })
    }
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button className="primary-button" >{props.buttonName}</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size='tiny'
    >
      <Header content='Edit Address' />

      <Modal.Content>
        <Form error={formError} >
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              placeholder='First name'
              id='form-input-first-name'
              required
              label="First name"
              value={firstName}
              // error={firstNameError}
              name="firstName"
              onChange={(e) => setfirstName(e.target.value)}
            />
            <Form.Input
              fluid
              placeholder='Last name'
              required
              label="Last name"
              value={lastName}
              // error={lastNameError}
              name="lastName"
              onChange={(e) => setlastName(e.target.value)}
            />
          </Form.Group>
          <Form.Input
            fluid
            placeholder='Appartment'
            label="Appartment"
            value={appartment}
            // error={emailError}
            name={"appartment"}
            onChange={(e) => setappartment(e.target.value)}

          />
          <Form.Input
            fluid
            placeholder='Address'
            required
            label="Address"
            value={address}
            // error={emailError}
            name={"address"}
            onChange={(e) => setaddress(e.target.value)}


          />
          <Form.Input
            fluid
            placeholder='Phone'
            required
            label="Phone"
            value={phone}
            error={phoneError}
            name={"phone"}
            type="number"

            onChange={(e) => updatePhoneNo(e.target.value)}

          />
          <Form.Dropdown
            required
            placeholder='Select City'
            fluid
            search
            label="City"
            name="city"
            selection
            id="customer-city"
            onChange={(e, data) => setcity(data.value)}
            options={cityOptions}
            value={city}
          />
          <Form.Group widths="equal">
            <Form.Dropdown
              required
              placeholder='Select Country'
              fluid
              search
              label="Country"
              name="country"
              selection
              id="customer-country"
              onChange={(e, data) => setcountry(data.value)}
              options={countryOptions}
              value={country}
            />
            <Form.Input
              fluid
              placeholder='Postal code'
              label="Postal Code"
              value={postalCode}
              // error={emailError}
              type="number"
              name={"postalCode"}
              onChange={(e) => setpostalCode(e.target.value)}

            />
          </Form.Group>
          <Message
            error
            header=''
            content={'Fill required fields'}
          />
          {/* <Button className='primary-button login'>Sign up</Button> */}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button className="secondary-button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button className="primary-button" onClick={() => updateAddress()} >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default Model
