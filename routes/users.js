const router = require("express").Router();

/* GET Controllers. */
const userC = require("../controllers/authC");

// Auth
router.post("/login", userC.login);
router.post("/register", userC.addUser);

module.exports = router;
