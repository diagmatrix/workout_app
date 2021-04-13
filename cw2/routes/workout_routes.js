const express = require('express');
const router = express.Router();
const controller = require('../controllers/workout_controller');

// Request handling with controller
router.get("/",controller.landing_page)
router.get("/:type/new",controller.new_entry)
router.post("/:type/new",controller.post_new_entry)

// Other requests
router.use(function(req,res) {     
    res.status(404);     
    res.type("text/plain");     
    res.send("404 Not found."); 
}) 

router.use(function(err,req,res,next) {     
    res.status(500);     
    res.type("text/plain");     
    res.send("Internal Server Error."); 
}) 

// To make router accessible form index.js
module.exports = router;