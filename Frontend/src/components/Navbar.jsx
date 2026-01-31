import React from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.png'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo-area">
                    <Link to="/">
                        <img src={logoImg} alt="Hyderabad Trader Logo" className="nav-logo" />
                        <span className="logo-text">HYDERABAD TRADER</span>
                    </Link>
                </div>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/courses">Courses</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    {/* <li><Link to="/membership">Join The Membership</Link></li> */}
                    <li><Link to="/contact">Contact Us</Link></li>
                </ul>

                <div className="nav-actions">
                    <Link to="/login" className="login-btn">Login</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
