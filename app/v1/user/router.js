const router = require("express").Router();
const { getAllUser, deleteUser, getOneUser } = require("./controller");

router.get("/user", getAllUser);
router.get("/user/:id", getOneUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
