import React, {Fragment} from "react";
import {Link, NavLink} from "react-router-dom";
import "./MobileHeader.scss";
import {HiSearch} from "react-icons/hi";

const MobileHeader = () => {
    return (
        <Fragment>
            <header id="mobileHeader" className="mobile-only" >
                <nav className="header--nav flex-row" >
                    <div className="mobile--header--inner header--inner flex-row" >
                        <Link to="/">
                            <h1 className="logoText">Voxgram</h1>
                        </Link>
                    <ul className="header--ul flex-row">
                        <li>
                        <NavLink  activeClassName="active-nav-link" exact to="/search">
                             <HiSearch />
                        </NavLink>
                        </li>
                        
                    </ul>
                    </div>  
                </nav>
                
            </header>
        </Fragment>
    )
}

export default MobileHeader;