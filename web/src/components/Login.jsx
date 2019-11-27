import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/styles/withStyles';
import axios from 'axios';
import PropTypes from 'prop-types';

import url from '../urls';

const useStyles = () => ({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);

    // initalizing state to store following
    // email to login with
    // password to login with
    // redirectTo to redirect once authentication is done
    // requesting to maintain state of requests
    // error to segregate requests
    this.state = {
      email: '',
      password: '',
      requesting: 0,
      error: 0,
    };
  }

  // handle login form input changes to store them in state
  handleChange = (event) => {
    const { target: { name, value } } = event;

    this.setState({
      [name]: value,
    });
  }

  // method to submit login form so that the user can be authenticated
  handleSubmit = () => {
    // obtaining required states
    const { email, password, requesting } = this.state;

    // validating parameters
    if (email === '' || password === '') {
      this.setState({
        requesting: 0,
        error: 1,
      });
      return;
    }

    if (requesting === 1) {
      return;
    }

    // maingtaining request state and sending authentication request
    this.setState({
      requesting: 1,
    });

    const options = {
      method: 'post',
      url: `${url.url}/auth/login`,
      data: {
        email: email.trim().toLocaleLowerCase(), password,
      },
    };

    axios(options)
      .then((response) => {
        if (response.status === 200) {
          // once user is authenticated save the token given by api along with
          // the user details obtained
          window.localStorage.setItem('authToken', response.data.token);

          // obtain update user method to update root state variables
          const { updateUser } = this.props;

          // mark the user as logged in and update the remaining variables so
          // that it can be used by other components
          updateUser({
            isLoggedIn: true,
            user: response.data.user,
            token: response.data.token,
          });
        }
      }).catch((error) => {
        console.log('login error');
        console.log(error);
        this.setState({
          requesting: 0,
          error: 1,
        });
      });
  }

  handleKeyPress= (event) => {
    if (event.key === 'Enter') this.handleSubmit();
  }

  render = () => {
    const { isLoggedIn, classes } = this.props;
    const {
      requesting, error, password, email,
    } = this.state;

    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <Container>
        <div className="login-container">
          <Card className="form-card">
            <div className="photo-cover">
              <CardContent
                title="Login"
                className="form-heading"
              >
                <Typography variant="h4" component="h2" className="white-bold">
                  Login
                </Typography>
              </CardContent>
            </div>
            <CardContent onKeyPress={this.handleKeyPress}>
              <br />
              <TextField
                label="Email"
                margin="normal"
                variant="outlined"
                placeholder="Email"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                name="email"
                onChange={this.handleChange}
                value={email || ''}
              />
              <br />
              <br />
              <TextField
                label="Password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                name="password"
                onChange={this.handleChange}
                value={password || ''}
              />
              <br />
              <br />
              <div style={{ display: 'flex' }}>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={requesting === 1}
                    onClick={this.handleSubmit}
                    style={{ width: '100%' }}
                    size="large"
                  >
                     SUBMIT
                  </Button>
                  {requesting === 1 && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                  )}
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Link to="/auth/signup">Sign Up</Link>
            </CardContent>
            {error === 1 && (
              <CardContent>
                <Typography variant="h6" color="error" display="block">
                  Invalid Email or Password
                </Typography>
                <Typography variant="subtitle1" display="block">
                  Pease check your email or password.
                </Typography>
              </CardContent>
            )}
          </Card>
        </div>
      </Container>
    );
  }
}

Login.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
    buttonProgress: PropTypes.string,
  }).isRequired,
};

export default withStyles(useStyles)(Login);
