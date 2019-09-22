import React from 'react'
import { Link } from 'react-router-dom'

const ProfileActions = () => (
  <div className="btn-group mb-4" role="group">
    <Link to="/edit-profile" >
      <button className="btn btn-large waves-effect waves-light hoverable green accent-3" > Edit Profile </button>
    </Link>

  </div>
)

export default ProfileActions