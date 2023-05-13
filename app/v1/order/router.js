const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const { store, index } = require("./controller");
router.post("./orders", policies_check("create", "Order"), store);
router.get("./orders", policies_check("view", "Order"), index);

module.exports = router;
