import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ResumeUpload from '../components/ResumeUpload'
import JobMatchForm from '../components/JobMatchForm'
import ScoreCard from '../components/ScoreCard'
import SkillList from '../components/SkillList'
import { resumeService, analysisService } from '../services/api'
import { 
  DocumentTextIcon, 
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [resumes, setResumes] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resumesData, analysesData] = await Promise.all([
        resumeService.getAll(),
        analysisService.getHistory(),
      ])
      setResumes(resumesData)
      setAnalyses(analysesData)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (data) => {
    setShowUpload(false)
    fetchData()
    toast.success('Resume uploaded successfully!')
  }

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis)
    setShowAnalysis(false)
    setSelectedResume(null)
    fetchData()
    navigate(`/result/${analysis.id}`)
  }

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeService.delete(id)
        fetchData()
        toast.success('Resume deleted successfully')
      } catch (error) {
        toast.error('Failed to delete resume')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resumes</p>
              <p className="text-3xl font-bold gradient-text">{resumes.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Analyses</p>
              <p className="text-3xl font-bold gradient-text">{analyses.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold gradient-text">
                {analyses.length > 0 
                  ? Math.round(analyses.reduce((acc, a) => acc + a.match_score, 0) / analyses.length)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Upload Resume</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAnalysis(true)}
          className="btn-secondary flex items-center space-x-2"
          disabled={resumes.length === 0}
        >
          <ChartBarIcon className="w-5 h-5" />
          <span>New Analysis</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchData}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Upload Resume</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <ResumeUpload onSuccess={handleUploadSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnalysis(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Analyze Resume</h3>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <JobMatchForm
                resumes={resumes}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumes List */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <FolderIcon className="w-5 h-5 text-indigo-600" />
          <span>Your Resumes</span>
        </h2>
        {resumes.length === 0 ? (
          <div className="text-center py-12 card">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resumes uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card hover:border-indigo-200 cursor-pointer"
                onClick={() => setSelectedResume(resume)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {resume.filename}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(resume.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteResume(resume.id)
                    }}
                    className="p-1 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-purple-600" />
            <span>Recent Analyses</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyses.slice(0, 4).map((analysis) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card cursor-pointer"
                onClick={() => navigate(`/result/${analysis.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Match Score: {analysis.match_score}%
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {analysis.match_score}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard