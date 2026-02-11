import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import '../styles/CourseUpload.css'

const CourseUpload = () => {
  const { isAdmin } = useAuth()
  const [formData, setFormData] = useState({
    courseName: '',
    courseDescription: '',
    instructor: '',
    category: '',
    level: 'beginner',
    price: '',
    duration: '',
    courseImage: null,
    courseVideo: null,
    courseMaterials: []
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [previewVideo, setPreviewVideo] = useState(null)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="access-denied">
        <div className="denied-card">
          <AlertCircle size={48} />
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page. Only administrators can upload courses.</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target.result)
        setFormData(prev => ({
          ...prev,
          courseImage: file
        }))
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setError('Video size should be less than 500MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewVideo(event.target.result)
        setFormData(prev => ({
          ...prev,
          courseVideo: file
        }))
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleMaterialsUpload = (e) => {
    const files = Array.from(e.target.files)
    const newMaterials = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      file: file
    }))
    setMaterials([...materials, ...newMaterials])
    setFormData(prev => ({
      ...prev,
      courseMaterials: [...materials, ...newMaterials]
    }))
  }

  const removeMaterial = (id) => {
    const updated = materials.filter(m => m.id !== id)
    setMaterials(updated)
    setFormData(prev => ({
      ...prev,
      courseMaterials: updated
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (!formData.courseName || !formData.courseDescription || !formData.instructor) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (!previewImage) {
        setError('Please upload a course image')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess(true)
      setFormData({
        courseName: '',
        courseDescription: '',
        instructor: '',
        category: '',
        level: 'beginner',
        price: '',
        duration: '',
        courseImage: null,
        courseVideo: null,
        courseMaterials: []
      })
      setPreviewImage(null)
      setPreviewVideo(null)
      setMaterials([])

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to upload course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="course-upload-container">
      <div className="upload-header">
        <h1>Upload Course</h1>
        <p>Create and manage your courses</p>
      </div>

      {success && (
        <div className="alert alert-success">
          <Check size={20} />
          <span>Course uploaded successfully!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="courseName">Course Name *</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              placeholder="Enter course name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="instructor">Instructor Name *</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="Enter instructor name"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="trading">Trading</option>
                <option value="investing">Investing</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="fundamentals">Market Fundamentals</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (hours)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 40"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 99.99"
                disabled={loading}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="courseDescription">Course Description *</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleInputChange}
              placeholder="Describe your course content and learning objectives"
              rows="5"
              disabled={loading}
              required
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h2>Course Media</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="courseImage">Course Image *</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="courseImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                <div className="upload-area">
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Course preview" className="image-preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null)
                          setFormData(prev => ({ ...prev, courseImage: null }))
                        }}
                        className="remove-btn"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={32} />
                      <p>Click to upload course image</p>
                      <span>PNG, JPG, GIF up to 5MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="courseVideo">Course Preview Video</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="courseVideo"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={loading}
                />
                <div className="upload-area">
                  {previewVideo ? (
                    <>
                      <video width="100%" height="auto" controls className="video-preview">
                        <source src={previewVideo} />
                      </video>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewVideo(null)
                          setFormData(prev => ({ ...prev, courseVideo: null }))
                        }}
                        className="remove-btn"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={32} />
                      <p>Click to upload preview video</p>
                      <span>MP4, WebM up to 500MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Course Materials</h2>
          <div className="form-group">
            <label htmlFor="materials">Upload Course Materials (PDFs, Documents, etc.)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="materials"
                multiple
                onChange={handleMaterialsUpload}
                disabled={loading}
              />
              <div className="upload-area">
                <Upload size={32} />
                <p>Click to upload materials</p>
                <span>PDF, DOC, DOCX, etc.</span>
              </div>
            </div>
          </div>

          {materials.length > 0 && (
            <div className="materials-list">
              <h3>Uploaded Materials ({materials.length})</h3>
              <div className="materials-grid">
                {materials.map(material => (
                  <div key={material.id} className="material-item">
                    <div className="material-info">
                      <p className="material-name">{material.name}</p>
                      <p className="material-size">{(material.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMaterial(material.id)}
                      className="remove-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => {
              setFormData({
                courseName: '',
                courseDescription: '',
                instructor: '',
                category: '',
                level: 'beginner',
                price: '',
                duration: '',
                courseImage: null,
                courseVideo: null,
                courseMaterials: []
              })
              setPreviewImage(null)
              setPreviewVideo(null)
              setMaterials([])
            }}
          >
            Clear Form
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Course'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseUpload
