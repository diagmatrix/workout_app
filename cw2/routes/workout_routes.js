const express = require('express');
const router = express.Router();
const auth = require("../auth/auth");
const {ensureLoggedIn} = require("connect-ensure-login");
const controller = require("../controllers/app_controller");

// ------------------------------------------------------------
// LANDING PAGE
router.get("/",controller.landing_page)

// ------------------------------------------------------------
// USER HANDLING
// Register user
router.get("/register",controller.register)
router.post("/register",controller.post_register)
// Login user
router.get("/login",controller.login)
router.post("/login",auth.authorize("/login"),controller.post_login)
// Logout
router.get("/logout",controller.logout)
// Main user page
router.get("/:profile",ensureLoggedIn("/login"),controller.userpage)

// ------------------------------------------------------------
// PLAN SHARING
router.get("/:profile/shared/:id",controller.shared_plan)

// ------------------------------------------------------------
// TRAINING PLAN HANDLING
// New exercises
router.get("/:profile/plan",ensureLoggedIn("/login"),controller.show_plan)
router.get("/:type/new",ensureLoggedIn("/login"),controller.new_exercise)
router.post("/:type/new",ensureLoggedIn("/login"),controller.post_new_exercise)

// Complete exercises
router.get("/:type/complete/:id",ensureLoggedIn("/login"),controller.complete_exercise)

// Modify exercises
router.get("/:type/modify/:id",ensureLoggedIn("/login"),controller.modify_exercise)
router.post("/:type/modify/:id",ensureLoggedIn("/login"),controller.post_modify_exercise)

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