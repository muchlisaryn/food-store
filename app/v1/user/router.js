const router = require("express").Router();
const { getAllUser, deleteUser } = require("./controller");

router.get("/user", getAllUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
