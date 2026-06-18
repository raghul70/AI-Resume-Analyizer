import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { analysisService } from '../services/api'
import { 
  DocumentTextIcon,
  BriefcaseIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const JobMatchForm = ({ resumes, onAnalysisComplete }) => {
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedResumeId) {
      toast.error('Please select a resume')
      return
    }
    
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    setAnalyzing(true)
    try {
      const result = await analysisService.analyze(
        parseInt(selectedResumeId),
        jobDescription
      )
      toast.success('Analysis complete!')
      if (onAnalysisComplete) onAnalysisComplete(result)
    } catch (error) {
      toast.error(error.detail || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Resume
        </label>
        <select
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Choose a resume...</option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.filename} ({new Date(resume.uploaded_at).toLocaleDateString()})
            </option>
          ))}
        </select>
        {resumes.length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Please upload a resume first
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="input-field min-h-[200px] resize-y"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={analyzing || resumes.length === 0}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        {analyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <ChartBarIcon className="w-5 h-5" />
            <span>Analyze Resume</span>
          </>
        )}
      </motion.button>
    </form>
  )
}

export default JobMatchForm