import React from 'react'
import { Link } from 'react-router-dom'

const GroupActions = () => (
  <div className="btn-group mb-4" role="group">
    <Link to="/groups" >
      <button className="btn btn-large waves-effect waves-light hoverable green accent-3" > Groups</button>
    </Link>

  </div>
)

export default GroupActions