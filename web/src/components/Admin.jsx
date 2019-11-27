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

import urls from '../urls';

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

// Class to edit and hadle users and auction details
class Admin extends Component {
  state = { loading: false, rides: [] }

  componentDidMount = () => this.obtainUsers()

  obtainUsers = () => {
    const { token } = this.props;

    const options = {
      url: `${urls.url}/auth/user/get/all`,
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
        <Link to="/admin/category/add">Add Category</Link>
        <Card className={classes.cardStyle}>
          <Typography variant="h4">Send App Notification</Typography>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>CreatedAt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link to={`/admin/user/${row.id}`}>{row.id}</Link>
                  </TableCell>
                  <TableCell>
                    {row.email}
                  </TableCell>
                  <TableCell>
                    {row.full_name}
                  </TableCell>
                  <TableCell>
                    {row.created_at}
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

Admin.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    marginStyle: PropTypes.string,
    chips: PropTypes.string,
    cardStyle: PropTypes.string,
  }).isRequired,
};

Admin.defaultProps = {
  user: null,
};

export default withStyles(useStyles)(Admin);
