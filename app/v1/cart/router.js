const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const { update, getCart } = require("./controller");

router.put("/cart", policies_check("update", "Cart"), update);
router.get("/cart", policies_check("read", "Cart"), getCart);

module.exports = router;
