const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const {
  OrderInCart,
  getOrderByUser,
  orderBuyNow,
  destroy,
  getAllOrder,
} = require("./controller");

router.post("/orders", policies_check("create", "Order"), OrderInCart);
router.post("/orders/buy-now", policies_check("create", "BuyNow"), orderBuyNow);
router.delete("/orders/:id", policies_check("delete", "order"), destroy);
router.get("/orders", policies_check("view", "Order"), getOrderByUser);
router.get("/allOrders", policies_check("viewAll", "Order"), getAllOrder);

module.exports = router;
