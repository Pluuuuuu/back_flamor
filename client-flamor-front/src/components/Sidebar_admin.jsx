// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   faLeaf,
//   faTachometerAlt,
//   faBox,
//   faList,
//   faUsers,
//   faStar,
//   faSignOutAlt,
//   faTruckFast,
//   faBars,
// } from "@fortawesome/free-solid-svg-icons";
// import "../styles/Sidebar_admin.css";

// const Sidebar_admin = ({
//   sidebarCollapsed,
//   setSidebarCollapsed,
//   setActiveTab,
//   darkMode,
//   activeTab,
// }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleNavigation = (path, tab) => {
//     setActiveTab(tab);
//     if (location.pathname !== path) {
//       navigate(path);
//     }
//     setIsMobileMenuOpen(false); // Close mobile menu on navigation
//   };

//   const handleLogout = () => {
//     console.log("Logout clicked");
//     navigate("/login");
//     setIsMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const navItems = [
//     {
//       tab: "dashboard",
//       icon: faTachometerAlt,
//       label: "Dashboard",
//       path: "/admin/dashboard",
//     },
//     {
//       tab: "orders",
//       icon: faBox,
//       label: "Orders",
//       path: "/admin/dashboard/orders",
//     },
//     {
//       tab: "shippment",
//       icon: faTruckFast,
//       label: "shipment",
//       path: "/admin/dashboard/shipping",
//     },
//     {
//       tab: "categories",
//       icon: faList,
//       label: "Categories",
//       path: "/admin/dashboard/category",
//     },
//     {
//       tab: "products",
//       icon: faLeaf,
//       label: "Products",
//       path: "/admin/dashboard/products",
//     },
//     {
//       tab: "users",
//       icon: faUsers,
//       label: "Users",
//       path: "/admin/dashboard/users",
//     },
//     {
//       tab: "reviews",
//       icon: faStar,
//       label: "Reviews",
//       path: "/admin/dashboard/reviews",
//     },
//   ];

//   return (
//     <>
//       {/* Hamburger menu icon visible only on phones/tablets via CSS */}
//       <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
//         <FontAwesomeIcon icon={faBars} size="lg" />
//       </div>
//       <div
//         className={`sidebar ${
//           sidebarCollapsed && !isMobileMenuOpen ? "collapsed" : "expanded"
//         } ${isMobileMenuOpen ? "mobile-open" : ""}`}
//       >
//         {/* Logo always visible */}
//         <img src="/Logo.svg" alt="Logo" />
//         {/* Nav links and logout visible only when expanded or mobile menu open */}
//         {(!sidebarCollapsed || isMobileMenuOpen) && (
//           <>
//             <nav>
//               {navItems.map(({ tab, icon, label, path }) => {
//                 const isActive = activeTab === tab;
//                 const navItemClassNames = [
//                   "nav-item",
//                   sidebarCollapsed ? "collapsed" : "",
//                   isActive ? "active" : darkMode ? "inactive-dark" : "inactive",
//                 ].join(" ");
//                 return (
//                   <Link to={path} key={tab}>
//                     <div
//                       onClick={() => handleNavigation(path, tab)}
//                       className={navItemClassNames}
//                     >
//                       <FontAwesomeIcon icon={icon} />
//                       <span>{label}</span>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </nav>
//             <div className={`profile-section ${sidebarCollapsed ? "collapsed" : ""}`}>
//               <div
//                 onClick={handleLogout}
//                 className={`profile-item ${darkMode ? "inactive-dark" : "inactive"}`}
//               >
//                 <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
//                 <span>Logout</span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default Sidebar_admin;

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  faLeaf,
  faTachometerAlt,
  faBox,
  faList,
  faUsers,
  faStar,
  faSignOutAlt,
  faTruckFast,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar_admin.css";

const Sidebar_admin = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  setActiveTab,
  darkMode,
  activeTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path, tab) => {
    setActiveTab(tab);
    if (location.pathname !== path) {
      navigate(path);
    }
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    navigate("/login");
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navItems = [
    {
      tab: "dashboard",
      icon: faTachometerAlt,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      tab: "orders",
      icon: faBox,
      label: "Orders",
      path: "/admin/dashboard/orders",
    },
    {
      tab: "shippment",
      icon: faTruckFast,
      label: "shipment",
      path: "/admin/dashboard/shipping",
    },
    {
      tab: "categories",
      icon: faList,
      label: "Categories",
      path: "/admin/dashboard/category",
    },
    {
      tab: "products",
      icon: faLeaf,
      label: "Products",
      path: "/admin/dashboard/products",
    },
    {
      tab: "users",
      icon: faUsers,
      label: "Users",
      path: "/admin/dashboard/users",
    },
    {
      tab: "reviews",
      icon: faStar,
      label: "Reviews",
      path: "/admin/dashboard/reviews",
    },
  ];

  return (
    <>
      {isMobileView && (
        <>
          <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </div>
          {isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu} />}
        </>
      )}
      <div
        className={`sidebar ${
          isMobileView
            ? isMobileMenuOpen
              ? "mobile-open expanded"
              : "collapsed"
            : sidebarCollapsed
            ? "collapsed"
            : "expanded"
        }`}
      >
        <img src="/Logo.svg" alt="Logo" />
        {( (!sidebarCollapsed && !isMobileView) || isMobileMenuOpen ) && (
          <>
            <nav>
              {navItems.map(({ tab, icon, label, path }) => {
                const isActive = activeTab === tab;
                const navItemClassNames = [
                  "nav-item",
                  sidebarCollapsed && !isMobileView ? "collapsed" : "",
                  isActive ? "active" : darkMode ? "inactive-dark" : "inactive",
                ].join(" ");
                return (
                  <Link to={path} key={tab}>
                    <div
                      onClick={() => handleNavigation(path, tab)}
                      className={navItemClassNames}
                    >
                      <FontAwesomeIcon icon={icon} />
                      <span>{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div
              className={`profile-section ${
                sidebarCollapsed && !isMobileView ? "collapsed" : ""
              }`}
            >
              <div
                onClick={handleLogout}
                className={`profile-item ${
                  darkMode ? "inactive-dark" : "inactive"
                }`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                <span>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar_admin;
