import React from 'react'
import { isMobile } from "react-device-detect";
import { Link } from 'react-router-dom';
import Banner1 from '../../../../assets/img/twoSectionBanner1.png'
import Banner2 from '../../../../assets/img/twoSectionBanner2.png'
import BannerMobile1 from '../../../../assets/img/twoSectionBannerMobile1.png'
import BannerMobile2 from '../../../../assets/img/twoSectionBannerMobile2.png'

class TwoBannerSection extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  render() {

    const { data } = this.state

    return (
      <div className="home-two-banner-section">
        <div className="container-xl">
          <div className="two-banner-inner">
            <div className="home-two-banner left-section">
              <Link to={data.first_banner.link}>
                {
                  isMobile ?
                    <img src={data.first_banner ? data.first_banner.mobile_img : BannerMobile1} alt="" />
                    :
                    <img src={data.first_banner ? data.first_banner.desktop_img : Banner1} alt="" />
                }
              </Link>
            </div>
            <div className="home-two-banner right-section">
              <Link to={data.second_banner.link}>
                {
                  isMobile ?
                    <img src={data.second_banner ? data.second_banner.mobile_img : BannerMobile2} alt="" />
                    :
                    <img src={data.second_banner ? data.second_banner.desktop_img : Banner2} alt="" />
                }
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default TwoBannerSection;