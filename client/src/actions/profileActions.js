import axios from 'axios'
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
} from './types'

// Profile loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING,
})

// GET current profile
export const getCurrentProfile = () => (dispatch) => {
  // Let reducer know that content is loading
  dispatch(setProfileLoading())
  // Getting profile
  axios
    .get('api/profile')
    // Dispatch GET_PROFILE to reducer
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data,
    }))
    // If no profile found, dispatch GET_PROFILE with empty object
    .catch(() => dispatch({
      type: GET_PROFILE,
      payload: {},
    }))
}

// GET profile by handle
export const getProfileByHandle = handle => (dispatch) => {
  dispatch(setProfileLoading())
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data,
    }))
    .catch(() => dispatch({
      type: GET_PROFILE,
      payload: null,
    }))
}

// Create profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post('/api/profile', profileData)
    .then(() => history.push('/dashboard'))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }))
}




// Get all profiles
export const getProfiles = () => (dispatch) => {
  dispatch(setProfileLoading())
  axios
    .get('/api/profile/all')
    .then(res => dispatch({
      type: GET_PROFILES,
      payload: res.data,
    }))
    .catch(() => dispatch({
      type: GET_PROFILES,
      payload: null,
    }))
}

// Delete account and profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm('Are you sure? This cannot be undone!')) {
    axios
      .delete('/api/profile')
      .then(() => dispatch({
        type: SET_CURRENT_USER,
        payload: {},
      }))
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      }))
  }
}

// Clear profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE,
})