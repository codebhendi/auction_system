import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import MainLayoutRoute from './components/MainLayoutRoute';
import Admin from './components/Admin';
import AdminUser from './components/admin/AdminUser';
import AddCategory from './components/admin/AddCategory';
import AddItem from './components/auction/AddItem';
import AuctionBid from './components/auction/AuctionBid';
import AuctionItem from './components/auction/AuctionItem';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './App.css';
import urls from './urls';

class App extends Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.authToken;

    if (token) {
      this.state = {
        isLoggedIn: true,
        user: null,
        token,
        checking: true,
      };
    } else {
      this.state = {
        isLoggedIn: false,
        user: null,
        token: null,
        checking: false,
      };
    }
  }

  componentDidMount = () => {
    const { token } = this.state;

    if (!token) {
      return;
    }

    const options = {
      url: `${urls.url}/auth/user/data`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    this.setState({ checking: true });

    axios(options)
      .then((data) => {
        if (data.data.status === 'success') this.setState({ user: data.data.user, isLoggedIn: true });
      })
      .catch(() => this.setState({ user: null, isLoggedIn: false }))
      .finally(() => this.setState({ checking: false }));
  }

  updateUser = userObject => this.setState(userObject)

  render = () => {
    const {
      checking, isLoggedIn, token, user,
    } = this.state;

    if (checking) {
      return <div className="loading" />;
    }

    const props = {
      updateUser: this.updateUser, isLoggedIn, token, user,
    };

    return (
      <Switch>
        <MainLayoutRoute
          exact
          path="/"
          component={Home}
          {...props}
        />
        <MainLayoutRoute
          path="/admin/user/:id"
          component={AdminUser}
          {...props}
        />
        <MainLayoutRoute
          path="/admin/category/add"
          component={AddCategory}
          {...props}
        />
        <MainLayoutRoute
          path="/admin"
          component={Admin}
          {...props}
        />
        <MainLayoutRoute
          path="/auction/bid"
          component={AuctionBid}
          {...props}
        />
        <MainLayoutRoute
          path="/auction/item"
          component={AddItem}
          {...props}
        />
        <MainLayoutRoute
          path="/auction/:id"
          component={AuctionItem}
          {...props}
        />
        <Route path="/auth/login">
          <Login {...props} />
        </Route>
        <Route path="/auth/signup">
          <SignUp {...props} />
        </Route>
      </Switch>
    );
  }
}

export default App;
