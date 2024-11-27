// components/StarRating.tsx

import React from 'react'

interface StarRatingProps {
  rating: number
  maxStars?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const clampedRating = Math.min(Math.max(rating, 0), maxStars)

  const fullStars = Math.floor(clampedRating)
  const hasHalfStar = clampedRating % 1 >= 0.5

  const stars = Array.from({ length: maxStars }, (_, index) => {
    if (index < fullStars) {
      return '★'
    }
    if (index === fullStars && hasHalfStar) {
      return '☆'
    }
    return '☆'
  })

  return (
    <div className="flex items-center">
      {stars.map((star, index) => (
        <span key={index} className={`relative text-xl text-yellow-400`}>
          {star}
          {index === fullStars && hasHalfStar && (
            <span
              className="absolute inset-0 text-xl text-yellow-400"
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }}
            >
              ★
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

export default StarRating
