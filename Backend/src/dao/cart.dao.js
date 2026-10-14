import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    const carts = await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: {
                path: "$productDetails",
                preserveNullAndEmptyArrays: false
            }
        },
        {
            $addFields: {
                selectedVariant: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: {
                                    $ifNull: [
                                        "$productDetails.variants",
                                        []
                                    ]
                                },
                                as: "variant",
                                cond: {
                                    $eq: [
                                        "$$variant._id",
                                        "$items.variant"
                                    ]
                                }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $addFields: {
                "items.product": "$productDetails",
                
itemPrice: {
    $multiply: [
        "$items.quantity",
        "$items.price.amount"
    ]
},
itemCurrency: "$items.price.currency",
                itemCurrency: {
                    $ifNull: [
                        "$items.price.currency",
                        {
                            $ifNull: [
                                "$selectedVariant.price.currency",
                                "$productDetails.price.currency"
                            ]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$user",
                totalPrice: {
                    $sum: "$itemPrice"
                },
                currency: {
                    $first: "$itemCurrency"
                },
                items: {
                    $push: "$items"
                }
            }
        }
    ]);

    return carts[0] || null;
}
