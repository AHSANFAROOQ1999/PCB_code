import React from 'react';
import staticBanner from '../../../../assets/img/staticBanner.png';
import staticBannerMobile from '../../../../assets/img/staticBannerMobile.png';
import { isMobileOnly } from "react-device-detect";
import { Link } from 'react-router-dom';

class StaticBanner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }

  }

  render() {
    const { data } = this.state
    return (
      <div className="homepage-static-banner single-banner">
        {
          data.desktop_img ?
            <Link to={data.link}>
              {
                isMobileOnly ?
                  <img src={data.mobile_img ? data.mobile_img : staticBannerMobile} alt="static banner" className="mobile-banner" /> :
                  <img src={data.desktop_img ? data.desktop_img : staticBanner} alt="static banner" className="desktop-banner" />
              }
            </Link>
            : null
        }
      </div>
    )
  }
}

export default StaticBanner;