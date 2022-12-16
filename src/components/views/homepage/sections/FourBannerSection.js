import React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import Banner1 from "../../../../assets/pcb-assets/asset_7.jpeg";
import Banner2 from "../../../../assets/pcb-assets/asset_8.jpeg";
import Banner3 from "../../../../assets/pcb-assets/asset_9.jpeg";
import Banner4 from "../../../../assets/pcb-assets/asset_10.png";

class FourBannerSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,

      // dummyData: [
      //   {
      //     "type": "four_banners",
      //     "title": "Four banners section",
      //     "first_banner": {
      //       "desktop_img": Banner1,
      //       "mobile_img": Banner1,
      //       "link": "/collection/1992",
      //       "first_banner_alt_text": "",
      //       "banner_alt_text": "1992"
      //     },
      //     "second_banner": {
      //       "desktop_img": Banner2,
      //       "mobile_img": Banner2,
      //       "link": "/collection/T20-",
      //       "text_alt": "",
      //       "banner_alt_text": "T20 World cup"
      //     },
      //     "third_banner": {
      //       "desktop_img": Banner3,
      //       "mobile_img": Banner3,
      //       "link": "/collection/TEST",
      //       "banner_alt_text": "TEST"
      //     },
      //     "fourth_banner": {
      //       "desktop_img": Banner4,
      //       "desktop_img": Banner4,
      //       "link": "/collection/ODI",
      //       "banner_alt_text": "ODI"
      //     }
      //   }

      // ]
    };
  }

  render() {
    const { data } = this.state

    return (
      <div className="home-four-banner-section">
        <div className="collection-slider-wrapper">
          <div className="container-xl">
            <div className="four-banner-inner">
              <div className="home-four-banner right-section">
                <Link to={data?.first_banner?.link}>
                  {isMobile ? (
                    <img
                      src={
                        data?.first_banner
                          ? data?.first_banner?.mobile_img
                          : Banner1
                      }
                      alt={data?.first_banner?.banner_alt_text}
                    />
                  ) : (
                    <img
                      src={
                        data?.first_banner
                          ? data?.first_banner?.desktop_img
                          : Banner1
                      }
                      alt={data?.first_banner?.banner_alt_text}
                    />
                  )}
                </Link>
              </div>
              <div className="home-four-banner right-section">
                <Link to={data?.second_banner?.link}>
                  {isMobile ? (
                    <img
                      src={
                        data?.second_banner
                          ? data?.second_banner?.mobile_img
                          : Banner2
                      }
                      alt={data?.second_banner?.banner_alt_text}
                    />
                  ) : (
                    <img
                      src={
                        data?.second_banner
                          ? data?.second_banner?.desktop_img
                          : Banner2
                      }
                      alt={data?.second_banner?.banner_alt_text}
                    />
                  )}
                </Link>
              </div>
              <div className="home-four-banner right-section">
                <Link to={data?.third_banner?.link}>
                  {isMobile ? (
                    <img
                      src={
                        data?.third_banner
                          ? data?.third_banner.mobile_img
                          : Banner3
                      }
                      alt={data?.third_banner?.banner_alt_text}
                    />
                  ) : (
                    <img
                      src={
                        data?.third_banner
                          ? data?.third_banner?.desktop_img
                          : Banner3
                      }
                      alt={data?.third_banner?.banner_alt_text}
                    />
                  )}
                </Link>
              </div>
              <div className="home-four-banner right-section">
                <Link to={data?.fourth_banner?.link}>
                  {isMobile ? (
                    <img
                      src={
                        data?.fourth_banner
                          ? data?.fourth_banner?.mobile_img
                          : Banner4
                      }
                      alt={data?.fourth_banner?.banner_alt_text}
                    />
                  ) : (
                    <img
                      src={
                        data?.fourth_banner
                          ? data?.fourth_banner?.desktop_img
                          : Banner4
                      }
                      alt={data?.fourth_banner?.banner_alt_text}
                    />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FourBannerSection;
