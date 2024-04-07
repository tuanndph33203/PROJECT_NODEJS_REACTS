import express from 'express';
import ProductController from './../controllers/product';
import { CheckPermission } from '../middlewares/authenticate';
const productRouter = express.Router();
productRouter.get("/",ProductController.All);
productRouter.get("/limit/:limit", ProductController.Limit);
productRouter.get("/:slug",ProductController.Detail);
productRouter.post("/", ProductController.Create);
productRouter.put("/:id", ProductController.Update);
productRouter.delete("/:id",ProductController.Delete); 
export default productRouter;
