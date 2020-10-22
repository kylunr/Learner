import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import SchoolIcon from '@material-ui/icons/School';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import './Navbar.css';
import { Avatar, Button } from '@material-ui/core';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


/**
 * The Navbar component is used to render the navigation
 * bar for the user, this navigation bar includes a sidebar
 * for navigating between pages
 */
function Navbar() {
    
    // User to pull data from the user
    const user = useSelector(selectUser);
    // Stores state of sidebar
    const [sidebar, setSidebar] = useState(false);
    // Toggles the sidebar 
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div>
            {/* Hamburger Menu Icon */}
            <div className="navbar_menu">
                <Link to='#' className='navbar_menu_icon' >
                    <MenuIcon onClick={showSidebar} style={{ fontSize: 40 }}/>
                </Link>

                <div className="navbar_title_section">
                    <SchoolIcon className="navbar_logo" style={{ fontSize: 40 }}/>
                    <h1 className="navbar_title">Learner</h1>
                </div>

                <div className="navbar_user_section">
                    <h2 className="navbar_name">{user.displayName}</h2>
                    <Avatar src={user.photo} className="navbar_avatar"/>
                </div>
            </div>

            {/* List of page links */}
            <nav className={sidebar ? 'nav_menu active' : 'nav_menu'}>
                <ul className="nav_menu_items" onClick={showSidebar}>
                    <li className="navbar_toggle">
                        <Link to="#" className="navbar_menu_icon">
                            <CloseIcon style={{ fontSize: 40 }} />
                        </Link>
                    </li>

                    <li className="nav_text">
                        <Link to="/">
                            <HomeIcon />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li className="nav_text">
                        <Link to="/about">
                            <InfoIcon />
                            <span>About</span>
                        </Link>
                    </li>

                    <li className="nav_text">
                        <Link to="/history">
                            <MenuBookIcon />
                            <span>History</span>
                        </Link>
                    </li>

                    <li className="nav_text">
                        <Link to="#" onClick={() => auth.signOut()} >
                            <ExitToAppIcon  />
                            <span>Sign-Out</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/*
            <div className="navbar_title_section">
                <SchoolIcon className="navbar_logo" style={{ fontSize: 50 }}/>
                <h1 className="navbar_title">Learner</h1>
            </div>

             
            <div className="navbar_buttons"> 
                <Button onClick={() => auth.signOut()}>Home</Button>
                <Button onClick={() => auth.signOut()}>About</Button>
                <Button onClick={() => auth.signOut()}>History</Button>
                <Button onClick={() => auth.signOut()}>Sign Out</Button>
            </div>
            



            */}
        </div>
    );
}

export default Navbar;