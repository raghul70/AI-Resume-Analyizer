import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { resumeService } from '../services/api'
import { 
  CloudArrowUpIcon, 
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const ResumeUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or DOCX file')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    try {
      const result = await resumeService.upload(file)
      toast.success('Resume uploaded successfully!')
      setFile(null)
      if (onSuccess) onSuccess(result)
    } catch (error) {
      toast.error(error.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-300
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <CloudArrowUpIcon className="w-16 h-16 text-indigo-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              or click to browse files (PDF, DOCX up to 10MB)
            </p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-indigo-200"
        >
          <div className="flex items-center space-x-3">
            <DocumentIcon className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="font-medium text-gray-800 truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={uploading}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </motion.div>
      )}

      {file && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>Upload Resume</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}

export default ResumeUpload