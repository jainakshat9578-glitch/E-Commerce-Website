import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})


// export const addItem = async ({ productId, variantId }) => {
//     const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
//         quantity: 1
//     })

//     return response.data
// }


export const addItem = async ({ productId, variantId }) => {
    const url = variantId
        ? `/add/${productId}/${variantId}`
        : `/add/${productId}`;

    try {
        const response = await cartApiInstance.post(url, {
            quantity: 1
        });

        return response.data;
    } catch (error) {
        console.log("CART ERROR RESPONSE:", error.response?.data);
        console.log("CART ERROR STATUS:", error.response?.status);
        throw error;
    }
}

export const getCart = async ()=>{
    const response = await cartApiInstance.get("/")
    return response.data
}


export const incrementCartItemApi = async ({ productId, variantId }) => {
    const id = variantId?._id ?? variantId;

    const url = id
        ? `/quantity/increment/${productId}/${id}`
        : `/quantity/increment/${productId}`;

    const response = await cartApiInstance.patch(url);
    return response.data;
};

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const id = variantId?._id ?? variantId;

    const url = id
        ? `/quantity/decrement/${productId}/${id}`
        : `/quantity/decrement/${productId}`;

    const response = await cartApiInstance.patch(url);
    return response.data;
};

export const RemoveCartItemApi = async ({ productId, variantId }) => {
    const id = variantId?._id ?? variantId;

    const url = id
        ? `/remove/${productId}/${id}`
        : `/remove/${productId}`;

    const response = await cartApiInstance.delete(url);
    return response.data;
};


export const createCartOrder = async ()=>{
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}

export const getCartOrderDetails = async (orderId) => {
    const response = await cartApiInstance.get(
        `/payment/order/${orderId}`
    );

    return response.data;
};


export const getMyOrders = async () => {
    const response = await cartApiInstance.get("/payment/orders");
    return response.data;
};
