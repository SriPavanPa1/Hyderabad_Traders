import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import '../../styles/Auth.css'

function Login({ onSwitchToSignUp, onSwitchToForgotPassword }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock authentication - replace with actual API call
      const response = {
        success: true,
        message: 'Login successful',
        token: 'mock_token_12345',
        user: {
          id: 1,
          email: formData.email,
          name: 'User'
        }
      }

      setSuccess(response.message)
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Reset form
      setFormData({
        email: '',
        password: ''
      })

      // Redirect after success
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your Hyderabad Trader account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="forgot-password-link"
            onClick={onSwitchToForgotPassword}
            disabled={loading}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="switch-button"
            onClick={onSwitchToSignUp}
            disabled={loading}
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
