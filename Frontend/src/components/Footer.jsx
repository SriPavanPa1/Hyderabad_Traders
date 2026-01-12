import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>HYDERABAD TRADER</h2>
                        <p>Empowering traders with knowledge and strategies.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#pricing">Courses</a></li>
                                <li><a href="#pricing">Blog</a></li>
                                {/* <li><a href="#pricing">Join The Membership</a></li> */}
                                <li><a href="#contact">Contact Us</a></li>
                            </ul>
                        </div>
                        <div className="link-group">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Hyderabad Trader. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
