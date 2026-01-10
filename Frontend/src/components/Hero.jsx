import React from 'react'
import heroImg from '../assets/hero.png'

const Hero = () => {
    return (
        <section className="hero grid-bg">
            <div className="container hero-content">
                <div className="hero-text">
                    <h1>
                        Where <span style={{ color: 'var(--accent-green)' }}>Profit</span> Meets <span style={{ color: 'var(--primary)' }}>Possibilities</span>
                    </h1>
                    <p>Master the market with Hyderabad's expert traders. From basics to advanced institutional strategies.</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <button className="btn-primary">Join The Membership</button>
                        <button className="btn-black" style={{ border: '2px solid var(--border)' }}>View Courses</button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="image-wrapper">
                        <img src={heroImg} alt="Expert Trader" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
