const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const { store, index } = require("./controller");
router.post("./orders", policies_check("create", "order"), store);
router.get("./orders", policies_check("view", "order"), index);

module.exports = router;
