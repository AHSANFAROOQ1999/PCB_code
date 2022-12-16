import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import phoneIcon from '../../../../assets/svg/phoneIcon.svg';
// import arrowDown from './assets/svg/arrowDown.svg';
// import flag from './assets/img/flag.png';
import { isMobile } from "react-device-detect";
// import axios from 'axios';

class Announcement extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected_lang: 'en',
      langText: "English",
      header: props.announcement
    }
  }

  // componentDidMount() {
  //   this.checkLanguage()
  // }

  // Header integration
  componentDidMount() {
    this.checkLanguage()
    // axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header').then((res => {
    //   // const footer = res.data;

    //   this.setState({ header: res.data.header });
    //   // console.log("header", res.data);
    // }))
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }


  checkLanguage = () => {
    let checkingLangDropdown = setInterval(() => {
      // console.log('check dropdown')
      let seletedValue = document.querySelector('#google_translate_element select') ? document.querySelector('#google_translate_element select').value ? document.querySelector('#google_translate_element select').value : 'en' : 'en'
      if (document.querySelector('#google_translate_element select')) {
        if (document.querySelector('#google_translate_element select').value) {
          this.setState({ selected_lang: seletedValue })

          if (seletedValue === 'ar') {
            document.querySelector('html').setAttribute('dir', 'rtl')
          }
          else {
            document.querySelector('html').setAttribute('dir', 'ltr')
          }
          document.querySelector('body').classList.remove('lang-ar')
          document.querySelector('body').classList.add('lang-' + seletedValue)
          // console.log('check dropdown finish')
          clearInterval(checkingLangDropdown)
        }

      }
    }, 1000)
    setTimeout(() => {
      clearInterval(checkingLangDropdown)
    }, 6000);
  }

  langName = (lang) => {

    if (lang.value === this.state.selected_lang) {
      this.setState({ langText: lang.text })
    }
  }

  changeLanguage = (e, target) => {

    const countryOptions = [
      { key: 'en', value: 'en', text: 'English' },
      { key: 'ar', value: 'ar', text: 'Arabic' }
    ]

    this.setState({ selected_lang: target.value }, () => countryOptions.filter(this.langName))

    let langDropdown = document.querySelector('#google_translate_element select')
    // console.log(target.value)
    if (langDropdown.value !== target.value) {
      langDropdown.value = target.value
      var event = new Event('change')
      langDropdown.dispatchEvent(event)
      langDropdown.dispatchEvent(event)

      if (target.value === 'ar') {
        document.querySelector('html').setAttribute('dir', 'rtl')
      }
      else {
        document.querySelector('html').setAttribute('dir', 'ltr')
      }
      document.querySelector('body').classList.remove('lang-ar')
      document.querySelector('body').classList.add('lang-' + target.value)
    }
  }
  render() {

    const header = this.state.header;

    const countryOptions = [
      { key: 'en', value: 'en', text: 'English' },
      { key: 'ar', value: 'ar', text: 'Arabic' }
    ]
    return (
      <>
        {header?.announcement_bar.enable ? <>
          <div style={{ backgroundColor: header ? header.announcement_bar.background_color : null }} className={isMobile ? "accouncement-bar announcement-mobile " : "accouncement-bar announcement-desktop "} >
            <div className="container-xl">
              <div className="k-row">
                {
                  isMobile ?
                    null
                    :
                    <div className="announcement-contact flex--1">
                      <div className="k-row">
                        {
                          header?.announcement_bar.phone_number !== "" ?
                            <img src={phoneIcon} alt="React Logo" />
                            : null
                        }
                        <p className='k-row2'>{header ? header.announcement_bar.phone_number : null}</p>
                      </div>
                    </div>
                }

                {
                  isMobile ?
                    null
                    :
                    <div className="lang-picker-wrap flex--1">
                      {/* <div className="k-row lang-picker">
                  <img src={flag} alt="flag icon" />
                  <img src={arrowDown} alt="arrow icon" />
                </div> */}
                      <div className="k-row lang-picker">
                        {!!header?.announcement_bar.show_language ?
                          <Dropdown text={this.state.langText} options={countryOptions} onChange={this.changeLanguage} value={this.state.selected_lang} />
                          : null
                        }
                      </div>
                    </div>
                }
              </div>
            </div>
            <div className="announcement-text">
              <p>{header ? header.announcement_bar.announcement_text : null}</p>
            </div>
          </div>

        </>
          : null}
      </>
    );
  }
}

export default Announcement;
