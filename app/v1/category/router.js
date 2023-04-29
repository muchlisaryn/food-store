const router = require("express").Router();
const { policies_check } = require("../../../middlewares");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("./controller");

router.get("/category", getCategory);
router.post("/category", policies_check("create", "Category"), createCategory);
router.put(
  "/category/:id",
  policies_check("update", "Category"),
  updateCategory
);
router.delete(
  "/category/:id",
  policies_check("delete", "Category"),
  deleteCategory
);

module.exports = router;
