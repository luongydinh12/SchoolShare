import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // Get first name
    const firstName = profile.user.name.trim().split(' ')[0];

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3 ">
            <h3 className="text-center text-info" 
            style={{ fontFamily: "Urbana", 
            marginRight: "3rem", 
            marginLeft: "3rem",
            paddingTop: "30px",
             }}>
            {firstName}'s Bio</h3>

            <p className="lead" style={{ marginRight: "3rem", marginLeft: "3rem", paddingBottom: "30px" }}>
              {isEmpty(profile.description) ? (
                <span style={{ fontFamily: "Urbana" }}>{firstName} does not have a bio</span>
              ) : (
                  <span style={{ fontFamily: "Urbana", marginLeft: "3rem"}}>{profile.description}</span>
                )}
            </p>
            <hr />

          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
