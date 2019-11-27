import React, { Component, Fragment } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from './elements/Header';
import Footer from './elements/Footer';

class MainLayout extends Component {
  state = { visible: false };

  handleClickSidebar = (event) => {
    event.preventDefault();
    const { visible } = this.state;

    this.setState({
      visible: !visible,
    });
  }

  render = () => {
    const { visible } = this.state;
    const {
      children, isLoggedIn, updateUser, user, token,
    } = this.props;

    if (!isLoggedIn || !user) {
      return <Redirect to="/auth/login" />;
    }

    return (
      <Fragment>
        <Header
          isLoggedIn={isLoggedIn}
          updateUser={updateUser}
          user={user}
          token={token}
          handleClickSidebar={this.handleClickSidebar}
          sideBarVisible={visible}
        />
        {children}
        <Footer />
      </Fragment>
    );
  }
}

MainLayout.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  children: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}),
  token: PropTypes.string,
};

MainLayout.defaultProps = {
  user: null,
  token: '',
};

export default withRouter(MainLayout);
