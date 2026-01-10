import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Learning from './components/Learning'
import Pricing from './components/Pricing'
import Features from './components/Features'
import EventBanner from './components/EventBanner'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Learning />
      <Features />
      <Pricing />
      <EventBanner />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
