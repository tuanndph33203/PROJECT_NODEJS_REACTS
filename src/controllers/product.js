import { StatusCodes } from "http-status-codes";

// import { productSchema } from "../validate/product";
import ProductModel from "../models/product.js";

const ProductController = {
  Create : async (req, res) => {
    try {
      const { name, image, discount, description, stock, category } = req.body;
      // const { error } = productSchema.validate(
      //   { name, image, sizes, discount, description, color, stock, category },
      //   { abortEarly: false }
      // );
      // if (error) {
      //   res.status(StatusCodes.BAD_REQUEST).json({
      //     message: error.details.map((value) => {
      //       return value.message;
      //     }),
      //   });
      // }
      const existedName = await ProductModel.findOne({ name: name });
      if (existedName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Tên phẩm đã tồn tại !",
        });
      }
      const product = await ProductModel.create({
        name,
        tag: name.replace(/\s/g, "_"),
        image,
        discount,
        description,
        stock,
        category,
      });
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo sản phẩm thành công !",
        product,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error" + error,
      });
    }
  },
  All : async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.status(StatusCodes.OK).json({
        message: "Lấy tất cả sản phẩm thành công !",
        data: products,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error: " + error.message,
      });
    }
  },
  Limit : async (req, res) => {
    try {
      const limit = parseInt(req.params.limit); 
      const latestProducts = await ProductModel.find().sort({ createdAt: -1 }).limit(limit);
      res.status(StatusCodes.OK).json({
        message: `Lấy ${limit} sản phẩm thành công !`,
        data: latestProducts,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error: " + error.message,
      });
    }
  },
  Detail : async (req, res) => {
    try {
      const tag = req.params.tag;
      const product = await ProductModel.findOne({ tag: tag });
      if (!product) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Sản phẩm không tồn tại !",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Lấy sản phẩm thành công !",
        data: product,
        tag
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error" + error,
      });
    }
  },
  Delete : async (req, res) => {
    try {
      const existingProduct = await ProductModel.findById(req.params.id);
      if (!existingProduct) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy sản phẩm !",
        });
      }
      await ProductModel.findByIdAndDelete(req.params.id);
      res.status(StatusCodes.OK).json({
        message: "Xóa sản phẩm thành công !",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error" + error,
      });
    }
  },
  Update : async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, image, discount, description, stock, category } = req.body;
      const existingProduct = await ProductModel.findById(productId);
      if (!existingProduct) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy sản phẩm !",
        });
      }
      existingProduct.name = name;
      existingProduct.image = image;
      existingProduct.discount = discount;
      existingProduct.description = description;
      existingProduct.stock = stock;
      existingProduct.category = category;
      await existingProduct.save();

      return res.status(StatusCodes.CREATED).json({
        message: "Sửa sản phẩm thành công !",
        existingProduct,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error" + error,
      });
    }
  }
};

export default ProductController;
