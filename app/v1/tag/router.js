const router = require("express").Router();

const { createTag, getTag, updateTag, deleteTag } = require("./controller");

router.get("/tag", getTag);
router.post("/tag", createTag);
router.put("/tag/:id", updateTag);
router.delete("/tag/:id", deleteTag);

module.exports = router;
