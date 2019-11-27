import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import MainLayout from './MainLayout';

// Wrapper component for components needing header and footer
const MainLayoutRoute = ({
  component: NewComponent, updateUser, isLoggedIn, user, token, ...rest
}) => (
  <Route
    {...rest}
    render={matchProps => (
      <MainLayout
        {...matchProps}
        isLoggedIn={isLoggedIn}
        updateUser={updateUser}
        user={user}
        token={token}
      >
        <NewComponent
          {...matchProps}
          isLoggedIn={isLoggedIn}
          updateUser={updateUser}
          user={user}
          token={token}
        />
      </MainLayout>
    )}
  />
);

MainLayoutRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
  updateUser: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
  token: PropTypes.string,
};

MainLayoutRoute.defaultProps = {
  user: null,
  token: null,
};

export default MainLayoutRoute;
