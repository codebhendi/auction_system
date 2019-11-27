import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import green from '@material-ui/core/colors/green';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


import 'react-toastify/dist/ReactToastify.min.css';

import urls from '../../urls';

const useStyles = {
  marginStyle: {
    margin: '1rem 1rem 1rem 0rem',
  },
  cardStyle: {
    margin: '2rem 1rem',
    padding: '1rem',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
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
};

class AddCategory extends Component {
  state = { loading: false }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  addCategory = () => {
    const { token } = this.props;
    const { name, description } = this.state;

    if (!name || !description) {
      toast.error('Please enter a name and description');
      return;
    }

    const options = {
      url: `${urls.url}/category/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { name, description },
    };

    this.setState({ loading: true });

    Axios(options)
      .then(() => {
        toast.success('Cab booking done');
        this.setState({ name: '', description: '' });
      })
      .catch(err => console.log(err) || toast.error('Error in booking that cab'))
      .finally(() => this.setState({ loading: false }));
  }


  render = () => {
    const {
      loading, name, description,
    } = this.state;
    const { classes } = this.props;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Card className={classes.cardStyle}>
          <Typography variant="h4">Item Category</Typography>
          <TextField
            label="Category Title"
            variant="outlined"
            name="name"
            fullWidth
            onChange={this.handleChange}
            value={name || ''}
            autoFocus
          />
          <br />
          <br />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            name="description"
            fullWidth
            onChange={this.handleChange}
            value={description || ''}
            autoFocus
          />
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="secondary"
                disabled={loading}
                onClick={this.handleSubmit}
                style={{ width: '100%' }}
                size="large"
              >
                  SUBMIT
              </Button>
              {loading && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
            </div>
          </div>
        </Card>
        <ToastContainer position="bottom-right" hideProgressBar />
      </div>
    );
  }
}

AddCategory.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
  classes: PropTypes.shape({
    marginStyle: PropTypes.string,
    chips: PropTypes.string,
    cardStyle: PropTypes.string,
    wrapper: PropTypes.string,
    buttonProgress: PropTypes.string,
  }).isRequired,
};

AddCategory.defaultProps = {
  user: null,
};

export default withStyles(useStyles)(AddCategory);
