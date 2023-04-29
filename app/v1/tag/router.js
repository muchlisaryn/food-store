const router = require("express").Router();
const { policies_check } = require("../../../middlewares");
const { createTag, getTag, updateTag, deleteTag } = require("./controller");

router.get("/tag", getTag);
router.post("/tag", policies_check("create", "Tag"), createTag);
router.put("/tag/:id", policies_check("update", "Tag"), updateTag);
router.delete("/tag/:id", policies_check("delete", "Tag"), deleteTag);

module.exports = router;
