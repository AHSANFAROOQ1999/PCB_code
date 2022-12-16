import React from "react";

// import footLogo from '../../../assets/svg/footerLogo.svg'
// import supportLogo from '/assets/svg/supportIcon.svg'
// import fbLogo from '/assets/svg/facebookIcon.svg'
// import instaLogo from '/assets/svg/instaIcon.svg'
// import linkedinIcon from '/assets/svg/linkedinIcon.svg'
// import twitterIcon from '/assets/svg/twitterIcon.svg'
import { Icon } from "semantic-ui-react";
import { validateEmail } from "../../../services/context";
import PCB_Logo from "../../../assets/pcb-assets/pcblogo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";

class Footer extends React.Component {
  state = {
    email: "",
    emailError: false,
    emailSuccess: false,
    footer: null,
  };

  newsletterSubscribe = () => {
    let ifEmail = validateEmail(this.state.email);
    if (ifEmail) {
      this.setState({ emailError: false });
      let body = {
        email: this.state.email,
      };
      axios
        .post(
          process.env.REACT_APP_BACKEND_HOST + "/storefront/newsletter",
          body
        )
        .then((response) => {
          this.setState({ emailSuccess: true });
          setTimeout(() => {
            this.setState({ emailSuccess: false });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({ emailError: true });
      setTimeout(() => {
        this.setState({ emailError: false });
      }, 3000);
    }
  };
  componentDidMount() {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/storefront/footer")
      .then((res) => {
        // const footer = res.data;

        this.setState({ footer: res.data.footer });
        // console.log("footer",res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  goToTop = () => {
    document.querySelector('body').scrollTo(0, 0)
  };
  render() {
    const footer = this.state.footer;

    return (
      <div
        className="footer-wrapper"
        style={{ backgroundColor: footer ? footer.background_color : null }}
      >
        {isMobileOnly ? (
          <>
            <div className="socialmedia-links">
              <ul>
                <li>
                  <a
                    href="https://www.facebook.com/PakistanCricketBoard/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="facebook f" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/therealpcb/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="instagram" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCiWrjBhlICf_L_RK5y6Vrxw"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="youtube" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/TheRealPCB" target="_blank" rel="noreferrer">
                    
                    <Icon name="twitter" />
                  </a>
                </li>
              </ul>
            </div>

          </>
        ) : (
          <div className="footer-top">
            <div className="container-xl">
              <div className="footer-bottom-inner">
                <div className="footer_navigation">
                  <div>
                    <ul>
                      <h4 className="social-heading">Help</h4>
                      {footer?.navigations[0]?.menu.map((item, key) => (
                        <li key={key}>
                          <Link to={item.link}>{item.label}</Link>
                        </li>
                      ))}

                      {/* <li>Contact us</li>
                    <li>Privacy Policy</li>
                    <li>Shipping Policy</li>
                    <li>Return Policy</li>
                    <li>Terms and Conditions</li> */}
                    </ul>
                  </div>

                  <div className="socialmedia_links">
                    <h4 className="social-heading">Follow us on</h4>
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/PakistanCricketBoard/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon name="facebook f" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/therealpcb/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon name="instagram" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/channel/UCiWrjBhlICf_L_RK5y6Vrxw"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon name="youtube" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://twitter.com/TheRealPCB"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon name="twitter" />
                        </a>
                      </li>
                    </ul>
                    <div className="contactfooter" >
                      <div dangerouslySetInnerHTML={{ __html: footer ? footer.contact_information : null }} ></div>
                      <p className='k-row1'>{footer ? footer.phone_number : null}</p>
                    </div>
                    <div className="Footer-logos-pcb">
                      <Link to="/home">
                        <img
                          src={PCB_Logo}
                          alt="Logo"
                          onClick={this.goToTop}
                          className="footer-pcb"
                        />
                      </Link>
                    </div>
                    {/* <div>
                    <a href="https://www.facebook.com/kees.qa">
                      <Icon name="facebook f" />
                    </a>
                  </div>

                  
                  <div>
                    <a href="https://www.instagram.com/kees.qa">
                      <Icon name="instagram" />
                    </a>
                  </div>
                  <div>
                    <a href="/">
                      <Icon name="twitter" />
                    </a>
                  </div>
                  <div>
                    <a href="https://www.linkedin.com/company/kees-qa">
                      <Icon name="linkedin alternate" />
                    </a>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="footer-bottom">
          <div className="container-xl">
            <div className="footer-bottom-inner">
              <div className="copyright-wrapper">
                <div className="Footer-logos">
                  <Link to="/home">
                    <img
                      src={PCB_Logo}
                      alt="Logo"
                      onClick={this.goToTop}
                      className="Footer-logo1"
                    />
                  </Link>

                </div>
                <a href="https://comverseglobal.com" target="_blank" rel="noreferrer"><p> Powered by COMVERSE </p></a>
                {/* <p> <a href='https://comverseglobal.com/' target="_blank"> Powered by Comverse </a></p> */}
              </div>


              <div className="socialmedia-links">
                {/* <a href="https://www.facebook.com/kees.qa">
                  <Icon name="facebook f" />
                </a>
                <a href="https://www.instagram.com/kees.qa">
                  <Icon name="instagram" />
                </a> */}
                {/* <a href="/">
                  <Icon name="twitter" />
                </a> */}
                {/* <a href="/">
                </a> */}
                {/* <a href="https://www.linkedin.com/company/kees-qa">
                  <Icon name="linkedin alternate" />
                </a> */}
              </div>
            </div>
          </div>

        </div>
        <div className="footer-contects">
          <div dangerouslySetInnerHTML={{ __html: footer ? footer.contact_information.split('<p>')[2] : null }} ></div>

          <p className='k-row1'>{footer ? footer.phone_number : null}</p>


        </div>
      </div>
    );
  }
}

export default Footer;
