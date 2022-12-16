import React from "react";
import { Icon } from "semantic-ui-react";
// import { Button, Header, Modal } from "semantic-ui-react";
// /*images*/
// import keesLogo from '../assets/img/keesLogo.png';
// import location from "../../../../assets/svg/location.svg";
// import megamenuImage from '../../../../assets/img/megamenuimage2.png';
import MiniCart from "../../header/sections/MiniCart";
// import Axios from "axios";
import { Link } from "react-router-dom";
// import SearchSuggestions from "../../header/sections/SearchSuggestion";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMegamenu: false,
      loading: true,
      // header: [
      //   {
      //     "0": "www.google.com",
      //     "1": "Click here and enjoy searching",
      //     "2": "17"
      //   },
      // ]
      header: props.navbar,
    };
  }

  componentDidMount() {
    // fetch categories
    //   Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/categories_list')
    // Axios.get(process.env.REACT_APP_BACKEND_HOST + '/storefront/header')
    //   .then((res) => {
    //     // console.log(res.data)
    //     this.setState({
    //       header: res.data.header,
    //       loading: false
    //     })
    //   })

    if (this.props.navbar) {
      // debugger
      this.setState({
        // header: res.data.header,
        loading: false,
      });
    }
  }

  // componentDidUpdate() {
  //   console.log("Component Updata!!!.")
  // }
  // componentWillUpdate ()
  // {
  //   let { slug } = useParams();

  //     console.log(slug)
  // }

  toggleMegamenu = () => {
    this.setState({
      showMegamenu: !this.state.showMegamenu,
    });
  };

  catHover = (event) => {
    // show submenu on hover
    var allSubmenu;

    if (
      event.target.parentElement.parentElement.classList.contains("cat-level-1")
    ) {
      allSubmenu = document.querySelectorAll(".submenu");

      let activeLinks = document.querySelectorAll(".cat-level-1 > li a"); //classList.remove("active-link")
      for (var i = 0; i < activeLinks.length; i++) {
        activeLinks[i].classList.remove("active-link");
      }
    } else {
      allSubmenu = document.querySelectorAll(" .cat-level-2  .submenu");

      let activeLinks = document.querySelectorAll(".cat-level-2  > li a"); //classList.remove("active-link")
      for (var j = 0; j < activeLinks.length; j++) {
        activeLinks[j].classList.remove("active-link");
      }
    }

    for (var k = 0; k < allSubmenu.length; k++) {
      allSubmenu[k].classList.remove("show");
      allSubmenu[k].classList.add("hide");
    }
    event.target.classList.add("active-link");

    let submenu = event.target.parentElement.querySelector(".submenu");
    if (submenu) {
      submenu.classList.remove("hide");
      submenu.classList.add("show");
    }
  };

  render() {
    const { showMegamenu, loading } = this.state;
    const header = this.state.header;

    return (
      <div className="navbar">
        <div className="container-xl">
          <div className="k-row border_top" style={{ paddingTop: "24px" }}>
            {!!header?.navigation_bar?.show_category_structure ? (
              <div className="categories k-row">
                <div
                  className={
                    "desktop-menu-overlay " + (showMegamenu ? "show" : "hide")
                  }
                  onClick={this.toggleMegamenu}
                ></div>
                <div
                  className="k-row cat-dropdown"
                  onClick={this.toggleMegamenu}
                >
                  <div className="k-row bold">
                    <Icon name="list" />
                    <p className="noselect">More Categories</p>
                  </div>
                  <Icon name="angle down" />
                </div>
                <div className="k-divider"></div>
              </div>
            ) : null}
            <div className="nav-menu bold-navbaricon">
              <div>
                <ul>
                  {header.navigation_bar?.navigation.map((items, childkey) => (
                    <li key={childkey} className="dropdown1">
                      <Link to={`${items.link}` ? `${items.link}` : "/home"}>
                        {items.label}
                      </Link>
                      {items?.children?.length ? (
                        <ul className="dropdown-content-level-1 ul-menu">
                          {items?.children?.map((items, subkey) => (
                            <li key={subkey}>
                              <Link to={`${items.link}`}>{items.label}</Link>
                              {items?.children?.length ? (
                                <ul className="dropdown-content-level-2 ul-menu">
                                  {items?.children?.map(
                                    (subItems, superkey) => (
                                      <li key={superkey}>
                                        <Link to={`${subItems.link}`}>
                                          {subItems.label}
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ position: "relative" }}>
                <div className="nav_user_options1">
                  <Link to="/wishlist">
                    <p>
                      <Icon name="like" /> My Wishlist
                    </p>
                  </Link>
                  <MiniCart />
                </div>
              </div>
            </div>
            {/* <li>
                  <Link to="/brands">Brands</Link>
                </li>
                <li>
                  <Link to="/promotions">PROMOTIONS</Link>
                </li>
                <li>
                  <Link to="/categories/mobiles--tablets">Mobiles & Tablets</Link>
                </li>
                <li>
                  <Link to="/categories/cameras--accessories">Cameras & Accessories</Link>
                </li>
                <li>
                  <Link to="/categories/online-cards">Online Cards</Link>
                </li>
                <li>
                  <Link to="/categories/perfumes">Perfumes</Link>
                </li>
                <li>
                  <Link to="/collection/under-99">Under 99</Link>
                </li> */}

            {/* <div className="track-order k-row flex--1">
              {header?.navigation_bar?.show_track_order ?
                <Link to="/trackyourorder" > <Image src={location} />Track your order </Link>
                : null
              }

            </div> */}
          </div>
        </div>

        {/* megamenu */}
        <div
          className={"cat-megamenu-wrapper " + (showMegamenu ? "show" : "hide")}
        >
          <div className="cat-megamenu">
            <div className="cat-menu wraper-level-1 ">
              <ul className="cat-level-1">
                {loading && header.length
                  ? null
                  : header.navigation_bar.category_structure.map(
                    (item, key) => {
                      {
                        return item.sub_category.length ? (
                          <li key={key}>

                            <Link
                              to={"/collection/" + item.handle}
                              onMouseEnter={this.catHover}
                              onClick={this.toggleMegamenu}
                            >
                              {item.name}
                            </Link>
                            {/* second level */}
                            <div className="wraper-level-2 hide submenu">
                              <ul className="cat-level-2 ">
                                {item.sub_category.map((sub, subindex) => {
                                  return sub.super_sub_category.length ? (
                                    <li key={subindex}>

                                      <Link
                                        to={"/collection/" + sub.handle}
                                        onMouseEnter={this.catHover}
                                        onClick={this.toggleMegamenu}
                                      >

                                        {sub.name}
                                      </Link>
                                      {/* third level */}
                                      <div className="wraper-level-3 hide submenu">
                                        <ul className="cat-level-3">
                                          {sub.super_sub_category.map(
                                            (super_sub, super_index) => {
                                              return (
                                                <li key={super_index}>
                                                  <Link
                                                    to={
                                                      "/collection/" +
                                                      super_sub.handle
                                                    }
                                                    onClick={
                                                      this.toggleMegamenu
                                                    }
                                                  >
                                                    {super_sub.name}
                                                  </Link>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </div>
                                    </li>
                                  ) : (
                                    <li key={subindex}>

                                      <span className="ahmad">

                                        <Link
                                          to={"/collection/" + sub.handle}
                                          onMouseEnter={this.catHover}
                                          onClick={this.toggleMegamenu}
                                        >

                                          {sub.name}
                                        </Link>
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </li>
                        ) : (
                          <li key={key}>

                            <Link
                              className="no-submenu"
                              to={"/collection/" + item.handle}
                              onMouseEnter={this.catHover}
                              onClick={this.toggleMegamenu}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      }
                    }
                  )}
                {/* <li > <span onMouseEnter={this.catHover}>Perfumes </span>  
                  
                  <div className="wraper-level-2 hide submenu">
                    <ul className="cat-level-2 ">
                      <li> <span onMouseEnter={this.catHover}>menu 1</span> 
                        
                        <div className="wraper-level-3 hide submenu">
                          <ul className="cat-level-3">
                            <li>sub menu 1</li>
                            <li>sub menu 2</li>
                            <li>sub menu 3</li>
                          </ul>
                        </div>

                      </li>
                      <li><span onMouseEnter={this.catHover}>menu 2</span> 
                        <div className="wraper-level-3 hide submenu">
                            <ul className="cat-level-3">
                              <li>sub menu 21</li>
                              <li>sub menu 22</li>
                              <li>sub menu 23</li>
                            </ul>
                          </div>
                      </li>
                      <li>menu 3</li>
                    </ul>

                  </div>
                </li> */}
                {/* <li > <span onMouseEnter={this.catHover}>Perfumes 2 </span>  
                  
                  <div className="wraper-level-2 hide submenu">
                    <ul className="cat-level-2 ">
                      <li> <span onMouseEnter={this.catHover}>menu  2221</span> 
                        
                        <div className="wraper-level-3 hide submenu">
                          <ul className="cat-level-3">
                            <li>sub menu  2221</li>
                            <li>sub menu  2222</li>
                            <li>sub menu  2223</li>
                          </ul>
                        </div>

                      </li>
                      <li>menu  2222</li>
                      <li>menu  2223</li>
                    </ul>

                  </div>
                </li>
                <li>Italian Food</li>
                <li>Gaming consoles & Accessories</li>
                <li>Home Appliances</li>
                <li>Electronics & Tools</li>
                <li>Baby care</li>
                <li>Breakfast</li>
                <li>Confectionery</li>
                <li>Cleaning & Detergent</li>
                <li>Cooking Oilents</li> */}
              </ul>
            </div>
            <div className="megamenu-image">
              <img
                src={header ? header.navigation_bar?.mega_menu_image : null}
                alt="megamenu"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
