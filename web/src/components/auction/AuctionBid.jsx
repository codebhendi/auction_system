import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/styles/withStyles';
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
};

class AuctionBid extends Component {
  state = { loading: false, rides: [] }

  componentDidMount = () => this.obtainBidds()

  obtainBidds = () => {
    const { token } = this.props;

    const options = {
      url: `${urls.url}/item/get/all`,
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
        this.setState({ rides: dataArr });
      })
      .catch(err => console.log(err) || toast.error('Error in obtaining ride data'))
      .finally(() => this.setState({ loading: false }));
  }

  render = () => {
    const { isLoggedIn, user } = this.props;
    const { loading, rides } = this.state;
    const { classes } = this.props;

    if (!isLoggedIn || !user) return <Redirect to="/login" />;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        {loading && (
          <div>
            <LinearProgress />
            <LinearProgress color="secondary" />
          </div>
        )}
        <Card className={classes.cardStyle}>
          <Typography variant="h4">Bid on an item</Typography>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Starting Price</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link to={`/item/${row.id}`}>{row.id}</Link>
                  </TableCell>
                  <TableCell>
                    {row.product_title}
                  </TableCell>
                  <TableCell>
                    {row.starting_price}
                  </TableCell>
                  <TableCell>
                    {row.category}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

AuctionBid.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    marginStyle: PropTypes.string,
    chips: PropTypes.string,
    cardStyle: PropTypes.string,
  }).isRequired,
};

AuctionBid.defaultProps = {
  user: null,
};

export default withStyles(useStyles)(AuctionBid);
