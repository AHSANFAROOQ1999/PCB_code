import React, { Component } from 'react'
import Axios from 'axios';
// import { keesLogoHeader } from '../../../services/context'
// import KeesLogoMobile from '../assets/img/KEES_New-Logo.png';
// import KeesLogo from '../../../assets/img/keesLogo.png';
import PCBLogo from '../../../assets/pcb-assets/pcblogo.png'
import { Link } from 'react-router-dom';
import SearchSuggestions from './sections/SearchSuggestion';
import { Icon } from 'semantic-ui-react'
import { clearCart } from '../../../redux/slices/cartSlice';
import { changeCountry, changeCountryCode, changeCurrency } from '../../../redux/slices/multiLocationSlice';
import { connect } from 'react-redux';
// import {countryOptions,checkLanguage,changeLanguage } from '../../../services/context'

export class MobileHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected_lang: 'en',
            langText: 'English',
            loading: true,

            header: [
                {
                    "0": "www.google.com",
                    "1": "Click here and enjoy searching",
                    "2": "17"
                },
            ]
        }
    }


    // componentDidMount() {
    //     this.checkLanguage()
    // }
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
        // debugger
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
        // this.setState({ selected_lang: target.value })
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

    state = {
        isSidebarOpen: false,

        isCateMenuOpen: false,
        data: {},
        isSearchPopupOpen: false
    }

    componentDidMount() {
        this.checkLanguage()
        // fetch categories
        this.updateCart()
        Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header')
            .then((res) => {
                // console.log('Response:', res.data)
                this.setState({
                    header: res.data.header,

                    loading: false
                })
            })
    }

    updateCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        // let cartTotal = localStorage.getItem('cartTotal')
        let totalCount = 0;
        let totalprice = 0;

        if (cart) {
            for (let i = 0; i < cart.length; i++) {
                const lineitem = cart[i];

                totalCount += parseInt(lineitem.detail.quantity);
                totalprice += lineitem.detail.variantPrice.original_price * lineitem.detail.quantity;
            }
            this.setState({ totalProducts: totalCount })
        }

    }


    openSidebar = () => {

        const el = document.querySelector("body");
        el.style.overflow = 'hidden';

        this.setState({ isSidebarOpen: true })

    }

    closeSidebar = () => {
        const el = document.querySelector("body");
        el.style.overflow = 'visible';

        this.setState({ isSidebarOpen: false })
    }

    openCateMenu = () => {
        this.setState({ isCateMenuOpen: true })
    }

    closeCateMenu = () => {
        this.setState({ isCateMenuOpen: false })
    }

    showSearchPopup = () => {
        this.setState({ isSearchPopupOpen: true })
    }

    hideSearchPopup = () => {
        this.setState({ isSearchPopupOpen: false })
    }


    showLayer = (e) => {
        // let targetEl = e.target
        // console.log(e);
        let targetEle
        if (e.target.tagName === "BUTTON") {
            // console.log(e.target.tagName)
            targetEle = e.target.nextElementSibling
        }
        else {
            // console.log(e.target.tagName)
            targetEle = e.target.closest('button').nextElementSibling

        }
        // console.log(targetEl)

        // console.log(targetEle)
        targetEle.classList.add('open-layer')

    }

    hideLayer = (e) => {
        let targetEle
        if (e.target.tagName === "BUTTON") {
            // console.log(e.target.tagName)
            targetEle = e.target.closest('.mobile-cate-child-wrap')
        }
        else {
            // console.log(e.target.tagName)
            targetEle = e.target.closest('.mobile-cate-child-wrap')

        }
        // console.log(targetEl)

        // console.log(targetEle)
        targetEle.classList.remove('open-layer')
    }

    showChildnav = (e) => {
        // console.log(e);
        let targetEle
        if (e.target.tagName === "BUTTON") {
            // console.log(e.target.tagName)
            targetEle = e.target.nextElementSibling
        }
        else {
            // console.log(e.target.tagName)
            targetEle = e.target.closest('button').nextElementSibling
        }
        // console.log(targetEle)
        targetEle.classList.add('show-nav')
    }

    hideChildnav = (e) => {
        let targetElement
        // console.log(targetElement);
        if (e.target.tagName === "BUTTON") {

            targetElement = e.target.closest('.mobile-nav')
        }
        else {

            targetElement = e.target.closest('.mobile-nav')
        }

        targetElement.classList.remove('show-nav')
    }

    redirect = () => {
        // debugger
        console.log(document.getElementById("country").value);
        let county = document.getElementById("country").value;

        if (county === 'Pakistan') {
            // debugger
            this.props?.dispatch(changeCountry("Pakistan"));
            this.props?.dispatch(changeCountryCode("PK"));
            this.props?.dispatch(changeCurrency("PKR"));
            this.props?.dispatch(clearCart());
        }
        else {
            // debugger
            this.props?.dispatch(changeCountry("United States of America"));
            this.props?.dispatch(changeCountryCode("US"));
            this.props?.dispatch(changeCurrency("USD"));
            this.props?.dispatch(clearCart());
        }
    }


    render() {
        const { loading } = this.state;
        const header = this.state.header;

        // const countryOptions = [

        //     { key: 'us', value: 'en', text: 'English' },
        //     { key: 'qa', value: 'ar', text: 'Arabic' },
        // ]


        return (
            <div className="mobile-header-wrap">
                {/* <div className="mobile-announcement-bar">
                    <div className="container-xl">

                    </div>
                </div> */}
                <div className="mobile-menu-bar">
                    <div className="logo">
                        {/* <a href="/"><img src={KeesLogoMobile} alt="Kees Logo" /></a> */}
                        <Link to='/home'>
                            <img src={PCBLogo} alt="PCB Logo" />
                            {/* {keesLogoHeader} */}
                        </Link>
                    </div>

                    <div className="menu-actions">
                        <button className="mobile-menu-icons mobile-search-icon" onClick={this.showSearchPopup}>
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8.31096" cy="8.13234" r="7.36379" stroke="#2E2E2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="14.5236" y1="13.6543" x2="17.7903" y2="16.921" stroke="#2E2E2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <div className={"mobile-search-overlay" + (this.state.isSearchPopupOpen ? ' show' : ' hide')} onClick={this.hideSearchPopup}></div>
                        <div className={"mobile-search-popup" + (this.state.isSearchPopupOpen ? ' show' : ' hide')}>
                            <div className="mobile-search-field">
                                <SearchSuggestions hideSearch={this.hideSearchPopup} />
                            </div>
                        </div>

                        <Link to="/wishlist">
                            <p style={{ margnLeft: "10px" }}> <Icon name='heart outline' size='large' /></p>
                        </Link>

                        <Link to="/cart" className="mobile-menu-icons mobile-cart-icon">
                            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9798 18.6356L15.5748 5.25557C15.5453 4.97547 15.3092 4.76278 15.0275 4.76278H12.3867V4.16068C12.3867 2.28387 10.8597 0.756836 8.98286 0.756836C7.1059 0.756836 5.57887 2.28387 5.57887 4.16068V4.76278H2.93804C2.65639 4.76278 2.42029 4.97547 2.39081 5.25557L0.985775 18.6356C0.969556 18.7906 1.01991 18.9453 1.12414 19.0612C1.2285 19.177 1.37716 19.2432 1.53301 19.2432H16.4324C16.5884 19.2432 16.7371 19.177 16.8413 19.0612C16.9458 18.9453 16.996 18.7906 16.9798 18.6356ZM6.67926 4.16068C6.67926 2.89062 7.71265 1.85723 8.98286 1.85723C10.2529 1.85723 11.2863 2.89062 11.2863 4.16068V4.76278H6.67926V4.16068ZM2.14399 18.1428L3.43352 5.86317H5.57887V7.07569C5.57887 7.37949 5.82526 7.62588 6.12906 7.62588C6.43286 7.62588 6.67926 7.37949 6.67926 7.07569V5.86317H11.2863V7.07569C11.2863 7.37949 11.5327 7.62588 11.8365 7.62588C12.1403 7.62588 12.3867 7.37949 12.3867 7.07569V5.86317H14.5321L15.8216 18.1428H2.14399Z" fill="#2E2E2D" />
                            </svg>
                            <span className="mobile-cart-counter cart-count">{this.state.totalProducts}</span>
                        </Link>
                        {/* <button >
                            
                        </button> */}

                        <button className="mobile-menu-icons mobile-sidemenu-icon" onClick={this.openSidebar}>
                            <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="1.67999" y1="1.03979" x2="19.75" y2="1.03979" stroke="#2E2E2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="1.67999" y1="8.24976" x2="19.75" y2="8.24976" stroke="#2E2E2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="1.67999" y1="15.4597" x2="19.75" y2="15.4597" stroke="#2E2E2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* ///////////////////   Side Bar Section   ////////////////// */}

                <div className={"sidebar-overlay " + (this.state.isSidebarOpen ? 'sidebar-open' : '')} onClick={this.closeSidebar}></div>
                <div className={"mobile-nav-bar " + (this.state.isSidebarOpen ? 'sidebar-open' : '')}>
                    <div className="mobile-sidebar-header">
                        <div className="mobile-sidebar-logo">
                            <img src={PCBLogo} alt="PCB Logo" className='navbarlogo' />
                        </div>
                        <button className="close-sidebar" onClick={this.closeSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                        </button>
                    </div>

                    {
                        header.navigation_bar?.show_category_structure ?

                            <div className="mobile-category-wrap">
                                <button className="mobile-category-btn" onClick={this.openCateMenu}>
                                    <p>
                                        <svg width="15" height="11" viewBox="0 0 15 11" fill="#none" xmlns="http://www.w3.org/2000/svg" >
                                            <rect x="5.46387" y="0.5" width="9.14467" height="2" fill="#fffff" />
                                            <rect y="0.5" width="3.16325" height="2" fill="#fffff" />
                                            <rect x="5.46387" y="4.49854" width="9.14467" height="2" fill="#fffff" />
                                            <rect y="4.49854" width="3.16325" height="2" fill="#fffff" />
                                            <rect x="5.46387" y="8.49707" width="9.14467" height="2" fill="#fffff" />
                                            <rect y="8.49707" width="3.16325" height="2" fill="#fffff" />
                                        </svg>
                                        <span>All CATEGORIES</span>
                                    </p>
                                    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.776855 9.49805L4.77686 5.49805L0.776855 1.49805" stroke="#2E2E2D" fill="#ffff" stroke-width="1.5" />
                                    </svg>
                                </button>
                                <div className="mobile-category-linklist">
                                    <div className={"mobile-cate-child-wrap mobile-cat-menu-child " + (this.state.isCateMenuOpen ? 'open-layer' : '')}>
                                        <div className="mobile-cat-layer-header">
                                            <button className="menu-cate-back-btn" onClick={this.closeCateMenu}>
                                                <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659727 4.53553 0.464465C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64644ZM20 3.5L1 3.5L1 4.5L20 4.5L20 3.5Z" fill="#2E2E2D" />
                                                </svg>
                                            </button>

                                        </div>
                                        <ul>
                                            {

                                                (loading) && header.length ? null :
                                                    header.navigation_bar.category_structure.map((item) => (
                                                        <li key={item.id + '--' + item.handle} >
                                                            <Link to={'/collection/' + item.handle} onClick={this.closeSidebar}>{item.name}</Link>
                                                            {
                                                                item.sub_category.length ?
                                                                    <button className="menu-cate-next-btn" onClick={this.showLayer}>
                                                                        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M0.776855 9.49805L4.77686 5.49805L0.776855 1.49805" stroke="#2E2E2D" stroke-width="1.5" />
                                                                        </svg>
                                                                    </button>
                                                                    : ''
                                                            }
                                                            {
                                                                item.sub_category.length ?
                                                                    <div className="mobile-cate-child-wrap mobile-cat-menu-subChild">
                                                                        <div className="mobile-cat-layer-header">
                                                                            <button className="menu-cate-back-btn" onClick={this.hideLayer}>
                                                                                <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659727 4.53553 0.464465C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64644ZM20 3.5L1 3.5L1 4.5L20 4.5L20 3.5Z" fill="#2E2E2D" />
                                                                                </svg>
                                                                            </button>
                                                                            <p>{item.name}</p>
                                                                        </div>
                                                                        <ul>
                                                                            {
                                                                                item.sub_category.map((subItem) => (
                                                                                    <li className={subItem.handle} key={subItem.id + '--' + subItem.handle}>
                                                                                        <Link to={'/collection/' + subItem.handle} onClick={this.closeSidebar}>{subItem.name}</Link>
                                                                                        {
                                                                                            subItem.super_sub_category.length ?
                                                                                                <button className="menu-cate-next-btn" onClick={this.showLayer}>
                                                                                                    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                        <path d="M0.776855 9.49805L4.77686 5.49805L0.776855 1.49805" stroke="#2E2E2D" stroke-width="1.5" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                                : ''
                                                                                        }
                                                                                        {
                                                                                            subItem.super_sub_category.length ?
                                                                                                <div className="mobile-cate-child-wrap mobile-cat-menu-supsubChild">
                                                                                                    <div className="mobile-cat-layer-header">
                                                                                                        <button className="menu-cate-back-btn" onClick={this.hideLayer}>
                                                                                                            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                <path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659727 4.53553 0.464465C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64644ZM20 3.5L1 3.5L1 4.5L20 4.5L20 3.5Z" fill="#2E2E2D" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                        <p>{subItem.name}</p>
                                                                                                    </div>
                                                                                                    <ul>
                                                                                                        {
                                                                                                            subItem.super_sub_category.map((supSubItem) => (
                                                                                                                <li key={supSubItem.id + '--' + supSubItem.handle} >
                                                                                                                    <Link to={'/collection/' + supSubItem.handle} onClick={this.closeSidebar}>{supSubItem.name}</Link>
                                                                                                                </li>
                                                                                                            ))
                                                                                                        }
                                                                                                    </ul>
                                                                                                </div>
                                                                                                : ''
                                                                                        }
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </div>

                                                                    : ''
                                                            }
                                                        </li>
                                                    ))

                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            : null
                    }

                    <div className="mobile-nav-menu-wrap" >
                        <ul>
                            {header.navigation_bar?.navigation.map((items, key) =>
                                <li id={key} className='mobile-nav-level-1' >
                                    <Link to={`${items.link}`}>{items.label}</Link>
                                    {
                                        items?.children?.length ?
                                            <button className="mobile-nav-next-btn" onClick={this.showChildnav} >
                                                <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.776855 9.49805L4.77686 5.49805L0.776855 1.49805" stroke="#2E2E2D" stroke-width="1.5" />
                                                </svg>
                                            </button>
                                            : ''}

                                    {
                                        items?.children?.length ?

                                            <ul className=" mobile-nav"   >
                                                <div>
                                                    <button className="mobile-nav-back-btn" onClick={this.hideChildnav} >
                                                        <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659727 4.53553 0.464465C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64644ZM20 3.5L1 3.5L1 4.5L20 4.5L20 3.5Z" fill="#2E2E2D" />
                                                        </svg>

                                                    </button>
                                                    <p>{items.label}</p>
                                                </div>
                                                {
                                                    items?.children?.map((items, key) =>
                                                        <li id={key} >
                                                            <Link to={`${items.link}`}>{items.label}</Link>
                                                            {
                                                                items?.children?.length ?
                                                                    <button className="mobile-nav-next-child-btn" onClick={this.showChildnav} >
                                                                        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M0.776855 9.49805L4.77686 5.49805L0.776855 1.49805" stroke="#2E2E2D" stroke-width="1.5" />
                                                                        </svg>
                                                                    </button>

                                                                    : ''
                                                            }
                                                            {
                                                                items?.children?.length ?
                                                                    <ul className='mobile-nav'>
                                                                        <div>
                                                                            <button className="mobile-nav-back-btn" onClick={this.hideChildnav} >
                                                                                <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659727 4.53553 0.464465C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64644ZM20 3.5L1 3.5L1 4.5L20 4.5L20 3.5Z" fill="#2E2E2D" />
                                                                                </svg>
                                                                            </button>
                                                                            <p>{items.label}</p>

                                                                        </div>
                                                                        {items?.children?.map((subItems, subkey) =>
                                                                            <li id={subkey} >
                                                                                <Link to={`${subItems.link}`}>{subItems.label}</Link>

                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                    : null
                                                            }

                                                        </li>
                                                    )}
                                            </ul>
                                            : null
                                    }

                                </li>
                            )}

                            {/* <li>
                                <Link onClick={this.closeSidebar} to="/brands">BRANDS</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/promotions">PROMOTIONS</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/categories/mobiles--tablets">Mobiles & Tablets</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/categories/cameras--accessories">Cameras & Accessories</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/categories/online-cards">Online Cards</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/categories/perfumes">Perfumes</Link>
                            </li>
                            <li>
                                <Link onClick={this.closeSidebar} to="/collection/under-99">Under 99</Link>
                            </li>  */}


                            {/* 
                            <li>
                                <Link to="/brands" onClick={ this.closeSidebar }>BRANDS</Link>
                            </li>
                            <li>
                                <Link to="/promotions" onClick={ this.closeSidebar }>PROMOTIONS</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={ this.closeSidebar }>GROCERY</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={ this.closeSidebar }>PERFUMES</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={ this.closeSidebar }>ITALIAN FOOD</Link>
                            </li>
                            <li>
                                <Link to="/categories/electronic-devices" onClick={ this.closeSidebar }>ELECTRONICS</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={ this.closeSidebar }>PERSONAL CARE</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={ this.closeSidebar }>BABY CARE</Link>
                            </li> */}

                        </ul>
                    </div>
                    <div className="mobile-sidebar-links">
                        <ul>
                            {/* <li>
                                < href="/">
                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.35988 16.7147L7.35993 16.7147C7.67361 16.4122 9.22548 14.8862 10.6953 12.9303C11.4302 11.9524 12.1365 10.8776 12.6574 9.80301C13.1808 8.72313 13.5 7.67789 13.5 6.75C13.5 5.09839 12.8198 3.51057 11.6027 2.33695C10.385 1.16273 8.72966 0.5 7 0.5C5.27034 0.5 3.61503 1.16273 2.39732 2.33695C1.18023 3.51057 0.5 5.09839 0.5 6.75C0.5 7.67789 0.819207 8.72313 1.34265 9.80301C1.86352 10.8776 2.56984 11.9524 3.30472 12.9303C4.77452 14.8862 6.32639 16.4122 6.64007 16.7147L6.64012 16.7147C6.73254 16.8039 6.86162 16.8571 6.9999 16.8571L7.35988 16.7147ZM7.35988 16.7147C7.26746 16.8039 7.13837 16.8571 7.0001 16.8571L7.35988 16.7147Z" stroke="#2E2E2D" />
                                        <path d="M9.08319 5.42934C9.35559 5.82245 9.49976 6.28262 9.49976 6.75175C9.49976 7.38038 9.24095 7.98712 8.77401 8.43738C8.30645 8.88824 7.66855 9.1446 6.99976 9.1446C6.50134 9.1446 6.01553 9.002 5.60386 8.73676L5.33305 9.15707L5.60386 8.73676C5.19237 8.47163 4.87448 8.09668 4.68753 7.66145C4.50067 7.22645 4.4521 6.7489 4.54709 6.28839C4.64212 5.82773 4.87716 5.40201 5.2255 5.06611C5.57404 4.73002 6.02027 4.4992 6.50867 4.40552C6.99714 4.31183 7.50327 4.36006 7.96234 4.54342C8.42128 4.72673 8.81063 5.03599 9.08319 5.42934Z" stroke="#2E2E2D" />
                                    </svg>
                                    Track your order
                                </a>
                            </li> */}
                            <li className='sidebar-account'>
                                {
                                    sessionStorage.getItem('pcb-customer-token') ?
                                        <Link onClick={this.closeSidebar} to="/account">
                                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.65 3.74608C11.65 5.48302 10.2403 6.89215 8.5 6.89215C6.75971 6.89215 5.35 5.48302 5.35 3.74608C5.35 2.00914 6.75971 0.6 8.5 0.6C10.2403 0.6 11.65 2.00914 11.65 3.74608Z" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M16 15.9206C16 11.7828 12.6421 8.42847 8.5 8.42847C4.35786 8.42847 1 11.7828 1 15.9206" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            Account
                                        </Link>
                                        : <Link onClick={this.closeSidebar} to="/login">
                                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.65 3.74608C11.65 5.48302 10.2403 6.89215 8.5 6.89215C6.75971 6.89215 5.35 5.48302 5.35 3.74608C5.35 2.00914 6.75971 0.6 8.5 0.6C10.2403 0.6 11.65 2.00914 11.65 3.74608Z" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M16 15.9206C16 11.7828 12.6421 8.42847 8.5 8.42847C4.35786 8.42847 1 11.7828 1 15.9206" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            Account
                                        </Link>
                                }
                                {/* <Link onClick={ this.closeSidebar } to="/login">
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.65 3.74608C11.65 5.48302 10.2403 6.89215 8.5 6.89215C6.75971 6.89215 5.35 5.48302 5.35 3.74608C5.35 2.00914 6.75971 0.6 8.5 0.6C10.2403 0.6 11.65 2.00914 11.65 3.74608Z" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16 15.9206C16 11.7828 12.6421 8.42847 8.5 8.42847C4.35786 8.42847 1 11.7828 1 15.9206" stroke="#2E2E2D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Account
                                </Link> */}
                            </li>
                            {/* <li>
                                <Dropdown className='mobile-lang-picker' text={this.state.langText} options={countryOptions} onChange={this.changeLanguage} value={this.state.selected_lang} defaultValue={this.state.selected_lang} />
                                <div className="k-row lang-picker1" >
                                </div>
                            </li> */}
                            <li>
                                <select id="country" name="country" form="selectedCountry" onChange={this.redirect}>
                                    <option value="Pakistan" selected={this.props?.selectedCountry === "PK" ? true : null}>Pakistan</option>
                                    <option value="global" selected={this.props?.selectedCountry === "US" ? true : null}>Rest of the World</option>
                                </select>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps)(MobileHeader);
