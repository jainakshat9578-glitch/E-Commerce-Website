import { addItem, decrementCartItemApi, getCart, incrementCartItemApi, RemoveCartItemApi,createCartOrder,verifyCartOrder } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, incrementCartItem, decrementCartItem, removeCartItem, setCart } from "../state/cart.slice";

export const useCart = ()=>{

    const dispatch = useDispatch()

    async function handleAddItem({productId,variantId}){
        const data = await addItem({productId,variantId})
        return data
    }

    async function handleGetCart(){
        const data = await getCart()
        dispatch(setCart(data.cart))
    }

async function handleIncrementCartItem({ productId, variantId }) {
    try {
        await incrementCartItemApi({ productId, variantId });
        await handleGetCart();
    } catch (error) {
        console.error(
            "Increment error:",
            error.response?.data || error.message
        );
        throw error;
    }
}

async function handleDecrementCartItem({ productId, variantId }) {
    try {
        await decrementCartItemApi({ productId, variantId });
        await handleGetCart();
    } catch (error) {
        console.error(
            "Decrement error:",
            error.response?.data || error.message
        );
        throw error;
    }
}

    async function handleRemoveCartItem({productId,variantId}){
        const data = await RemoveCartItemApi({productId,variantId})
        dispatch(removeCartItem({productId,variantId}))
    }

    async function handleCreateCartOrder(){
        const data = await createCartOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }){
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

    return {handleAddItem,handleGetCart,handleIncrementCartItem,handleDecrementCartItem,handleRemoveCartItem,handleCreateCartOrder,handleVerifyCartOrder,handleDecrementCartItem}
}