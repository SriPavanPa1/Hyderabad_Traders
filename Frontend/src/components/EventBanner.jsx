import React from 'react'
import eventImg from '../assets/event.png'

const EventBanner = () => {
    return (
        <section className="event-banner section-padding">
            <div className="container">
                <div className="banner-content" style={{ backgroundImage: `url(${eventImg})` }}>
                    <div className="banner-overlay">
                        <h2 className="city-name">CHENNAI</h2>
                        <p className="event-date">SEP 11-12, 2025</p>
                        <button className="btn-black">Register</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventBanner
