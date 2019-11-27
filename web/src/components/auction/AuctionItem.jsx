import React, { Component, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import green from '@material-ui/core/colors/green';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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

class AuctionItem extends Component {
  state = { loading: false, bids: [], active: true }

  componentDidMount = () => {
    const { match: { params: { id } } } = this.props;
    this.getAuctionItem(id);
    this.getCategories();
    this.getAllBids(id);
  }

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
      .catch(err => console.log(err) || toast.error('Error obtaining categories'))
      .finally(() => this.setState({ loading: false }));
  }

  getAllBids = (id) => {
    const { token } = this.props;

    const options = {
      url: `${urls.url}/item/bids/all/${id}`,
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
        this.setState({ bids: dataArr });
      })
      .catch(err => console.log(err) || toast.error('Error obtaining item bids'))
      .finally(() => this.setState({ loading: false }));
  }

  getAuctionItem = (id) => {
    const { token } = this.props;

    const options = {
      url: `${urls.url}/item/get/${id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    this.setState({ loading: true, auctionId: id });

    Axios(options)
      .then((data) => {
        const {
          starting_price: startingPrice, seller_id: seller, min_bid_increment: minBidIncrement,
          product_description: productDescription, product_title: productTitle, category,
          is_active: active,
        } = data.data.message;

        this.setState({
          startingPrice,
          seller,
          category,
          productDescription,
          productTitle,
          minBidIncrement,
          active,
        });
      })
      .catch(err => console.log(err) || toast.error('Error obtaining item details'))
      .finally(() => this.setState({ loading: false }));
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { token } = this.props;
    const {
      category, productTitle, productDescription, minBidIncrement, auctionId,
    } = this.state;

    if (!category || !productTitle || !minBidIncrement) {
      toast.error('Please fill required fields');
      return;
    }

    const options = {
      url: `${urls.url}/item/edit/${auctionId}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        category,
        productTitle,
        productDescription,
        minBidIncrement,
      },
    };

    this.setState({ loading: true });

    Axios(options)
      .then(() => toast.success('Successfully edited'))
      .catch(err => console.log(err) || toast.error('Unable to save the current edit'))
      .finally(() => this.setState({ loading: false }));
  }

  handleBidStop = () => {
    const { token } = this.props;
    const { auctionId } = this.state;
    const options = {
      url: `${urls.url}/item/stop/${auctionId}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    this.setState({ loading: true });

    Axios(options)
      .then(() => toast.success('Successfully stopped auction'))
      .catch(err => console.log(err) || toast.error('Unable to stop the auction'))
      .finally(() => this.setState({ loading: false }));
  }

  submitAuction = () => {
    const { token } = this.props;
    const {
      auctionId, biddingValue, minBidIncrement, bids, startingPrice,
    } = this.state;

    if (bids[0] && (biddingValue - bids[0].bidded_amount) < minBidIncrement) {
      toast.error('Increase value by at least min bid');
      return;
    }

    if (biddingValue - startingPrice < minBidIncrement) {
      toast.error('Increase value by at least min bid');
      return;
    }

    const options = {
      url: `${urls.url}/item/bids/add/${auctionId}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { biddingValue },
    };

    this.setState({ loading: true });

    Axios(options)
      .then(() => toast.success('Bid added successfully'))
      .catch(err => console.log(err) || toast.error('Unable to add the bid'))
      .finally(() => this.setState({ loading: false }));
  }

  render = () => {
    const {
      loading, categories, productTitle, productDescription, biddingValue,
      minBidIncrement, startingPrice, seller, category, bids, active,
    } = this.state;
    const { classes, user } = this.props;
    const edit = active ? user.id === seller : false;

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ height: '100%', width: '50%' }}>
          <Card className={classes.cardStyle}>
            <Typography variant="h5">Edit item for bidding</Typography>
            <br />
            <br />
            <TextField
              label="Item Title"
              variant="outlined"
              name="productTitle"
              disabled={!edit}
              fullWidth
              onChange={this.handleChange}
              value={productTitle || ''}
              autoFocus
            />
            <br />
            <br />
            {categories && (
              <TextField
                select
                fullWidth
                required
                disabled={!edit}
                variant="outlined"
                onChange={this.handleChange}
                placeholder="Select a category"
                label="Categoey"
                name="category"
                value={category || ''}
              >
                {categories.map(({ name }) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
              </TextField>
            )}
            <br />
            <br />
            <TextField
              label="Starting Price"
              variant="outlined"
              type="number"
              name="startingPrice"
              fullWidth
              disabled
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
              disabled={!edit}
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
              disabled={!edit}
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
                  color="primary"
                  disabled={!edit}
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
            {edit && (
              <div style={{ display: 'flex' }}>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.handleBidStop}
                    style={{ width: '100%' }}
                    size="large"
                    disabled={loading}
                  >
                    STOP BIDDING
                  </Button>
                  {loading && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                  )}
                </div>
              </div>
            )}
          </Card>
          <ToastContainer position="bottom-right" />
        </div>
        <div style={{ height: '100%', width: '50%' }}>
          <Card className={classes.cardStyle}>
            {!active && <Typography variant="h5" color="secondary">Item auction stopped</Typography>}
            {!edit && active && (
              <Fragment>
                <Typography variant="h5">Bid for the item</Typography>
                <br />
                <br />
                <TextField
                  type="number"
                  label="Your bid"
                  variant="outlined"
                  name="biddingValue"
                  fullWidth
                  onChange={this.handleChange}
                  value={biddingValue || ''}
                  autoFocus
                />
                <br />
                <br />
                <div style={{ display: 'flex' }}>
                  <div className={classes.wrapper}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.submitAuction}
                      style={{ width: '100%' }}
                      size="large"
                      disabled={loading}
                    >
                        SUBMIT
                    </Button>
                    {loading && (
                      <CircularProgress size={24} className={classes.buttonProgress} />
                    )}
                  </div>
                </div>
              </Fragment>
            )}
            <br />
            <Typography variant="h5">Bids</Typography>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Bidded Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(bids || []).map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.full_name}
                    </TableCell>
                    <TableCell>
                      {row.bidded_amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    );
  }
}

AuctionItem.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({ id: PropTypes.number }),
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  classes: PropTypes.shape({
    marginStyle: PropTypes.string,
    chips: PropTypes.string,
    cardStyle: PropTypes.string,
    buttonProgress: PropTypes.string,
    wrapper: PropTypes.string,
  }).isRequired,
};

AuctionItem.defaultProps = {
  user: null,
};

export default withStyles(useStyles)(AuctionItem);
