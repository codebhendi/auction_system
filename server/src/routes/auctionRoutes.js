const express = require('express');

const knex = require('../db/connection');
const authHelpers = require('../auth/_helpers');

const router = express.Router();

// Get route to get all bids on an item.
router.post('/item/bids/add/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  const { id } = req.params;
  const { biddingValue } = req.body;

  return knex.raw(`select bidded_amount, starting_price, min_bid_increment from item full outer join auction_bid_log on auction_bid_log.bidded_item=item.id where item.id=${id} and item_is_active=true order by bidded_amount desc limit 1`)
    .then((data) => {
      const one = data.rows[0];

      if (!one) {
        res.status(500).json({ message: 'No such active item' });
      }

      if (one.bidded_amount && biddingValue - one.bidded_amount < one.min_bid_increment) {
        res.status(500).json({ message: 'Amount to less' });
        return false;
      }

      if (biddingValue - one.starting_price < one.min_bid_increment) {
        res.status(500).json({ message: 'Amount to less' });
        return false;
      }

      return true;
    })
    .then(data => data && knex('auction_bid_log')
      .insert({ bidded_amount: biddingValue, bidder_id: user.id, bidded_item: id })
      .returning('*')
      .then(() => res.status(200).json({ }))
      .catch(err => console.log(err) || res.status(500).json({})))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

// Get route to get all bids on an item.
router.get('/item/bids/all/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  const { id } = req.params;

  return knex('auction_bid_log')
    .where({ 'item.id': id })
    .select('full_name', 'bidded_amount', 'auction_bid_log.id')
    .innerJoin('users', 'users.id', 'bidder_id')
    .innerJoin('item', 'item.id', 'bidded_item')
    .orderBy('auction_bid_log.created_at', 'desc')
    .then(data => res.status(200).json({ message: data }))
    .catch(err => console.log(err) || res.status(500).json({}));
});

// Get route to get all items created by a seller.
// We will use the seller user id to obtain all the items sold or put on bid
// by him.
router.get('/item/get/all', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  return knex('item')
    .where({ is_active: true })
    .select('id', 'is_active', 'starting_price', 'category', 'ended_at', 'product_title')
    .orderBy('created_at')
    .then(data => res.status(200).json({ message: data }))
    .catch(err => console.log(err) || res.status(500).json({}));
});

router.get('/item/get/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) return res.status(401).json({ messge: 'unauthorized' });

  const { id } = req.params;

  return knex('item')
    .select('category', 'product_description', 'seller_id', 'min_bid_increment', 'product_title', 'starting_price', 'ended_at', 'final_price', 'is_active', 'final_price')
    .where({ id })
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

router.post('/item/edit/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) return res.status(401).json({ messge: 'unauthorized' });

  const { id } = req.params;
  const {
    category, productTitle, productDescription, minBidIncrement,
  } = req.body;

  return knex('item')
    .update({
      category,
      product_title: productTitle,
      product_description: productDescription,
      min_bid_increment: minBidIncrement,
    })
    .where({ is_active: true, id, seller_id: user.id })
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

router.post('/item/stop/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) return res.status(401).json({ messge: 'unauthorized' });

  const { id } = req.params;

  return knex.raw(`
    update item set
    is_active=false, ended_at=now(), final_price=(select bidded_amount from auction_bid_log where bidded_item=${id} order by bidded_amount desc limit 1)
    where seller_id=${user.id} and is_active=true and id=${id}
    `)
    .then(() => res.status(200).json({ }))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

router.post('/item/create', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) return res.status(401).json({ message: 'unauthorized' });

  const {
    category, productTitle, productDescription, startingPrice, minBidIncrement,
  } = req.body;

  return knex('item')
    .insert({
      category,
      product_title: productTitle,
      product_description: productDescription,
      starting_price: startingPrice,
      seller_id: user.id,
      min_bid_increment: minBidIncrement,
    })
    .returning('*')
    .then(data => res.status(200).json({ messsage: data[0].id }))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

// Route to authorize user from server and then user data.
// Middeware for user authorization
// @param req: request object
// @param res: response object
router.get('/item/seller/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized', staus: 'error' });
  }

  const { id } = req.params;

  return knex('item')
    .where({ seller_id: user.id, id })
    .select('id', 'is_active', 'category', 'starting_price', 'created_at', 'ended_at', 'final_price', 'product_title', 'product_description', 'bid_increment_time', 'min_bid_increment')
    .orderBy('created_at')
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({}));
});

router.get('/item/seller/bid/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized', staus: 'error' });
  }

  const { id } = req.params;

  return knex('auction_bid_log')
    .where({ bidded_item: id, 'item.seller_id': user.id })
    .select('full_name', 'email', 'auction_bid_log')
    .innerJoin('users', 'auction_bid_log.bidder_id', 'users.id')
    .orderBy('created_at')
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({}));
});

router.post('/category/add', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  console.log(user);

  if (!user || !user.is_admin) return res.status(401).json({ message: 'unauthorized' });

  const { name, description } = req.body;

  return knex('item_category')
    .insert({ name, description, created_by: user.id })
    .returning('*')
    .then(() => res.status(200).json({}))
    .catch(err => console.log(err) || res.status(500).json({ message: err }));
});

router.get('/category/all', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'unauthorized', staus: 'error' });
  }

  return knex('item_category')
    .select('name')
    .orderBy('created_at')
    .then(data => res.status(200).json({ message: data }))
    .catch(err => console.log(err) || res.status(500).json({}));
});

module.exports = router;
