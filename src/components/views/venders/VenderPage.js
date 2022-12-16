import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Message } from 'semantic-ui-react';
// import { render } from "sass";
import ThankuImg from '../../../assets/img/thankyou.svg';


class VenderPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showFormError: false,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',

            storeName: '',
            companyName: '',
            productsYouSell: '',
            address: '',

            tradeLicense: '',
            nationalId: '',

            beneficiaryName: '',
            bankName: '',
            branchName: '',
            accountNumber: '',
            ibanNumber: '',
            swiftCode: '',
            cancelCheck: '',

            firstNameError: false,
            lastNameError: false,
            emailError: false,
            phoneError: false,

            storeNameError: false,
            companyNameError: false,
            productsYouSellError: false,
            addressError: false,

            tradeLicenseError: false,
            nationalIdError: false,

            beneficiaryNameError: false,
            bankNameError: false,
            branchNameError: false,
            accountNumberError: false,
            ibanNumberError: false,
            swiftCodeError: false,
            cancelCheckError: false,


            formComplete: false,
            stepComplete: false,
            errorMessage: '',
            activeIndex: 1,
        }
    }


    signup = (e) => {
        // debugger
        // this.setState({
        //     showFormError: false,
        //     formComplete: true
        // })
        e.preventDefault()

        const { formComplete, firstName, lastName, email, phone, storeName, companyName, productsYouSell, address, tradeLicense, nationalId,
            beneficiaryName, bankName, branchName, accountNumber, ibanNumber, swiftCode, cancelCheck } = this.state

        if (formComplete === true) {

            let data = {
                "name": firstName + " " + lastName,
                "email": email,
                "phone": phone,
                "address": address,
                "store_name": storeName,
                "company_phone": companyName,
                "products_you_sell": productsYouSell,
                "beneficiary_name": beneficiaryName,
                "bank_name": bankName,
                "branch_name": branchName,
                "account_number": accountNumber,
                "iban": ibanNumber,
                "swift_code": swiftCode
            }
            var bodyFormData = new FormData();
            bodyFormData.append('tradeLicense', tradeLicense);
            bodyFormData.append('nationalId', nationalId);
            bodyFormData.append('cancelCheck', cancelCheck);
            bodyFormData.append('data', JSON.stringify(data))
            // debugger

            Axios({
                method: "post",
                url: process.env.REACT_APP_BACKEND_HOST + '/vendors/external_signup',
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) => {
                    //handle success
                    // console.log(response)
                    // debugger
                    this.setState({ activeIndex: 5 })
                    // debugger
                })
                .catch((response) => {
                    //handle error
                    // debugger
                    console.log(response);
                });

        }
        else {
            this.setState({
                showFormError: true
            })
        }
    }

    step = () => {
        // debugger

        if (this.state.activeIndex === 1) {
            if (this.state.firstName && this.state.lastName && this.state.email && this.state.phone) {
                this.setState({ activeIndex: this.state.activeIndex + 1 })
            }
        }
        if (this.state.activeIndex === 2) {
            if (this.state.storeName && this.state.companyName && this.state.productsYouSell && this.state.address) {
                this.setState({ activeIndex: this.state.activeIndex + 1 })
            }
        }
        if (this.state.activeIndex === 3) {
            if (this.state.tradeLicense && this.state.nationalId) {
                this.setState({ activeIndex: this.state.activeIndex + 1 })
            }
        }
        if (this.state.activeIndex === 4) {
            if (this.state.beneficiaryName && this.state.bankName && this.state.branchName && this.state.accountNumber && this.state.ibanNumber && this.state.swiftCode) {
                this.setState({ formComplete: true, stepComplete: true })
            }
        }
    }

    handleChange = (event) => {

        this.setState({
            firstNameError: false,
            lastNameError: false,
            emailError: false,
            phoneError: false,
            // activeIndex: 1,
            stepComplete: false,
            formComplete: false
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
                            content: 'Enter valid email format',
                            pointing: 'below',
                            stepComplete: false,
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
                            stepComplete: false,
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
                            stepComplete: false,
                        }
                    })
                }
            }

            if (name === "phone") {

                if (value.length < 8) {
                    this.setState({
                        phoneError: {
                            content: 'Invalid phone number',
                            pointing: 'below',
                            stepComplete: false,
                        }
                    })
                }
            }
            // debugger

            if (name === "lastName" || name === 'firstName' || name === 'email' || name === 'phone') {
                if (value === '') {
                    this.setState({
                        stepComplete: false
                    })
                }

            }

        })

        this.setState({
            beneficiaryNameError: false,
            bankNameError: false,
            branchNameError: false,
            accountNumberError: false,
            ibanNumberError: false,
            swiftCodeError: false,
            cancelCheckError: false
        })
        this.setState({

            [name]: value
        }, () => {

            if (name === "beneficiaryName") {
                if (value !== '') {
                    this.setState({
                        beneficiaryName: value
                    })
                }
                else {
                    this.setState({
                        beneficiaryNameError: {
                            content: 'Beneficiary name name should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "bankName") {
                if (value !== '') {
                    this.setState({
                        bankName: value
                    })
                }
                else {
                    this.setState({
                        bankNameError: {
                            content: 'Bank name should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "branchName") {
                if (value !== '') {
                    this.setState({
                        branchName: value
                    })
                }
                else {
                    this.setState({
                        branchNameError: {
                            content: 'Branch Name name should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "accountNumber") {
                if (value !== '') {
                    this.setState({
                        accountNumber: value
                    })
                }
                else {
                    this.setState({
                        accountNumberError: {
                            content: 'Account Number should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "ibanNumber") {
                if (value !== '') {
                    this.setState({
                        ibanNumber: value
                    })
                }
                else {
                    this.setState({
                        ibanNumberError: {
                            content: 'IBAN Number should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "swiftCode") {
                if (value !== '') {
                    this.setState({
                        swiftCode: value
                    })
                }
                else {
                    this.setState({
                        swiftCodeError: {
                            content: 'Swift Code should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "cancelCheck") {
                if (value !== '') {
                    this.setState({
                        cancelCheck: value
                    })
                }
                else {
                    this.setState({
                        cancelCheckError: {
                            content: 'Document should not be empty',
                            pointing: 'below',
                            stepComplete: false
                        }
                    })
                }
            }

            if (name === "beneficiaryName" || name === 'bankName' || name === 'branchName' || name === 'accountNumber'
                || name === 'ibanNumber' || name === 'swiftCode' || name === 'cancelCheck') {
                if (value === '') {
                    this.setState({
                        stepComplete: false
                    })
                }
                else {
                    this.setState({
                        stepComplete: true,
                        formComplete: true
                    })
                }
            }

        })



        // this.setState({
        //     storeNameError: false,
        //     companyNameError: false,
        //     productsYouSellError: false,
        //     addressError: false,
        // })
        // this.setState({

        //     [name]: value
        // }, () => {

        //     if (name == "storeName") {
        //         if (value !== '') {
        //             this.setState({
        //                 storeName: value
        //             })
        //         }
        //         else {
        //             this.setState({
        //                 storeNameError: {
        //                     content: 'Store name should not be empty',
        //                     pointing: 'below',
        //                     stepComplete: false
        //                 }
        //             })
        //         }
        //     }

        //     if (name == "companyName") {
        //         if (value != '') {
        //             this.setState({
        //                 companyName: value
        //             })
        //         }
        //         else {
        //             this.setState({
        //                 companyNameError: {
        //                     content: 'Company name should not be empty',
        //                     pointing: 'below',
        //                     stepComplete: false
        //                 }
        //             })
        //         }
        //     }

        //     if (name == "productsYouSell") {
        //         if (value != '') {
        //             this.setState({
        //                 productsYouSell: value
        //             })
        //         }
        //         else {
        //             this.setState({
        //                 productsYouSellError: {
        //                     content: 'Products name should not be empty',
        //                     pointing: 'below',
        //                     stepComplete: false
        //                 }
        //             })
        //         }
        //     }

        //     if (name == "address") {
        //         if (value != '') {
        //             this.setState({
        //                 address: value
        //             })
        //         }
        //         else {
        //             this.setState({
        //                 addressError: {
        //                     content: 'Address should not be empty',
        //                     pointing: 'below',
        //                     stepComplete: false
        //                 }
        //             })
        //         }
        //     }

        //     if (name == "storeName" || name == 'companyName' || name == 'productsYouSell' || name == 'address') {
        //         if (value == '') {
        //             this.setState({
        //                 stepComplete: false
        //             })
        //         }
        //         else {
        //             this.setState({
        //                 stepComplete: true,
        //             })
        //         }
        //     }

        // })

    }

    onFileSelect = (event) => {

        if (event.target.files && event.target.files[0]) {
            // let reader = new FileReader();
            this.setState({ tradeLicense: event.target.files[0] });
            // debugger
        }

    }

    onFileSelect1 = (event) => {

        if (event.target.files && event.target.files[0]) {
            // let reader = new FileReader();
            this.setState({ nationalId: event.target.files[0] });
        }
    }

    onFileSelect2 = (event) => {

        if (event.target.files && event.target.files[0]) {
            // let reader = new FileReader();
            this.setState({ cancelCheck: event.target.files[0] });

        }
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
        const { showFormError, firstName, lastName, email, phone, storeName, companyName, productsYouSell, address, tradeLicense, nationalId,
            beneficiaryName, bankName, branchName, accountNumber, ibanNumber, swiftCode, cancelCheck,
            firstNameError, lastNameError, emailError, phoneError, storeNameError, companyNameError, productsYouSellError, addressError,
            tradeLicenseError, nationalIdError, beneficiaryNameError, bankNameError, branchNameError, accountNumberError, ibanNumberError, swiftCodeError } = this.state

        const activeIndex = this.state.activeIndex;
        return (
            <div className="vender-page">
                <div className="container-xl">

                    <div className="headings">
                        <p className="start-selling">Start selling your items on Kees.qa</p>
                        <p className="create-store">Create a Store</p>
                    </div>
                    <div className="step-container">
                        <hr className="step-count-line"></hr>

                        <div className="step-count">

                            <div>
                                <div className={activeIndex >= 1 ? "circle circle-bg" : 'circle'}>
                                    <p className="count">01</p>
                                </div>
                                <p className="step-title">User</p>
                            </div>

                            <div>
                                <div className={activeIndex >= 2 ? "circle + circle-bg" : 'circle'}>
                                    <p className="count">02</p>
                                </div>
                                <p className="step-title">Store</p>
                            </div>

                            <div>
                                <div className={activeIndex >= 3 ? "circle + circle-bg" : 'circle'}>
                                    <p className="count">03</p>
                                </div>
                                <p className="step-title">Document</p>
                            </div>

                            <div>
                                <div className={activeIndex >= 4 ? "circle + circle-bg" : 'circle'}>
                                    <p className="count">04</p>
                                </div>
                                <p className="step-title">Bank</p>
                            </div>

                        </div>
                    </div>


                    <Form error={showFormError} onSubmit={this.signup} >

                        {activeIndex === 1 ?
                            <>

                                <div>

                                    <Form.Input
                                        fluid
                                        placeholder='Full Name'
                                        id='form-input-first-name'
                                        required
                                        value={firstName}
                                        error={firstNameError}
                                        name={"firstName"}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        fluid
                                        placeholder='Last Name'
                                        required
                                        value={lastName}
                                        error={lastNameError}
                                        name={"lastName"}
                                        onChange={this.handleChange}
                                    />

                                    <Form.Input
                                        fluid
                                        type="number"
                                        placeholder='Phone'
                                        required
                                        name={"phone"}
                                        value={phone}
                                        error={phoneError}
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

                                    <Message
                                        error
                                        header=''
                                        content={showFormError.content}
                                    />
                                    <Button className="next-btn primary-button" type="submit" onClick={this.step}>NEXT</Button>

                                </div>


                            </> : null
                        }

                        {activeIndex === 2 ?
                            <>

                                <Form.Input
                                    fluid
                                    placeholder='Store Name'
                                    id='form-input-first-name'
                                    required
                                    value={storeName}
                                    error={storeNameError}
                                    name={"storeName"}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    placeholder='Company Name'
                                    required
                                    value={companyName}
                                    error={companyNameError}
                                    name={"companyName"}
                                    onChange={this.handleChange}
                                />

                                <Form.Input
                                    fluid
                                    type="text"
                                    placeholder='Product You Sell'
                                    required
                                    name={"productsYouSell"}
                                    value={productsYouSell}
                                    error={productsYouSellError}
                                    onChange={this.handleChange}
                                />

                                <textarea rows="6" cols="50"
                                    fluid
                                    required
                                    value={address}
                                    error={addressError}
                                    name="address"
                                    placeholder='Enter Your Full Address'
                                    onChange={this.handleChange}
                                />

                                <Message
                                    error
                                    header=''
                                    content={showFormError.content}
                                />
                                <div className="vender-form-buttons">
                                    <button className="back-btn" onClick={() => this.setState({ activeIndex: 1 })}>Back</button>
                                    <Button className="next-btn primary-button" type="submit" onClick={this.step} >NEXT</Button>
                                </div>

                            </> : null
                        }

                        {activeIndex === 3 ?
                            <>
                                <div className="step-form-input" >

                                    <Form.Input
                                        fluid
                                        placeholder='Upload Trade License'
                                        id='form-input-first-name'
                                        // id='border'
                                        // required
                                        // disabled
                                        value={tradeLicense.name}
                                        error={tradeLicenseError}
                                        name={"storeName"}
                                        onChange={this.handleChange}
                                    />
                                    <input id="selectfile" onChange={this.onFileSelect} className="select" type="file" />
                                    <label htmlFor="selectfile" className="browse-btn" >  BROWSE FILES </label>

                                    <Form.Input
                                        fluid
                                        placeholder='Upload National ID (Emirates ID, or Passport copy with VISA)'
                                        // required
                                        // disabled
                                        id='border'
                                        value={nationalId.name}
                                        error={nationalIdError}
                                        name={"companyName"}
                                        onChange={this.handleChange}
                                    />
                                </div>

                                <input id="selectfile1" onChange={this.onFileSelect1} className="select" type="file" />
                                <label htmlFor="selectfile1" className="browse-btn" >  BROWSE FILES </label>

                                <Message
                                    error
                                    header=''
                                    content={showFormError.content}
                                />
                                <div className="vender-form-buttons">
                                    <button className="back-btn" onClick={() => this.setState({ activeIndex: 2 })}>Back</button>


                                    <Button className="next-btn primary-button" type="submit" onClick={this.step} >NEXT</Button>
                                </div>


                            </> : null
                        }

                        {activeIndex === 4 ?
                            <>

                                <Form.Input
                                    fluid
                                    placeholder='Beneficiary Name'
                                    type="text"
                                    id='form-input-first-name'
                                    required
                                    value={beneficiaryName}
                                    error={beneficiaryNameError}
                                    name={"beneficiaryName"}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    placeholder='Bank Name'
                                    type="text"
                                    required
                                    value={bankName}
                                    error={bankNameError}
                                    name={"bankName"}
                                    onChange={this.handleChange}
                                />

                                <Form.Input
                                    fluid
                                    type="text"
                                    placeholder='Branch Name'
                                    required
                                    name={"branchName"}
                                    value={branchName}
                                    error={branchNameError}
                                    onChange={this.handleChange}
                                />

                                <Form.Input
                                    fluid
                                    type="number"
                                    placeholder='Account Number'
                                    required
                                    name={"accountNumber"}
                                    value={accountNumber}
                                    error={accountNumberError}
                                    onChange={this.handleChange}
                                />

                                <Form.Input
                                    fluid
                                    type="number"
                                    placeholder='IBAN Number'
                                    required
                                    name={"ibanNumber"}
                                    value={ibanNumber}
                                    error={ibanNumberError}
                                    onChange={this.handleChange}
                                />

                                <Form.Input
                                    fluid
                                    type="text"
                                    placeholder='Swift Code'
                                    required
                                    name={"swiftCode"}
                                    value={swiftCode}
                                    error={swiftCodeError}
                                    onChange={this.handleChange}
                                />

                                <p className="upload-msg">Upload either certified and stamped document by the bank with having the information mentioned above OR Cancelled Cheque.</p>

                                <input required id="selectfile2" name="cancelCheck" onChange={this.onFileSelect2} className="select" type="file" />
                                <label htmlFor="selectfile2" className="browse-btn" >  BROWSE FILES </label>
                                <span>{cancelCheck.name}</span>


                                <Message
                                    error
                                    header=''
                                    content={showFormError.content}
                                />
                                <div className="vender-form-buttons">
                                    <button className="back-btn" onClick={() => this.setState({ activeIndex: 3 })}>Back</button>

                                    <Button className="next-btn primary-button" type="submit" >COMPLETE</Button>
                                </div>


                            </> : null
                        }

                    </Form>

                    {activeIndex === 5 ?
                        <>
                            <div className="thanku-page">
                                <img src={ThankuImg} alt="" />

                                <div>
                                    <p className="thanku">Thank You!</p>
                                    <p>We have received your store creation request.</p>
                                    <p>Please allow us up to 48 hours to verify your documents and confirm your store creation request.</p>
                                    <p>If you have any concerns regarding the creation of your account please do not hesitate to contact us on seller@kees.qa</p>
                                    <p>Back to <span className="kees-text"><Link to="/">Kees.qa</Link></span></p>
                                </div>
                            </div>

                        </> : null
                    }

                </div>
            </div>
        );
    }
}

export default VenderPage;