import { createSlice } from "@reduxjs/toolkit";



const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state,action)=>{
            state.items = action.payload.items
            state.totalPrice = action.payload.totalPrice
            state.currency = action.payload.currency
        },
        addItem: (state,action)=>{
            state.items.push(action.payload)
        },

incrementCartItem: (state, action) => {
    const { productId, variantId } = action.payload;

    const item = state.items.find(item =>
        String(item.product?._id) === String(productId) &&
        String(item.variant?._id ?? item.variant ?? "") ===
        String(variantId?._id ?? variantId ?? "")
    );

    if (item) {
        item.quantity += 1;
    }

    state.totalPrice = state.items.reduce((total, item) => {
        const variant = item.product?.variants?.find(
            v => String(v._id) ===
                String(item.variant?._id ?? item.variant ?? "")
        );

        const price =
            variant?.price?.amount ??
            item.price?.amount ??
            item.product?.price?.amount ??
            0;

        return total + price * item.quantity;
    }, 0);
},

decrementCartItem: (state, action) => {
    const { productId, variantId } = action.payload;

    const item = state.items.find(item =>
        String(item.product?._id) === String(productId) &&
        String(item.variant?._id ?? item.variant ?? "") ===
        String(variantId?._id ?? variantId ?? "")
    );

    if (item && item.quantity > 1) {
        item.quantity -= 1;
    }

    state.totalPrice = state.items.reduce((total, item) => {
        const variant = item.product?.variants?.find(
            v => String(v._id) ===
                String(item.variant?._id ?? item.variant ?? "")
        );

        const price =
            variant?.price?.amount ??
            item.price?.amount ??
            item.product?.price?.amount ??
            0;

        return total + price * item.quantity;
    }, 0);
},

removeCartItem: (state, action) => {
    const { productId, variantId } = action.payload;

    state.items = state.items.filter(item =>
        !(
            String(item.product?._id) === String(productId) &&
            String(item.variant?._id ?? item.variant ?? "") ===
            String(variantId?._id ?? variantId ?? "")
        )
    );

    state.totalPrice = state.items.reduce((total, item) => {
        const variant = item.product?.variants?.find(
            v => String(v._id) ===
                String(item.variant?._id ?? item.variant ?? "")
        );

        const price =
            variant?.price?.amount ??
            item.price?.amount ??
            item.product?.price?.amount ??
            0;

        return total + price * item.quantity;
    }, 0);
}


    }
})

export const {setCart,addItem,incrementCartItem,decrementCartItem,removeCartItem} = cartSlice.actions
export default cartSlice.reducer