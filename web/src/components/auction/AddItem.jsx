import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

class AddItem extends Component {
  state = { loading: false, categories: [] }

  componentDidMount = () => this.getCategories()

  getCategories = () => {
    const { token } = this.props;

    const options = {
      url: `${urls.url}/category/all`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    this.setState({ loading: true });

    Axios(options)
      .then((data) => {
        const dataArr = data.data.message;
        this.setState({ categories: dataArr });
      })
      .catch(err => console.log(err) || toast.error('Error obtaining cabs near you'))
      .finally(() => this.setState({ loading: false }));
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { token } = this.props;
    const {
      category, description, startingPrice, productTitle, productDescription,
      minBidIncrement,
    } = this.state;

    if (!category || !productTitle || !startingPrice || !minBidIncrement) {
      toast.error('Please fill required fields');
      return;
    }

    const options = {
      url: `${urls.url}/item/create`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        category,
        description,
        startingPrice,
        productTitle,
        productDescription,
        minBidIncrement,
      },
    };

    this.setState({ loading: true });

    Axios(options)
      .then((data) => {
        this.setState({ item: data.data.message });

        toast.success('Item added for auction');

        setTimeout(() => {
          this.setState({ redirectTo: true });
        }, 1000);
      })
      .catch(err => console.log(err) || toast.error('Error in adding that item'))
      .finally(() => this.setState({ loading: false }));
  }

  render = () => {
    const {
      loading, categories, productTitle, productDescription, redirectTo, item,
      minBidIncrement, startingPrice,
    } = this.state;
    const { classes } = this.props;

    if (redirectTo) return <Redirect to={`/auction/${item}`} />;

    return (
      <div style={{ height: '100%', width: '50%' }}>
        <Card className={classes.cardStyle}>
          <Typography variant="h4">Add item for bidding</Typography>
          <br />
          <br />
          <TextField
            label="Item Title"
            variant="outlined"
            name="productTitle"
            fullWidth
            onChange={this.handleChange}
            value={productTitle || ''}
            autoFocus
          />
          <br />
          <br />
          <Autocomplete
            options={categories}
            getOptionLabel={option => option.name}
            style={{ width: '100%' }}
            onChange={(e, v) => (
              this.handleChange({ target: { name: 'category', value: v.name } })
            )}
            renderInput={params => (
              <TextField {...params} label="Combo box" variant="outlined" fullWidth />
            )}
          />
          <br />
          <br />
          <TextField
            label="Starting Price"
            variant="outlined"
            type="number"
            name="startingPrice"
            fullWidth
            onChange={this.handleChange}
            value={startingPrice || ''}
            autoFocus
          />
          <br />
          <br />
          <TextField
            label="Min Bidding Price Increase"
            variant="outlined"
            type="number"
            name="minBidIncrement"
            fullWidth
            onChange={this.handleChange}
            value={minBidIncrement || ''}
            autoFocus
          />
          <br />
          <br />
          <TextField
            label="Product Description"
            variant="outlined"
            name="productDescription"
            fullWidth
            onChange={this.handleChange}
            value={productDescription || ''}
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
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

AddItem.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    marginStyle: PropTypes.string,
    chips: PropTypes.string,
    cardStyle: PropTypes.string,
    buttonProgress: PropTypes.string,
    wrapper: PropTypes.string,
  }).isRequired,
};

AddItem.defaultProps = {
  user: null,
};

export default withStyles(useStyles)(AddItem);
