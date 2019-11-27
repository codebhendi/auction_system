import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    const { isLoggedIn, user } = this.props;

    return (
      <Container>
        <Typography variant="h2">Welcome user</Typography>
        <br />
        <br />
        {(!isLoggedIn || !user) ? (
          <Link to="/login">Please log in to use booking service</Link>
        ) : (
          <Fragment>
            <Link to="/auction/item">Add an Item for auction</Link>
            <br />
            <br />
            <Link to="/auction/bid">Bid on an item</Link>
            <br />
            <br />
            <Link to="/auction/bid/all">Checkout your bids</Link>
            <br />
            <br />
          </Fragment>
        )}
      </Container>
    );
  }
}

Home.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
};

Home.defaultProps = { user: null };

export default Home;
