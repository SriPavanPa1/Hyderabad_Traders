import React from 'react'
import logoImg from '../assets/logo.png'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo-area">
                    <img src={logoImg} alt="Hyderabad Trader Logo" className="nav-logo" />
                    <span className="logo-text">HYDERABAD TRADER</span>
                </div>

                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#pricing">Courses</a></li>
                    <li><a href="#blog">Blog</a></li>
                    <li><a href="#membership">Join The Membership</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                </ul>

                <div className="nav-actions">
                    <button className="login-btn">Login</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
