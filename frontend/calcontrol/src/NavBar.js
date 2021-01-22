import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { getUserToken, userLogout } from './actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, 
         UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './NavBar.css';

/** Navigation bar that allows for quick site navigation **/
const NavBar = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(()=>{
    dispatch(getUserToken());
  }, [dispatch])
  
  let {token} = useSelector(store => store.token)
  let username;

  if(token){
    let user = jwt.decode(token);
    username = user.username;
  }

  const showAlert = () =>{
    let logout = window.confirm('Are you sure you want to log out?');

    if(logout){
      dispatch(userLogout());
      history.push('/');
    }

  }

  return (
    <div>
      <Navbar expand="md">
        <NavbarBrand href='/'>CalControl</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {token ?
            <>
            <NavItem>
              <NavLink href={`/user/${username}/profile`}>Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={`/user/${username}/favorites`}>Favorite Items</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={`/user/${username}/checkin`}>Check In</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={showAlert} href="">Log Out</NavLink>
            </NavItem>
            </>
            :
            <>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Register
              </DropdownToggle>
              <DropdownMenu color='rgb(215, 216, 173)' right>
                <DropdownItem>
                    <NavLink href="/signup">Sign Up</NavLink>
                </DropdownItem>
                <DropdownItem>
                    <NavLink href="/login">Log In</NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            </>
          }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;