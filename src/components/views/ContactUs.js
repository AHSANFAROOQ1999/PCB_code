import React from "react";
import { Button, Form, Message } from "semantic-ui-react";
// import callContact from "../../assets/img/callContact.png";
// import emailContact from "../../assets/img/emailContact.png";
import { validateEmail } from "../../services/context";
import Axios from "axios";

class ContactUs extends React.Component {
  state = {
    name: "",
    email: "",
    message: "",
    emailError: false,
    formSuccess: false,
    formLoading: false,
  };

  componentDidMount() {
    document.querySelector("body").scrollTo(0, 0);
    window.scrollTo(0, 0);
  }

  submitContactForm = () => {
    let ifEmail = validateEmail(this.state.email);

    if (ifEmail) {
      this.setState({ emailError: false, formLoading: true });

      let body = {
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      };

      Axios.post(
        process.env.REACT_APP_BACKEND_HOST + "/storefront/contact-us",
        body
      )
        .then((response) => {
          this.setState({
            formSuccess: true,
            formLoading: false,
          });
          setTimeout(() => {
            this.setState({ formSuccess: false });
          }, 3000);
        })
        .catch((err) => {
          this.setState({
            formLoading: false,
          });
          console.log(err);
        });
    } else {
      this.setState({ emailError: true });
      setTimeout(() => {
        this.setState({ emailError: false });
      }, 3000);
    }
  };

  render() {
    return (
      <div className="contact-us-page">
        <div className="inner-wrapper">
          <div className="container-md">
            <div>
              {/* <iframe src="https://www.google.com/maps/d/embed?mid=1B15Lgy25kfFKPbgAJN4nQpMr7Ns" width="100%" height="320"></iframe> */}
              {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.6264984141403!2d51.52406131501192!3d25.316749983840705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE5JzAwLjMiTiA1McKwMzEnMzQuNSJF!5e0!3m2!1sen!2s!4v1631519259756!5m2!1sen!2s" width="100%" height="320" allowfullscreen="" loading="lazy"></iframe> */}
            </div>
            <div className="contact-form-detail">
              <div className="contact-form-wrapper">
                <h1 className="heading">SEND YOUR QUERIES!</h1>
                <p>
                  Your email address not be published. Required fields are
                  marked by "*"
                </p>
                <Form
                  loading={this.state.formLoading}
                  success={this.state.formSuccess}
                  onSubmit={this.submitContactForm}
                  error={this.state.emailError}
                >
                  <Form.Group unstackable widths={1}>
                    <Form.Input
                      label="Name"
                      required
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                    <Form.Input
                      label="Your Email"
                      required
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group widths={1}>
                    <Form.TextArea
                      label="Your Message"
                      required
                      style={{ minHeight: 150 }}
                    />
                  </Form.Group>
                  <Message error content={"Email formate incorrect"} />
                  <Message
                    success
                    content={
                      "We have received you email. We Will contact back shortly."
                    }
                  />
                  <Button type="submit" className="primary-button">
                    SEND MESSAGE
                  </Button>
                </Form>
              </div>
              <div>
                <h1>ADDRESS:</h1>
                <p className="para">
                  Pakistan Cricket Board (PCB) Gaddafi Stadium, Ferozepur Road,
                  Lahore, Pakistan.
                </p>

                <div className="k-row contact-info-contec-us">
                  <div className="contect-icons">
                    {/* <img src={callContact} alt="" /> */}
                    <i class="phone icon"></i>
                  </div>
                  <div>
                    <p>+923000340045</p>
                  </div>
                </div>
                <div className="k-row contact-info-contec-us">
                  <div className="contect-icons">
                    {/* <img src={emailContact} alt="" /> */}
                    <i class="envelope open outline icon"></i>
                  </div>
                  <div>
                    <p>merchandising@pcb.com.pk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactUs;
