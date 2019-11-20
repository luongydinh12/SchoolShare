import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...rest} {...props} />
      ) : (
          <Redirect to="/login" />
        )
    }
  />
);
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);

export const PropsRoute = ({ component: Component, ...rest }) => {//this is neater than wrapping it in render lol
  return (
    <Route
      render={props =>
        <Component {...rest} {...props} />
      }
    />
  )
}