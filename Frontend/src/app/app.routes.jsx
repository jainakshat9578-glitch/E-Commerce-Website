import { createBrowserRouter } from "react-router";
import Home from "../features/products/pages/Home";
import Register from "../features/auth/pages/register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/createProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./Applayout";
import OrderSuccess from "../features/cart/pages/OrderSuccess";
import MyOrders from "../features/cart/pages/MyOrders";

export const routes = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/product/:productId",
                element: <ProductDetails />
            },
            {
                path: "/cart",
                element: (
                    <Protected>
                        <Cart />
                    </Protected>
                )
            },
            {
                path: "/order-success",
                element: (
                    <Protected>
                        <OrderSuccess />
                    </Protected>
                )
            },
            {
                path: "/my-orders",
                element: (
                    <Protected>
                        <MyOrders />
                    </Protected>
                )
            },
            {
                path: "/my-orders/:orderId",
                element: (
                    <Protected>
                        <OrderSuccess />
                    </Protected>
                )
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "create-product",
                        element: (
                            <Protected role="seller">
                                <CreateProduct />
                            </Protected>
                        )
                    },
                    {
                        path: "dashboard",
                        element: (
                            <Protected role="seller">
                                <Dashboard />
                            </Protected>
                        )
                    },
                    {
                        path: "product/:productId",
                        element: (
                            <Protected role="seller">
                                <SellerProductDetails />
                            </Protected>
                        )
                    }
                ]
            }
        ]
    }
]);
