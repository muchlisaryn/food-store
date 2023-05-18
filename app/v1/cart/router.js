const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const { update, getCart, insert, deleteCart } = require("./controller");

router.post("/carts", policies_check("create", "Cart"), insert);
router.put("/carts", policies_check("update", "Cart"), update);
router.get("/carts", policies_check("read", "Cart"), getCart);
router.delete("/carts/:id", policies_check("delete", "Cart"), deleteCart);

module.exports = router;
