import React from 'react'
import badge1 from '../../../../assets/svg/badge1.svg';
// import badge2 from '../../../../assets/svg/badge2.svg';
// import badge3 from '../../../../assets/svg/badge3.svg';
// import badge4 from '../../../../assets/svg/badge4.svg';
// import badge5 from '../../../../assets/svg/badge5.svg';
// import badge6 from '../../../../assets/svg/badge6.svg';

class BadgesSection extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  render() {

    const { data } = this.state

    return (
      <div className="homepage-badge-section">
        <div className="container-xl">
          <div className="badges-section">
            {
              data.features ?
                data.features.map((badge, index) => {
                  return <div className="badge" key={index}>
                    <div className="badge-icon">
                      <img src={badge.icon_img ? badge.icon_img : badge1} alt="badge icon" />
                    </div>
                    <div className="badge-details">
                      <p className="para-dark">{badge.title}</p>
                      {/* <p className="para-lite">{ badge.small_text }</p> */}
                    </div>
                  </div>
                })
                : null
            }

            {/* <div className="badge">
              <div className="badge-icon">
                <img src={badge2} alt="badge icon" />
              </div>
              <div className="badge-details">
                <p className="para-dark">Fast Delivery</p>
                <p className="para-lite">Lorem ipsum dollar sit imet</p>
              </div>
            </div>
            <div className="badge">
              <div className="badge-icon">
                <img src={badge3} alt="badge icon" />
              </div>
              <div className="badge-details">
                <p className="para-dark">Fast Delivery</p>
                <p className="para-lite">Lorem ipsum dollar sit imet</p>
              </div>
            </div>

            <div className="badge">
              <div className="badge-icon">
                <img src={badge4} alt="badge icon" />
              </div>
              <div className="badge-details">
                <p className="para-dark">Fast Delivery</p>
                <p className="para-lite">Lorem ipsum dollar sit imet</p>
              </div>
            </div>
            <div className="badge">
              <div className="badge-icon">
                <img src={badge5} alt="badge icon" />
              </div>
              <div className="badge-details">
                <p className="para-dark">Fast Delivery</p>
                <p className="para-lite">Lorem ipsum dollar sit imet</p>
              </div>
            </div>
            <div className="badge">
              <div className="badge-icon">
                <img src={badge6} alt="badge icon" />
              </div>
              <div className="badge-details">
                <p className="para-dark">Fast Delivery</p>
                <p className="para-lite">Lorem ipsum dollar sit imet</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default BadgesSection;