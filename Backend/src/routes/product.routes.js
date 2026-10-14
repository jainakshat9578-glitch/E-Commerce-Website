import express from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import { createProduct, getAllProducts, getsellerProducts, getProductDetails, addProductVariant,} from "../controllers/product.controller.js"
import multer from "multer"
import { createProductvalidator } from "../validator/product.validator.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5*1024*1024   // 5MB
    }
})


const router = express.Router()

router.post("/",authenticateSeller,upload.array("images",7),createProductvalidator,createProduct)
                            // at a time 7 images upload kr sakte ho

router.get("/seller",authenticateSeller,getsellerProducts)


router.get("/",getAllProducts)

router.get("/detail/:id",getProductDetails)

router.post("/:productId/variants",authenticateSeller,upload.array("images",7),addProductVariant)

export default router