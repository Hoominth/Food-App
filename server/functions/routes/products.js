const express = require('express');
const router = require('express').Router();
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
let endpointSecret;
// Create product
router.post('/create-product', async (req, res) => {
  try {
    const id = Date.now();
    const data = {
      productId: id,
      productName: req.body.productName,
      productCategory: req.body.productCategory,
      productPrice: req.body.productPrice,
      imageURL: req.body.imageURL,
    };
    const respone = await db.collection('products').doc(`/${id}/`).set(data);
    return res.status(200).send({ success: true, data: respone });
  } catch (err) {
    return res.send({ success: false, message: `Error: ${err}` });
  }
});

// Get all product
router.get('/get-products', (req, res) => {
  (async () => {
    try {
      const query = db.collection('products');
      let respone = [];
      await query.get().then((querysnap) => {
        const docs = querysnap.docs;
        docs.map((doc) => {
          respone.push({ ...doc.data() });
        });
        return respone;
      });

      return res.status(200).send({ success: true, data: respone });
    } catch (err) {
      return res.send({ success: false, msg: `Error : ${err}` });
    }
  })();
});

// Delete one product
router.delete('/delete-product/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    await db
      .collection('products')
      .doc(`/${productId}/`)
      .delete()
      .then((result) => {
        return res.status(200).send({ success: true, data: result });
      });
  } catch (err) {
    return res.send({ success: false, msg: `Error : ${err}` });
  }
});

// create a cart
router.post('/addToCart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;
  // const docRef = await db
  //   .collection('cardItems')
  //   .doc(`/${userId}/`)
  //   .collection('items')
  //   .doc(`/${productId}/`);
  // docRef
  //   .get()
  //   .then(async (doc) => {
  //     if (doc.exists) {
  //       console.log('oke');
  //       const quantity = doc.data().quantity + 1;
  //       const updatedItem = await db
  //         .collection('cardItems')
  //         .doc(`/${userId}/`)
  //         .collection('items')
  //         .doc(`/${productId}/`)
  //         .update({ quantity });
  //       console.log(quantity, updatedItem);
  //       return res.status(200).send({ success: true, data: updatedItem });
  //     } else {
  //       console.log('create');
  //       const data = {
  //         productId,
  //         productName: req.body.productName,
  //         productCategory: req.body.productCategory,
  //         productPrice: req.body.productPrice,
  //         imageURL: req.body.imageURL,
  //         quantity: 1,
  //       };
  //       const addItems = await db
  //         .collection('cardItems')
  //         .doc(`/${userId}/`)
  //         .collection('items')
  //         .doc(`/${productId}/`)
  //         .set(data);
  //       return res.status(200).send({ success: true, data: addItems });
  //     }
  //   })
  //   .catch((err) => {
  //     return res.send({ success: false, msg: `Error : ${err}` });
  //   });
  try {
    const doc = await db
      .collection('cartItems')
      .doc(`/${userId}/`)
      .collection('items')
      .doc(`/${productId}/`)
      .get();

    if (doc.data()) {
      console.log('oke');
      const quantity = doc.data().quantity + 1;
      const updatedItem = await db
        .collection('cartItems')
        .doc(`/${userId}/`)
        .collection('items')
        .doc(`/${productId}/`)
        .update({ quantity });
      console.log(updatedItem);
      return res.status(200).send({ success: true, data: updatedItem });
    } else {
      console.log('create');
      const data = {
        productId,
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productPrice: req.body.productPrice,
        imageURL: req.body.imageURL,
        quantity: 1,
      };
      const addItems = await db
        .collection('cartItems')
        .doc(`/${userId}/`)
        .collection('items')
        .doc(`/${productId}/`)
        .set(data);
      console.log(addItems);
      return res.status(200).send({ success: true, data: addItems });
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error : ${err}` });
  }
});
// update cart to increase and decrease the quantity
router.post('/updateCart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const productId = req.query.productId;
  const type = req.query.type;
  try {
    const doc = await db
      .collection('cartItems')
      .doc(`/${userId}/`)
      .collection('items')
      .doc(`/${productId}/`)
      .get();

    if (doc.exists) {
      if (type === 'increment') {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection('cartItems')
          .doc(`/${userId}/`)
          .collection('items')
          .doc(`/${productId}/`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        if (doc.data().quantity === 1) {
          await db
            .collection('cartItems')
            .doc(`/${userId}/`)
            .collection('items')
            .doc(`/${productId}/`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const quantity = doc.data().quantity - 1;
          const updatedItem = await db
            .collection('cartItems')
            .doc(`/${userId}/`)
            .collection('items')
            .doc(`/${productId}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error : ${err}` });
  }
});

// get all the cartItems for that user
router.get('/getCartItems/:userId', async (req, res) => {
  const userId = req.params.userId;
  (async () => {
    try {
      const query = await db
        .collection('cartItems')
        .doc(`/${userId}/`)
        .collection('items');

      const respone = [];
      await query.get().then((querysnap) => {
        const docs = querysnap.docs;

        docs.map((doc) => {
          respone.push({ ...doc.data() });
        });
        return respone;
      });
      return res.status(200).send({ success: true, data: respone });
    } catch (err) {
      return res.send({ success: false, msg: `Error : ${err}` });
    }
  })();
});

router.post('/create-checkout-session', async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.data.user.user_id,
      cart: JSON.stringify(req.body.data.cart),
      total: req.body.data.total,
    },
  });
  const line_items = req.body.data.cart.map((item) => {
    return {
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.productName,
          images: [item.imageURL],
          metadata: {
            id: item.productId,
          },
        },
        unit_amount: item.productPrice * 100,
      },
      quantity: item.quantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: { allowed_countries: ['IN'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'inr' },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: { unit: 'hour', value: 2 },
            maximum: { unit: 'hour', value: 4 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    customer: customer.id,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/`,
  });
  res.send({ url: session.url });
});

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'];
    let eventType;
    let data;
    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === 'checkout.session.completed') {
      stripe.customers.retrieve(data.customer).then((customer) => {
        console.log(customer);
        createOrder(customer, data, res);
      });
    }
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);

