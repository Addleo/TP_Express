const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/stylesheets/style.css', function(req, res, next) {
  res.send('reponse du server');
});

module.exports = router;
