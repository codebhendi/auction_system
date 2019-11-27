import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/styles/withStyles';

const useStyles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '1rem',
  },
  title: {
    flexGrow: 1,
  },
  linkStyle: {
    color: 'white', textDecoration: 'none', fontSize: '2rem',
  },
};

// Header component of our web page.
// Has navigation links which use the Link component
// to create anchors as normal anchor tag will reload
// the page which we don't want
class Header extends Component {
  logout = () => {
    const { updateUser } = this.props;

    console.log('logging out');

    window.localStorage.clear();

    updateUser({
      isLoggedIn: false,
      username: null,
      user: null,
    });
  }

  render = () => {
    const { isLoggedIn, classes, user } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ fontSize: '2rem' }} className={classes.linkStyle}>Home</Link>
          </Typography>
          {isLoggedIn && user && (
            <Fragment>
              {user.is_admin && (
                <Typography variant="h6" className={classes.title}>
                  <Link to="/admin" style={{ fontSize: '2rem' }} className={classes.linkStyle}>Admin</Link>
                </Typography>
              )}
            </Fragment>
          )}
          {isLoggedIn ? (
            <Button color="secondary" onClick={this.logout}>Logout</Button>
          ) : (
            <Link to="/login"><Button color="primary" variant="contained">Login</Button></Link>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    is_admin: PropTypes.bool,
  }).isRequired,
  classes: PropTypes.shape({
    menuButton: PropTypes.string,
    linkStyle: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

Header.defaultProps = {};


export default withStyles(useStyles)(Header);
