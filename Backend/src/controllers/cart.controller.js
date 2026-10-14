import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import {createOrder} from "../services/payment.service.js"
import {getCartDetails} from "../dao/cart.dao.js"
import paymentModel from "../models/payment.model.js"
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity = 1 } = req.body;

        // Validate quantity
        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: "Quantity must be a positive integer",
                success: false
            });
        }

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
                success: false
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const hasVariants = product.variants?.length > 0;

        let variant = null;
        let stock;
        let price = product.price;

        if (hasVariants) {
            if (!mongoose.isValidObjectId(variantId)) {
                return res.status(400).json({
                    message: "Please select a valid product variant",
                    success: false
                });
            }

            variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({
                    message: "Product variant not found",
                    success: false
                });
            }

            stock = variant.stock;

            if (variant.price) {
                price = variant.price;
            }
        } else {
            // Product without variants
            if (variantId && variantId !== "undefined" && variantId !== "null") {
                return res.status(400).json({
                    message: "This product does not have variants",
                    success: false
                });
            }

            stock = product.stock;
        }

        if (typeof stock !== "number" || stock <= 0) {
            return res.status(400).json({
                message: "This product is currently out of stock",
                success: false
            });
        }

        const cart =
            (await cartModel.findOne({ user: req.user._id })) ||
            (await cartModel.create({ user: req.user._id }));

        const existingItem = cart.items.find(item =>
            item.product.toString() === productId &&
            (item.variant?.toString() || null) ===
            (variant?._id?.toString() || null)
        );

        const currentQuantity = existingItem?.quantity || 0;

        if (currentQuantity + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false
            });
        }

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: product._id,
                ...(variant ? { variant: variant._id } : {}),
                quantity,
                price
            });
        }

        await cart.save();

        return res.status(200).json({
            message: existingItem
                ? "Cart updated successfully"
                : "Product added to cart successfully",
            success: true
        });

    } catch (err) {
        console.error("Add to cart error:", err);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const getCart = async (req,res)=>{
    const user = req.user


    let cart = await getCartDetails(user._id)

    if(!cart){
        cart = await cartModel.create({ user: req.user._id})
    }

    return res.status(200).json({
        message: "cart fetched successfully",
        success: true,
        cart
    })
}


export const incrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const hasVariants = product.variants?.length > 0;
        let variant = null;
        let stock = product.stock;

        if (hasVariants) {
            if (!mongoose.isValidObjectId(variantId)) {
                return res.status(400).json({
                    message: "Please select a valid variant",
                    success: false
                });
            }

            variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({
                    message: "Variant not found",
                    success: false
                });
            }

            stock = variant.stock;
        } else if (variantId && variantId !== "undefined" && variantId !== "null") {
            return res.status(400).json({
                message: "This product has no variants",
                success: false
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const cartItem = cart.items.find(item =>
            item.product.toString() === productId &&
            (item.variant?.toString() || null) ===
            (variant?._id?.toString() || null)
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (cartItem.quantity + 1 > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false
            });
        }

        cartItem.quantity += 1;
        await cart.save();

        return res.status(200).json({
            message: "Cart quantity incremented successfully",
            success: true
        });

    } catch (err) {
        console.error("Increment cart error:", err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const decrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const hasVariants = product.variants?.length > 0;
        let variant = null;

        if (hasVariants) {
            if (!mongoose.isValidObjectId(variantId)) {
                return res.status(400).json({
                    message: "Please select a valid variant",
                    success: false
                });
            }

            variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({
                    message: "Variant not found",
                    success: false
                });
            }
        } else if (variantId && variantId !== "undefined" && variantId !== "null") {
            return res.status(400).json({
                message: "This product has no variants",
                success: false
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const cartItem = cart.items.find(item =>
            item.product.toString() === productId &&
            (item.variant?.toString() || null) ===
            (variant?._id?.toString() || null)
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (cartItem.quantity <= 1) {
            return res.status(400).json({
                message: "Minimum quantity is 1. Use remove API to delete item",
                success: false
            });
        }

        cartItem.quantity -= 1;
        await cart.save();

        return res.status(200).json({
            message: "Cart quantity decremented successfully",
            success: true
        });

    } catch (err) {
        console.error("Decrement cart error:", err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const RemoveCartItem = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const hasVariants = product.variants?.length > 0;
        let variant = null;

        if (hasVariants) {
            if (!mongoose.isValidObjectId(variantId)) {
                return res.status(400).json({
                    message: "Please select a valid variant",
                    success: false
                });
            }

            variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({
                    message: "Variant not found",
                    success: false
                });
            }
        } else if (variantId && variantId !== "undefined" && variantId !== "null") {
            return res.status(400).json({
                message: "This product has no variants",
                success: false
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const itemExists = cart.items.some(item =>
            item.product.toString() === productId &&
            (item.variant?.toString() || null) ===
            (variant?._id?.toString() || null)
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        cart.items = cart.items.filter(item =>
            !(
                item.product.toString() === productId &&
                (item.variant?.toString() || null) ===
                (variant?._id?.toString() || null)
            )
        );

        await cart.save();

        return res.status(200).json({
            message: "Item removed successfully",
            success: true
        });

    } catch (err) {
        console.error("Remove cart error:", err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};



export const createOrderController = async (req, res) => {
    try {
        const cart = await getCartDetails(req.user._id);

        if (!cart || !cart.items?.length) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false
            });
        }

        const order = await createOrder({
            amount: cart.totalPrice,
            currency: cart.currency
        });

        const orderItems = cart.items.map(item => {
            const product = item.product;

            const variant = product.variants?.find(
                v => String(v._id) === String(item.variant)
            );

            const price = item.price;

            return {
                title: product.title,
                productId: product._id,
                variantId: item.variant ?? null,
                quantity: item.quantity,
                images: variant?.images?.length
                    ? variant.images
                    : product.images,
                description: product.description,
                price: {
                    amount: price.amount,
                    currency: price.currency
                }
            };
        });

        await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id
            },
            price: {
                amount: cart.totalPrice,
                currency: cart.currency
            },
            orderItems
        });

        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            order
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            message: "Unable to create order",
            success: false
        });
    }
}


export const verifyOrderController = async (req,res)=>{
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if(!payment){
        return res.status(400).json({
            message: "payment not found",
            success: false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        })
    }
    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

    return res.status(200).json({
        message: "Payment verified successfully",
        success: true
    })

}

export const getOrderDetailsController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payment = await paymentModel.findOne({
            "razorpay.orderId": orderId,
            user: req.user._id,
            status: "paid"
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order: payment
        });
    } catch (error) {
        console.error("Get order details error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch order details"
        });
    }
};


export const getMyOrdersController = async (req, res) => {
    try {
        const orders = await paymentModel
            .find({
                user: req.user._id,
                status: "paid"
            })
            .select("-razorpay.signature")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Get my orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders"
        });
    }
};
