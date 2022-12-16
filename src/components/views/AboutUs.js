import React, { Component } from 'react'
import aboutus from '../../assets/img/about us (Desktop).png';
import vision from '../../assets/img/Vision _desktop.png';
import mission from '../../assets/img/Mission Desktop.png';
import aboutusMobile from '../../assets/img/about us (mobile).png';
import visionMobile from '../../assets/img/Vision (mobile).png';
import missionMobile from '../../assets/img/Mission (mobile).png';
import {
    BrowserRouter as Link
} from "react-router-dom";


export default class AboutUs extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);

    }

    render() {
        return (

            <div className="about-us">
                <div className="about-us-section">

                    <div className="heading">
                        <h1> About us </h1>
                    </div>
                    {/* <div class=" ABOUT US para"> */}
                    <div className="content">
                        <h3 className="question" ><span><Link to='/'>Kees.qa</Link></span> Qatar First Local Online Marketplace (Anything else?)</h3>
                        <p>Kees is here to please! Kees is a Qatar based e-commerce platform aiming to become
                            market giant in the region where customers will opt to buy products confidently and be the
                            first-choice marketplace where people can discover anything they want to buy online and
                            get it delivered to their doorsteps within no time. <Link to='/'>Kees.qa</Link> is the leading online shopping
                            Electronics, Mobiles, Perfumes, fashion, Kids Toys, Accessories, and many more on the
                            platform in Qatar.Developed in 2020 October,<b>Deals with Variety of categories such as
                                website more than 30,000 Brands are available to serve the customer’s needs,</b>we offer:</p>
                        <ul>
                            <br></br><li>Fastest Delivery</li>
                            <br></br><li>Owned Delivery Network</li>
                            <br></br><li>Easy Returns</li>
                            <br></br><li>Warranty Products</li>
                            <br></br><li>24 x 7 English &amp; Arabic Customer Support</li>
                            <br></br><li>Millions of Products</li>
                            <br></br><li>Attractive Prices</li>
                        </ul>

                    </div>
                </div>
                <div className="about-us-sec-one">
                    <div>
                        <img className="vision-mobile" src={visionMobile} alt=''></img>
                        <img className="vision-desktop" src={vision} alt='' />
                    </div>
                    <div className="content-of-sec-one content-section">
                        <div className="content">
                            <h1>OUR VISION</h1>
                            <p className="comtent-of-sec-one">Our vision is to become a globally trusted e-commerce platform where customer needs are
                                fulfilled.</p>
                        </div>
                    </div>

                </div>
                <div className="about-us-sec-two ">
                    <div className="content-of-sec-two sec-two  content-section">
                        <div className="content ">
                            <h1>OUR MISSION</h1>
                            <ol>
                                <br></br><li>To provide best Online Shopping Experience</li>
                                <br></br><li>High Quality Products</li>
                                <br></br><li>Bring innovation to the e-commerce experience.</li>
                                <br></br><li>Differentiate prices from market competition with the best possible offerings.</li>
                                <br></br><li>Clear visibility of the Order Tracking.</li>
                            </ol>
                        </div>
                    </div>
                    <div>
                        <img className="mission-mobile" src={missionMobile} alt=''></img>
                        <img className="mission-desktop" src={mission} alt=''></img>
                    </div>
                </div>
                <div className="about-us-sec-three">
                    <div>
                        <img className="aboutus-mobile" src={aboutusMobile} alt=''></img>
                        <img className="aboutus-desktop" src={aboutus} alt=''></img>
                    </div>

                    <div className="content-of-sec-three content-section">
                        <div className="content">

                            <h1>OUR VALUE</h1>
                            <ol>
                                <br></br><li>Teamwork</li>
                                <br></br><li>Think Big</li>
                                <br></br><li>Best Innovation</li>

                            </ol>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}
