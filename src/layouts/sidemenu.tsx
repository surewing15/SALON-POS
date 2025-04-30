import logo from "../assets/zar.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidemenu() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    setActiveItem(path);
  }, [location]);

  // Style for active menu items
  const activeStyle = {
    color: "#4069eb",
    fontWeight: "600",
  };

  // Check if a route is active
  const isActive = (path) => {
    return activeItem === path;
  };

  return (
    <>
      <aside className="app-sidebar" id="sidebar">
        <div className="main-sidebar-header">
          <a href="/" className="header-logo"></a>
        </div>
        <div className="main-sidebar" id="sidebar-scroll">
          <nav className="main-menu-container nav nav-pills flex-col">
            <div className="slide-left" id="slide-left"></div>
            <ul className="main-menu">
              <li>
                <a href="">
                  <center>
                    <img
                      src={logo}
                      className="transparent-shadow"
                      style={{ maxHeight: "150px" }}
                      alt="Logo"
                    />
                  </center>
                </a>
              </li>
              <li>
                <hr className="mt-3" />
              </li>
              <li className="slide__category">
                <span className="category-name">MAIN</span>
              </li>
              <li className={`slide ${isActive("/dashboard") ? "active" : ""}`}>
                <Link
                  to="/dashboard"
                  className={`side-menu__item ${
                    isActive("/dashboard") ? "active" : ""
                  }`}
                >
                  <i
                    className={`w-6 h-4 side-menu__icon bi bi-speedometer ${
                      isActive("/dashboard") ? "text-primary" : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={isActive("/dashboard") ? activeStyle : {}}
                  >
                    Dashboard
                  </span>
                </Link>
              </li>

              <li className={`slide ${isActive("/pos") ? "active" : ""}`}>
                <Link
                  to="/pos"
                  className={`side-menu__item ${
                    isActive("/pos") ? "active" : ""
                  }`}
                >
                  <i
                    className={`w-6 h-6 side-menu__icon bi bi-cart ${
                      isActive("/pos") ? "text-primary" : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={isActive("/pos") ? activeStyle : {}}
                  >
                    POS
                  </span>
                </Link>
              </li>

              <li className={`slide ${isActive("/inventory") ? "active" : ""}`}>
                <Link
                  to="/inventory"
                  className={`side-menu__item ${
                    isActive("/inventory") ? "active" : ""
                  }`}
                >
                  <i
                    className={`w-6 h-6 side-menu__icon bi bi-list ${
                      isActive("/inventory") ? "text-primary" : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={isActive("/inventory") ? activeStyle : {}}
                  >
                    View Inventory
                  </span>
                </Link>
              </li>

              <li
                className={`slide ${isActive("/add-product") ? "active" : ""}`}
              >
                <Link
                  to="/add-product"
                  className={`side-menu__item ${
                    isActive("/add-product") ? "active" : ""
                  }`}
                >
                  <i
                    className={`w-6 h-6 side-menu__icon bi bi-plus-square-dotted ${
                      isActive("/add-product") ? "text-primary" : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={isActive("/add-product") ? activeStyle : {}}
                  >
                    Product Management
                  </span>
                </Link>
              </li>

              {/* <li className={`slide ${isActive("/product") ? "active" : ""}`}>
                <Link
                  to="/product"
                  className={`side-menu__item ${
                    isActive("/product") ? "active" : ""
                  }`}
                >
                  <i
                    className={`w-6 h-6 side-menu__icon bi bi-bar-chart ${
                      isActive("/product") ? "text-primary" : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={isActive("/product") ? activeStyle : {}}
                  >
                    Sales Reports
                  </span>
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidemenu;
