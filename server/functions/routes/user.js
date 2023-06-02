const router = require('express').Router();
const admin = require('firebase-admin');
let data = [];

router.get('/', (req, res) => {
  return res.send('Hello World');
});

router.get('/jwtVerification', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ msg: 'Token Not Found' });
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return res
        .status(500)
        .json({ success: false, msg: 'Unauthorized access' });
    }
    return res.status(200).json({ success: true, user: decoded });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in extracting the token : ${err}`,
    });
  }
});

const listAllUsers = async (nextPageToken) => {
  admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        data.push(userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((err) => console.log(err));
};

listAllUsers();

router.get('/get-users', async (req, res) => {
  listAllUsers();
  try {
    return res
      .status(200)
      .send({ success: true, data: data, dataCount: data.length });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in  listing users : ${err}`,
    });
  }
});

module.exports = router;
