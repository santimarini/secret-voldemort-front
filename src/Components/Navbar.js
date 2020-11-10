import React, { useState } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import { BrowserRouter as Router, Link } from 'react-router-dom';

import { getToken, getEmail, getAlias } from '../Util/HelperFunctions';


function Navbar() {
  const [token, setToken] = useState(getToken());

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(isOpen);
  }

    return (
      <div>
      { token ? (
      <div className="logged-user-navbar">
      <MDBNavbar className="navbar-1" color="default-color" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">Secret Voldemort</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
          <MDBNavbarNav left>
            <MDBNavItem active>
              <MDBNavLink to="">Home</MDBNavLink>
            </MDBNavItem>

            <MDBNavItem className="play-button">
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <div className="d-none d-md-inline">Play!</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">            
                  <MDBDropdownItem tag={Link} to="/play">Create game</MDBDropdownItem>
                  <MDBDropdownItem tag={Link} to="/games">Join game</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <div className="d-none d-md-inline">{getAlias()}</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default">
                  <MDBDropdownItem tag={Link} to="/profile"> Profile</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
            </div>
            ) : (
            <div>
            <MDBNavbar className="navbar-1" color="default-color" dark expand="md">
              <MDBNavbarBrand>
                <strong className="white-text">Secret Voldemort</strong>
              </MDBNavbarBrand>
              <MDBNavbarToggler onClick={toggleCollapse} />
              <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
              <MDBNavbarNav left>
                <MDBNavItem active>
                  <MDBNavLink to="">Home</MDBNavLink>
                </MDBNavItem>
              <MDBNavItem active>
                <MDBNavLink to='/login'>Login</MDBNavLink>
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
