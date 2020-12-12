import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import NProgress from 'nprogress';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';
import { signout, isAuthenticated } from '../actions/auth';
import { APP_NAME } from '../config';
import styles from './Header.module.css';


Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="sm">
        <Link href="/">
          <NavLink className={styles.navItem}>{ APP_NAME }</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>

            {isAuthenticated() && isAuthenticated().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink className={styles.navItem}>
                    {`${isAuthenticated().name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {isAuthenticated() && isAuthenticated().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink className={styles.navItem}>
                    {`${isAuthenticated().name}'s Admin Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}
            
            <React.Fragment>
              <NavItem>
                <Link href="/blogs">
                  <NavLink className={styles.navItem}>Blogs</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>

            {!isAuthenticated() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink className={styles.navItem}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink className={styles.navItem}>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {isAuthenticated() && (
              <NavItem>
                <NavLink className={styles.navItem} onClick={() => signout(() => Router.replace('/signin'))}>
                  Signout
                </NavLink>  
              </NavItem>
           )}
        
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header;