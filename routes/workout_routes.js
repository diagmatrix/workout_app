const express = require('express');
const router = express.Router();
const auth = require("../auth/auth");
const {ensureLoggedIn} = require("connect-ensure-login");
const controller = require("../controllers/app_controller");

// ------------------------------------------------------------
// LANDING PAGE
router.get("/",controller.landing_page)

// ------------------------------------------------------------
// PLAN SHARING
router.get("/:profile/calendar/:week-share",ensureLoggedIn("/login"),controller.share_plan)
router.get("/shared-:id",controller.show_shared_plan)

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
router.get("/:profile",ensureLoggedIn("/login"),controller.ensure_username_match,controller.userpage)

// ------------------------------------------------------------
// CALENDAR PAGE
router.get("/:profile/calendar",ensureLoggedIn("/login"),controller.ensure_username_match,controller.calendar)
router.post("/:profile/calendar",ensureLoggedIn("/login"),controller.new_calendar_week)

// ------------------------------------------------------------
// STATS PAGE
router.get("/:profile/stats",ensureLoggedIn("/login"),controller.ensure_username_match,controller.stats)
router.post("/:profile/stats",ensureLoggedIn("/login"),controller.change_exercise_stats)

// ------------------------------------------------------------
// RECORDS PAGE
router.get("/:profile/records",ensureLoggedIn("/login"),controller.ensure_username_match,controller.records)

// ------------------------------------------------------------
// TRAINING PLAN HANDLING
// New plan
router.get("/:profile/calendar/:week-new",ensureLoggedIn("/login"),controller.ensure_username_match,controller.new_plan)
router.post("/:profile/calendar/:week-new",ensureLoggedIn("/login"),controller.post_new_plan)
// New exercise
router.get("*/new-:type",ensureLoggedIn("/login"),controller.new_exercise)
router.post("*/new-:type",ensureLoggedIn("/login"),controller.post_new_exercise)
// Complete exercise
router.get("*/complete-:type-:id",ensureLoggedIn("/login"),controller.complete_exercise)
// Modify exercise
router.get("*/modify-:type-:id",controller.modify_exercise)
router.post("*/modify-:type-:id",controller.post_modify_exercise)
// Delete exercise
router.get("*/delete-:type-:id",controller.delete_exercise)

// ------------------------------------------------------------
// OTHER REQUESTS
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