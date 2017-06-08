var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users.js');


router.post('/transaction', UserController.transaction);

router.get('/history', UserController.history);


module.exports = router;
