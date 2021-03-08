const express = require('express');
const router = express.Router();
const controller = require('../controllers/workout_controller');

// Request handling with controller
router.get("/",controller.landing_page)
router.get("/exercises",controller.entries_list)
router.get("/new",controller.new_entry)
router.post("/",controller.go_list)
router.post("/exercises",controller.go_new)
router.post("/new",controller.post_new_entry)

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