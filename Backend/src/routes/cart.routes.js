import express from "express"
import {authenticateUser} from "../middleware/auth.middleware.js"
import { validateAddToCart,validateDecrementCartItemQuantity,validateIncrementCartItemQuantity,validateRemoveItem } from "../validator/cart.validator.js";
import { addToCart, getCart,incrementCartItemQuantity,decrementCartItemQuantity,RemoveCartItem,createOrderController,verifyOrderController,getOrderDetailsController,getMyOrdersController } from "../controllers/cart.controller.js";


const router = express.Router()


router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);

router.post("/add/:productId", authenticateUser, validateAddToCart, addToCart);


router.get("/",authenticateUser,getCart)

router.patch("/quantity/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)

router.patch(
    "/quantity/increment/:productId",
    authenticateUser,
    incrementCartItemQuantity
)

router.patch("/quantity/decrement/:productId/:variantId",authenticateUser,validateDecrementCartItemQuantity,decrementCartItemQuantity)

router.patch(
    "/quantity/decrement/:productId",
    authenticateUser,
    decrementCartItemQuantity
);

router.delete("/remove/:productId/:variantId",authenticateUser,validateRemoveItem,RemoveCartItem)

router.delete(
    "/remove/:productId",
    authenticateUser,
    RemoveCartItem
);

router.post("/payment/create/order",authenticateUser,createOrderController)

router.post("/payment/verify/order",authenticateUser,verifyOrderController)

router.get(
    "/payment/order/:orderId",
    authenticateUser,
    getOrderDetailsController
);

router.get(
    "/payment/orders",
    authenticateUser,
    getMyOrdersController
);

export default router;