const createOrder = async (customer, intent, res) => {
  console.log('inside the orders');
  try {
    const orderId = Date.now();
    const data = {
      intentId: intent.id,
      orderId,
      amount: intent.amount_total,
      created: intent.created,
      payment_method_types: intent.payment_method_types,
      status: intent.status,
      customer: intent.customer_details,
      shipping_details: intent.shipping_details,
      userId: customer.metadata.user_id,
      items: JSON.parse(customer.metadata.cart),
      total: customer.metadata.total,
      sts: 'preparing',
    };
    await db.collection('orders').doc(`/${orderId}/`).set(data);

    deleteCart(customer.metadata.userId, JSON.parse(customer.metadata.cart));
    return res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
  }
};

const deleteCart = (userId, items) => {
  console.log('inside the delete');
  items.map(async (data) => {
    await db
      .collection('cartItems')
      .doc(`/${userId}/`)
      .collection('items')
      .doc(`/${data.productId}/`)
      .delete()
      .then(() => console.log('success'));
  });
};

// orders
router.get('/orders', (req, res) => {
  (async () => {
    try {
      const query = db.collection('orders');
      let respone = [];
      await query.get().then((querysnap) => {
        const docs = querysnap.docs;
        docs.map((doc) => {
          respone.push({ ...doc.data() });
        });
        return respone;
      });

      return res.status(200).send({ success: true, data: respone });
    } catch (err) {
      return res.send({ success: false, msg: `Error : ${err}` });
    }
  })();
});

// update the order status
router.post('/update-order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const sts = req.query.sts;

  try {
    const updatedItem = await db
      .collection('orders')
      .doc(`/${orderId}/`)
      .update({ sts });
    return res.status(200).send({ success: true, data: updatedItem });
  } catch (err) {
    return res.send({ success: false, msg: `Error : ${err}` });
  }
});
module.exports = router;
