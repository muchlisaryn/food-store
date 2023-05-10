const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const {
  createDeliveryAddress,
  updateDeliveryAddress,
  getDelivery,
  destroy,
} = require("./controller");

router.get(
  "./delivery-address",
  policies_check("view", "DeliveryAddress"),
  getDelivery
);
router.post(
  "./delivery-address",
  policies_check("create", "DeliveryAddress"),
  createDeliveryAddress
);
router.put(
  "./delivery-address/:id",
  policies_check("update", "DeliveryAddress"),
  updateDeliveryAddress
);
router.delete(
  "./delivery-address/:id",
  policies_check("delete", "DeliveryAddress"),
  destroy
);

module.exports = router;
