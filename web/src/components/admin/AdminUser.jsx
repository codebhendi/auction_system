import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/styles/withStyles';
import axios from 'axios';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

import url from '../../urls';

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

class AdminUser extends Component {
  state = {
    email: '',
    address: '',
    fullName: '',
    admin: false,
    active: false,
    requesting: false,
  }

  componentDidMount = () => this.getUser()

  getUser = () => {
    const { match: { params: { id } }, token } = this.props;

    const options = {
      method: 'get',
      url: `${url.url}/auth/user/get/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    this.setState({ requesting: true });

    axios(options)
      .then((data) => {
        const {
          email, full_name: fullName, address, is_active: active, is_admin: admin,
        } = data.data.message;

        this.setState({
          email, fullName, address, active, admin,
        });
      }).catch((error) => {
        console.log(error);
        toast.error('Unable to obtain user data');
      })
      .finally(() => this.setState({ requesting: false }));
  }

  // handle login form input changes to store them in state
  handleChange = (event) => {
    const {
      target: {
        name, value, checked, type,
      },
    } = event;
    const finalValue = type === 'checkbox' ? checked : value;

    this.setState({ [name]: finalValue });
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
      email, requesting, address, fullName, admin, active,
    } = this.state;
    const { token, match: { params: { id } } } = this.props;

    if (!email || !address || !fullName) {
      toast.error('Error, address or full name is empty');
      return;
    }

    if (requesting === true) return;

    // maingtaining request state and sending authentication request
    this.setState({ requesting: true });

    const options = {
      method: 'post',
      url: `${url.url}/auth/user/save/${id}`,
      data: {
        email: email.trim().toLocaleLowerCase(), fullName, address, active, admin,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    axios(options)
      .then(() => toast.success('Saved user changes'))
      .catch((error) => {
        console.log(error);
        toast.error('Error in saving updates');
      })
      .finally(() => this.setState({ requesting: false }));
  }

  handleKeyPress= (event) => {
    if (event.key === 'Enter') this.handleSubmit();
  }

  render = () => {
    const { user, classes } = this.props;
    const {
      requesting, email, fullName, address, admin, active,
    } = this.state;

    if (!user || !user.is_admin) return <Redirect to="/" />;

    return (
      <Container>
        <div className="login-container">
          <Card className="form-card">
            <div className="photo-cover">
              <CardContent
                title="User Edit"
                className="form-heading"
              >
                <Typography variant="h4" component="h2" className="white-bold">
                  User Edit
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
              <FormControlLabel
                control={(
                  <Switch
                    checked={active}
                    onChange={this.handleChange}
                    color="primary"
                    name="active"
                  />
                )}
                label="Active"
              />
              <br />
              <br />
              <FormControlLabel
                control={(
                  <Switch
                    checked={admin}
                    onChange={this.handleChange}
                    color="primary"
                    name="admin"
                  />
                )}
                label="Admin"
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
          </Card>
        </div>
        <ToastContainer position="bottom-right" hideProgressBar />
      </Container>
    );
  }
}

AdminUser.propTypes = {
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
    buttonProgress: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({
    is_admin: PropTypes.bool,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default withStyles(useStyles)(AdminUser);
