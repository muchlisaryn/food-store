const router = require("express").Router();
const os = require("os");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");

router.post("/products", upload.single("image_url"), createProduct);
router.get("/products", getProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", upload.single("image_url"), updateProduct);

module.exports = router;
