const router = require("express").Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("./controller");

router.get("/category", getCategory);
router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

module.exports = router;
