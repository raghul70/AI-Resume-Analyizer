import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const SkillList = ({ skills, type = 'found', title }) => {
  const isFound = type === 'found'
  const Icon = isFound ? CheckCircleIcon : XCircleIcon
  const bgColor = isFound ? 'bg-green-100' : 'bg-red-100'
  const textColor = isFound ? 'text-green-700' : 'text-red-700'
  const iconColor = isFound ? 'text-green-600' : 'text-red-600'

  if (!skills || skills.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold mb-4">{title || (isFound ? 'Skills Found' : 'Missing Skills')}</h3>
        <p className="text-gray-500 text-center py-4">
          {isFound ? 'No skills found' : 'No missing skills - Perfect match!'}
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span>{title || (isFound ? 'Skills Found' : 'Missing Skills')}</span>
        <span className="text-sm text-gray-500">({skills.length})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`px-3 py-1 ${bgColor} ${textColor} rounded-full text-sm font-medium`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default SkillList