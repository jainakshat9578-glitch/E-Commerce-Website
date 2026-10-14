
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getMyOrders } from "../service/cart.api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data.orders || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatAmount = (price) => {
        const amount = Number(price?.amount ?? 0);

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: price?.currency || "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const statusStyle = {
        paid: "bg-green-100 text-green-800",
        pending: "bg-amber-100 text-amber-800",
        failed: "bg-red-100 text-red-800",
    };

    return (
        <main className="min-h-screen bg-[#faf8f5] px-5 py-12 md:px-12 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#9a8060]">
                    Your purchases
                </p>

                <h1
                    className="mb-3 text-4xl text-[#1b1c1a] md:text-5xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    My Orders
                </h1>

                <p className="mb-10 text-sm text-[#7a6e63]">
                    Your order history, all in one place.
                </p>

                {loading && (
                    <p className="py-12 text-center text-[#7a6e63]">
                        Loading your orders...
                    </p>
                )}

                {!loading && error && (
                    <div className="border border-red-200 bg-white p-6 text-red-700">
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-3 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="border border-[#e4e2df] bg-white px-6 py-16 text-center">
                        <h2
                            className="mb-3 text-3xl"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            No orders yet
                        </h2>

                        <p className="mb-7 text-sm text-[#7a6e63]">
                            Your next favourite piece is waiting for you.
                        </p>

                        <Link
                            to="/"
                            className="inline-block bg-[#765a2b] px-8 py-4 text-xs tracking-[0.2em] text-white"
                        >
                            EXPLORE COLLECTION
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="border border-[#e4e2df] bg-white p-5 md:p-7"
                            >
                                <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-[#eee9e3] pb-5">
                                    <div>
                                        <p className="mb-1 text-xs uppercase tracking-[0.15em] text-[#8a7c6d]">
                                            Order reference
                                        </p>

                                        <p className="break-all text-sm text-[#765a2b]">
                                            #{order.razorpay?.orderId || order._id}
                                        </p>

                                        <p className="mt-2 text-xs text-[#7a6e63]">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-block px-3 py-2 text-xs uppercase tracking-wider ${
                                            statusStyle[order.status] ||
                                            "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {(order.orderItems || []).map((item, index) => (
                                        <div
                                            key={`${item.productId || item.title}-${index}`}
                                            className="flex gap-4"
                                        >
                                            {item.images?.[0]?.url ? (
                                                <img
                                                    src={item.images[0].url}
                                                    alt={item.title || "Product"}
                                                    className="h-28 w-20 shrink-0 object-cover"
                                                />
                                            ) : (
                                                <div className="h-28 w-20 shrink-0 bg-[#f1efeb]" />
                                            )}

                                            <div className="flex flex-1 flex-col justify-center">
                                                <h3 className="text-lg text-[#1b1c1a]">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-[#7a6e63]">
                                                    Quantity: {item.quantity}
                                                </p>

                                                <p className="mt-2 text-sm font-medium">
                                                    {formatAmount(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#eee9e3] pt-5">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[#8a7c6d]">
                                            Order total
                                        </p>
                                        <p className="mt-1 text-xl font-medium">
                                            {formatAmount(order.price)}
                                        </p>
                                    </div>

                                    {order.status === "paid" ? (
                                        <Link
                                            to={`/my-orders/${encodeURIComponent(order.razorpay?.orderId || "")}`}
                                            className="bg-[#765a2b] px-6 py-4 text-center text-xs tracking-[0.15em] text-white transition-opacity hover:opacity-90"
                                        >
                                            VIEW DETAILS
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-[#7a6e63]">
                                            Payment {order.status}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyOrders;
