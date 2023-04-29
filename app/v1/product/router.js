const router = require("express").Router();
const os = require("os");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
} = require("./controller");
const { policies_check } = require("../../../middlewares");

router.get("/products", getProduct);
router.get("/products/:id", getOneProduct);
router.post(
  "/products",
  upload.single("image_url"),
  policies_check("create", "Product"),
  createProduct
);
router.delete(
  "/products/:id",
  policies_check("delete", "Product"),
  deleteProduct
);
router.put(
  "/products/:id",
  upload.single("image_url"),
  policies_check("update", "Product"),
  updateProduct
);

module.exports = router;
