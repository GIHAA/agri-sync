/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
// PrivateRoute.js
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const isAuthenticated = () => {
  // Replace this with your actual logic to check if the user is authenticated
  // For example, checking if a user token exists in localStorage
  return !!localStorage.getItem('jwtToken')
}

function PrivateRoute({ children }: any) {
  const location = useLocation()

  if (!isAuthenticated()) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
