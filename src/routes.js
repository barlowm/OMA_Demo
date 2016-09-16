const express = require('express');
const Controller = require('./controller');

const router = express.Router();

router.use(Controller.dfltEntry);
router.route('/').get(Controller.getData);
router.route('/').post(Controller.postData);

module.exports = router;