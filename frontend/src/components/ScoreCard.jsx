import React from 'react'
import { motion } from 'framer-motion'
import { ChartBarIcon } from '@heroicons/react/24/outline'

const ScoreCard = ({ score, label = 'Match Score' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </p>
        </div>
        <div className={`w-16 h-16 rounded-full ${getScoreBg(score)} flex items-center justify-center`}>
          <ChartBarIcon className={`w-8 h-8 ${getScoreColor(score)}`} />
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-2 rounded-full ${
              score >= 80 ? 'bg-green-600' :
              score >= 60 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default ScoreCard