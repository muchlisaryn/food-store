const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const {
  createDeliveryAddress,
  updateDeliveryAddress,
  getDelivery,
  destroy,
} = require("./controller");

router.get(
  "/delivery-addresses",
  policies_check("view", "DeliveryAddress"),
  getDelivery
);
router.post(
  "/delivery-addresses",
  policies_check("create", "DeliveryAddress"),
  createDeliveryAddress
);
router.put(
  "/delivery-addresses/:id",
  policies_check("update", "DeliveryAddress"),
  updateDeliveryAddress
);
router.delete(
  "/delivery-addresses/:id",
  policies_check("delete", "DeliveryAddress"),
  destroy
);

module.exports = router;
