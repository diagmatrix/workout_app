const express = require('express');
const router = express.Router();
const controller = require('../controllers/workout_controller');

// Request handling with controller
router.get("/",controller.landing_page)
router.get("/register",controller.register)
router.post("/register",controller.post_register)

// ------------------------------------------------------------
// TRAINING PLAN HANDLING
// New exercises
router.get("/plan",controller.show_plan)
router.get("/:type/new",controller.new_exercise)
router.post("/:type/new",controller.post_new_exercise)

// Complete exercises
router.get("/:type/complete/:id",controller.complete_exercise)

// Modify exercises
router.get("/:type/modify/:id",controller.modify_exercise)
router.post("/:type/modify/:id",controller.post_modify_exercise)

// Delete exercises
router.get("/:type/delete/:id",controller.delete_exercise)

// ------------------------------------------------------------
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