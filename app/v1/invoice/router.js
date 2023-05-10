const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const getInvoice = require("./controller");

router.get("/invoice/:order_id", policies_check("read", "invoice"), getInvoice);

module.exports = router;
