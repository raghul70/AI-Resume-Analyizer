import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { analysisService } from '../services/api'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Result = () => {
  const { analysisId } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalysis()
  }, [analysisId])

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const data = await analysisService.getOne(analysisId)
      setAnalysis(data)
    } catch (error) {
      toast.error('Failed to fetch analysis')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Analysis not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Analysis Result</h2>
            <p className="text-gray-600 mt-1">
              {new Date(analysis.created_at).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {analysis.match_score}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Match Score</p>
          </div>
        </div>
      </motion.div>

      {/* Skills Found */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span>Skills Found ({analysis.skills_found?.length || 0})</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {analysis.skills_found?.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
            >
              {skill}
            </motion.span>
          ))}
          {(!analysis.skills_found || analysis.skills_found.length === 0) && (
            <p className="text-gray-500">No skills found</p>
          )}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <XCircleIcon className="w-5 h-5 text-red-600" />
          <span>Missing Skills ({analysis.missing_skills?.length || 0})</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {analysis.missing_skills?.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
            >
              {skill}
            </motion.span>
          ))}
          {(!analysis.missing_skills || analysis.missing_skills.length === 0) && (
            <p className="text-gray-500">No missing skills - Perfect match!</p>
          )}
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-600" />
          <span>Suggestions</span>
        </h3>
        <div className="space-y-2">
          {analysis.suggestions?.split('\n').map((suggestion, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-gray-700 leading-relaxed"
            >
              • {suggestion}
            </motion.p>
          ))}
          {(!analysis.suggestions || analysis.suggestions === '') && (
            <p className="text-gray-500">No suggestions available</p>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary flex-1"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="btn-primary flex-1"
        >
          Print Results
        </button>
      </div>
    </div>
  )
}

export default Result