import logo from "../assets/zar.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidemenu() {
  const location = useLocation();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    setActiveItem(path);

    // Auto expand inventory submenu if on an inventory-related page
    if (path === "/inventory" || path === "/add-product") {
      setInventoryOpen(true);
    }
  }, [location]);

  const toggleInventorySubmenu = () => {
    setInventoryOpen(!inventoryOpen);
  };

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
          <nav className="main-menu-container nav nav-pills flex-col sub-open">
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

              <li
                className={`slide ${
                  isActive("/inventory") || isActive("/add-product")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="#"
                  className={`side-menu__item ${
                    isActive("/inventory") || isActive("/add-product")
                      ? "active"
                      : ""
                  }`}
                  onClick={toggleInventorySubmenu}
                >
                  <i
                    className={`w-6 h-6 side-menu__icon bi bi-box ${
                      isActive("/inventory") || isActive("/add-product")
                        ? "text-primary"
                        : ""
                    }`}
                  ></i>
                  <span
                    className="side-menu__label"
                    style={
                      isActive("/inventory") || isActive("/add-product")
                        ? activeStyle
                        : {}
                    }
                  >
                    Inventory
                  </span>
                  <i
                    className={`fe fe-chevron-down ms-auto ${
                      inventoryOpen ? "rotate-180" : ""
                    } ${
                      isActive("/inventory") || isActive("/add-product")
                        ? "text-primary"
                        : ""
                    }`}
                  ></i>
                </a>
                <ul
                  className="slide-menu"
                  style={{
                    display: inventoryOpen ? "block" : "none",
                    paddingLeft: "1rem",
                  }}
                >
                  <li className="mt-2">
                    <Link
                      to="/inventory"
                      className="slide-item d-flex align-items-center"
                    >
                      <i
                        className={`bi bi-list me-2 ${
                          isActive("/inventory") ? "text-primary" : ""
                        }`}
                        style={{ fontSize: "0.9rem", minWidth: "16px" }}
                      ></i>
                      <span
                        style={
                          isActive("/inventory")
                            ? { ...activeStyle, fontSize: "0.9rem" }
                            : { color: "#6c757d", fontSize: "0.9rem" }
                        }
                      >
                        View Inventory
                      </span>
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      to="/add-product"
                      className="slide-item d-flex align-items-center"
                    >
                      <i
                        className={`bi bi-plus-square-dotted me-2 ${
                          isActive("/add-product") ? "text-primary" : ""
                        }`}
                        style={{ fontSize: "0.9rem", minWidth: "16px" }}
                      ></i>
                      <span
                        style={
                          isActive("/add-product")
                            ? { ...activeStyle, fontSize: "0.9rem" }
                            : { color: "#6c757d", fontSize: "0.9rem" }
                        }
                      >
                        Product Management
                      </span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={`slide ${isActive("/product") ? "active" : ""}`}>
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
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidemenu;
