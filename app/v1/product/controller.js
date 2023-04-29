const path = require("path");
const fs = require("fs");
const config = require("../../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount, category, tags } = req.body;
    const categoryName = category?.toLowerCase();
    const findCategory = await Category.findOne({ tag: categoryName });

    if (discount > 100) {
      return res.status(400).json({
        message: `Discount max 100%`,
      });
    }

    const discountPrice = (price * discount) / 100;

    if (!findCategory) {
      return res.status(400).json({
        message: `category ${category} tidak ditemukan`,
      });
    }

    const tag = await Tag.find({ tag: { $in: tags } });

    if (req.file) {
      let temp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );
      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await new Product({
            name,
            description,
            price,
            image_url,
            category: findCategory?._id,
            tags: tag?.map((tag) => tag._id),
            discount,
            current_price: discount ? price - discountPrice : price,
            image_url: filename,
          });
          await product.save();
          return res.status(202).json(product);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === "validationError") {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.message,
            });
          }
          next(error);
        }
      });
    } else {
      let product = await new Product({
        name,
        description,
        price,
        discount,
        current_price: discount ? price - discountPrice : price,
        category: findCategory?._id,
        tags: tag?.map((tag) => tag?._id),
      });
      product.save();
      return res.status(202).json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidatorError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, discount } = req.body;
    const { id } = req.params;
    const categoryName = category?.toLowerCase();

    if (discount > 100) {
      return res.status(400).json({
        message: `Discount max 100%`,
      });
    }

    if (category && category.length) {
      const findCategory = await Category.findOne({ tag: categoryName });

      if (!findCategory) {
        return res.status(400).json({
          message: `category ${category} tidak ditemukan`,
        });
      }
    }

    const findProduct = await Product.findById({ _id: id });

    const discountPrice = () => {
      let disc;

      if (price) {
        disc = price - (price * discount) / 100;
      } else {
        disc = findProduct?.price - (findProduct?.price * discount) / 100;
      }

      return disc;
    };

    const isPrice = () => {
      if (price) {
        return price;
      }

      return findProduct?.price;
    };

    const findCategory = Category.findOne({ tag: categoryName });

    if (!findProduct) {
      return res.status(400).json({
        message: `id product ${id} tidak ditemukan`,
      });
    }

    if (req.file) {
      let temp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );
      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const findData = await Product.findById({ _id: id });

          let currentimage = `${config.rootPath}/public/images/products/${findData?.image_url}`;

          if (fs.existsSync(currentimage)) {
            fs.unlinkSync(currentimage);
            console.log();
          }

          let product = await Product.findByIdAndUpdate(
            { _id: id },
            {
              name,
              description,
              price,
              current_price: discount > 0 ? discountPrice() : isPrice(),
              discount,
              category: findCategory?._id,
              image_url: filename,
            },
            {
              new: true,
              runValidators: true,
            }
          );

          return res.json(product);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === "ValidationError") {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.message,
            });
          }
          next(error);
        }
      });
    } else {
      let product = await Product.findByIdAndUpdate(
        { _id: id },
        {
          name,
          description,
          price,
          discount,
          current_price: discount > 0 ? discountPrice() : isPrice(),
          category: findCategory?._id,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }

    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const {
      skip = 0,
      limit = null,
      q = "",
      category = "",
      tags = [],
    } = req.query;

    let ceriteria = {};

    if (q.length > 0) {
      ceriteria = { ...ceriteria, name: { $regex: `${q}`, $options: "i" } };
    }

    if (category.length > 0) {
      const categoryName = category.toLowerCase();
      resultCategory = await Category.findOne({ tag: categoryName });

      if (category) {
        ceriteria = { ...ceriteria, category: resultCategory?._id };
      }
    }

    if (tags.length > 0) {
      const tagName = tags?.toLowerCase();
      const resultTag = await Tag.find({ tag: tagName });

      if (resultTag) {
        ceriteria = {
          ...ceriteria,
          tags: { $in: resultTag?.map((tag) => tag?._id) },
        };
      }
    }

    const count = await Product.find().countDocuments();

    let product = await Product.find()
      .populate("category")
      .populate("tags")
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    res.json({
      data: product,
      count,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkId = await Product.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id product ${id} not found`,
      });
    }

    let product = await Product.findByIdAndDelete({ _id: id });
    let currentimage = `${config.rootPath}/public/images/products/${product?.image_url}`;

    if (fs.existsSync(currentimage)) {
      fs.unlinkSync(currentimage);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProduct, deleteProduct, updateProduct };
