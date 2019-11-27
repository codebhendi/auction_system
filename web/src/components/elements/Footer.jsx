import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

const Footer = () => (
  <div style={{ display: 'flex', background: 'whitesmoke' }}>
    <Container style={{ display: 'flex', marginBottom: '1em', marginTop: '1em' }}>
      <Grid container spacing={5}>
        <Grid item xs={12} />
      </Grid>
    </Container>
  </div>
);

Footer.propTypes = {
};

Footer.defaultProps = {
};

export default Footer;
