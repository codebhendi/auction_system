import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Class to scroll components to the top as react-router-dom preserves the
// state and we don't want that.
// Props:
// children: Children which are to be scrolled
// location: Current location or href or url where our page is.
class ScrollToTop extends Component {
  componentDidUpdate = (prevProps) => {
    const { location } = this.props;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render = () => {
    const { children } = this.props;

    return children;
  }
}

ScrollToTop.propTypes = {
  children: PropTypes.shape({}),
  location: PropTypes.shape({}),
};

ScrollToTop.defaultProps = {
  children: null,
  location: null,
};

export default withRouter(ScrollToTop);
