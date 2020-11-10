import React, { useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { BrowserRouter as Router, Link } from "react-router-dom";

import { getToken, getAlias, getEmail } from "../Util/HelperFunctions";

function Navbar(props) {
  const [token, setToken] = useState(getToken());

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(isOpen);
  };

  const logout = (e) => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      {token ? (
        <div className="logged-user-navbar">
          <MDBNavbar
            className="navbar-1"
            color="default-color"
            dark
            expand="md"
          >
            <MDBNavbarToggler onClick={toggleCollapse} />
            <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
              <MDBNavbarNav left>
                <MDBNavItem active>
                  <MDBNavLink className="home-navbar-1" to="">
                    Home
                  </MDBNavLink>
                </MDBNavItem>

                <MDBNavItem className="play-button">
                  <MDBDropdown>
                    <MDBDropdownToggle nav caret>
                      <div className="d-none d-md-inline">Play!</div>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu className="dropdown-play">
                      <MDBDropdownItem tag={Link} to="/play">
                        <p className="create-game-navbar">Create game</p>
                      </MDBDropdownItem>
                      <MDBDropdownItem tag={Link} to="/games">
                        <p className="join-game-navbar">Join game</p>
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavItem>
                <MDBNavItem className="alias" right>
                  <MDBDropdown>
                    <MDBDropdownToggle caret>
                      <div className="d-none d-md-inline">{getAlias()}</div>
                    </MDBDropdownToggle>
                    <div className="alias-desplegated">
                      <MDBDropdownMenu>
                        <p class="text-lowercase" className="email-navbar">
                          {getEmail()}
                        </p>
                        <MDBDropdownItem tag={Link} to="/profile">
                          Profile
                        </MDBDropdownItem>
                        <MDBDropdownItem onClick={logout}>
                          Logout
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </div>
                  </MDBDropdown>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </div>
      ) : (
        <div>
          <MDBNavbar
            className="navbar-2"
            color="default-color"
            dark
            expand="md"
          >
            <MDBNavbarToggler onClick={toggleCollapse} />
            <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
              <MDBNavbarNav right>
                <MDBNavItem active>
                  <MDBNavLink className="home-navbar-2" to="">
                    Home
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active>
                  <MDBNavLink to="/login">Login</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active>
                  <MDBNavLink to="/signup">Sign Up</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </div>
      )}
    </div>
  );
}

export default Navbar;
