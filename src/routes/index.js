const express = require('express');
const router = express.Router();

// Initial route
router.get('/', (req, res) => {
    res.send('Hello World!');
})

// Export module
module.exports = router;