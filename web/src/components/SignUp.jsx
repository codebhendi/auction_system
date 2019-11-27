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
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

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

class Signup extends Component {
  state = {
    email: '',
    password: '',
    reenterPassword: '',
    address: '',
    fullName: '',
    requesting: 0,
    error: 0,
  }

  // handle login form input changes to store them in state
  handleChange = (event) => {
    const { target: { name, value } } = event;

    this.setState({
      [name]: value,
    });
  }

  checkListVerify = (email, password, reenterPassword, address, fullName) => {
    let flag = true;

    if (!email) {
      toast.error('Please enter email');
      flag = false;
    }

    if (!address) {
      toast.error('Please enter address');
      flag = false;
    }

    if (!fullName) {
      toast.error('Please enter full name');
      flag = false;
    }

    if (!password || !reenterPassword) {
      toast.error('Please enter password');
      flag = false;
    }

    if (password !== reenterPassword) {
      toast.error('Passwords do not match');
      flag = false;
    }

    return flag;
  }

  // method to submit login form so that the user can be authenticated
  handleSubmit = () => {
    // obtaining required states
    const {
      email, password, requesting, reenterPassword, address, fullName,
    } = this.state;

    const check = this.checkListVerify(email, password, reenterPassword, address, fullName);

    // validating parameters
    if (!check) return;

    if (requesting === 1) {
      return;
    }

    // maingtaining request state and sending authentication request
    this.setState({
      requesting: 1, error: 0,
    });

    const options = {
      method: 'post',
      url: `${url.url}/auth/register`,
      data: {
        email: email.trim().toLocaleLowerCase(), password, fullName, address,
      },
    };

    axios(options)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ success: true });

          setTimeout(() => this.setState({ redirectTo: true }), 1000);
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
      requesting, error, password, email, reenterPassword, success, redirectTo, fullName,
      address,
    } = this.state;

    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    if (redirectTo) return <Redirect to="/auth/login" />;

    return (
      <Container>
        <div className="login-container">
          <Card className="form-card">
            <div className="photo-cover">
              <CardContent
                title="Sign Up"
                className="form-heading"
              >
                <Typography variant="h4" component="h2" className="white-bold">
                  Sign Up
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
                label="Full Name"
                margin="normal"
                variant="outlined"
                placeholder="Full Name"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                name="fullName"
                onChange={this.handleChange}
                value={fullName || ''}
              />
              <br />
              <br />
              <TextField
                label="Address"
                margin="normal"
                variant="outlined"
                placeholder="address"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                name="address"
                onChange={this.handleChange}
                value={address || ''}
              />
              <br />
              <br />
              <TextField
                label="Enter Password"
                type="password"
                placeholder="Password"
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
              <TextField
                label="Re-enter Password"
                type="password"
                placeholder="Password"
                margin="normal"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                name="reenterPassword"
                onChange={this.handleChange}
                value={reenterPassword || ''}
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
              <Link to="/auth/login">Log In</Link>
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
            {success && (
              <Typography variant="h4">
                Successfull signed up. Redirecting to login.
              </Typography>
            )}
          </Card>
        </div>
        <ToastContainer position="bottom-right" hideProgressBar />
      </Container>
    );
  }
}

Signup.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
    buttonProgress: PropTypes.string,
  }).isRequired,
};

export default withStyles(useStyles)(Signup);
