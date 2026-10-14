import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router";
import { getCartOrderDetails } from "../service/cart.api";

const tokens = {
    surface: "#fbf9f6",
    surfaceLow: "#f5f3f0",
    surfaceHigh: "#eae8e5",
    onSurface: "#1b1c1a",
    onSurfaceVariant: "#4d463a",
    secondary: "#7A6E63",
    primary: "#C9A96E",
    primaryDark: "#745a27",
    outlineVariant: "#d0c5b5",
    outline: "#7f7668",
};

const formatPrice = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount ?? 0);

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId: routeOrderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Supports both:
    // /order-success?order_id=...
    // /my-orders/:orderId
    const queryOrderId = new URLSearchParams(location.search).get("order_id");
    const orderId = routeOrderId || queryOrderId;

    useEffect(() => {
        let isMounted = true;

        const fetchOrder = async () => {
            if (!orderId) {
                setError("Order reference is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setOrder(null);

                const data = await getCartOrderDetails(orderId);

                if (!data?.success || !data?.order) {
                    throw new Error("Unable to load your order details.");
                }

                if (isMounted) {
                    setOrder(data.order);
                }
            } catch (err) {
                console.error("Order fetch error:", err);

                if (isMounted) {
                    setError(
                        err?.response?.data?.message ||
                        err.message ||
                        "Unable to load order details."
                    );
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOrder();

        return () => {
            isMounted = false;
        };
    }, [orderId]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: tokens.surface, color: tokens.onSurface }}
            >
                <p className="text-sm tracking-widest uppercase">
                    Loading your order...
                </p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-5 px-6"
                style={{ backgroundColor: tokens.surface, color: tokens.onSurface }}
            >
                <h1
                    className="text-4xl text-center"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    Order details unavailable
                </h1>

                <p className="text-center" style={{ color: tokens.secondary }}>
                    {error || "We couldn't find this order."}
                </p>

                <Link
                    to="/my-orders"
                    className="px-8 py-4 text-xs uppercase tracking-widest"
                    style={{ backgroundColor: tokens.primaryDark, color: "#fff" }}
                >
                    Back to My Orders
                </Link>
            </div>
        );
    }

    const orderItems = order.orderItems || [];
    const currency = order.price?.currency || "INR";
    const total = order.price?.amount ?? 0;
    const isPaid = order.status === "paid";

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
                style={{
                    backgroundColor: tokens.surface,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-7 space-y-12">
                            <section className="space-y-6">
                                <span
                                    className="uppercase tracking-[0.2em] text-[10px]"
                                    style={{ color: tokens.secondary }}
                                >
                                    {isPaid ? "TRANSACTION COMPLETE" : "ORDER DETAILS"}
                                </span>

                                <h1
                                    className="text-5xl md:text-7xl leading-tight font-light tracking-tight"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        color: tokens.onSurface,
                                    }}
                                >
                                    {isPaid ? (
                                        <>
                                            A piece of our
                                            <br />
                                            <i className="italic">Atelier</i> is yours.
                                        </>
                                    ) : (
                                        <>
                                            Your order
                                            <br />
                                            <i className="italic">details.</i>
                                        </>
                                    )}
                                </h1>

                                <div className="space-y-2 mt-6">
                                    <p
                                        className="text-sm uppercase tracking-widest"
                                        style={{ color: tokens.outline }}
                                    >
                                        Order Reference
                                    </p>
                                    <p
                                        className="text-xl md:text-2xl break-all"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            color: tokens.primaryDark,
                                        }}
                                    >
                                        #{order.razorpay?.orderId || "N/A"}
                                    </p>
                                </div>

                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest"
                                    style={{
                                        backgroundColor: isPaid ? "#e7f5e9" : "#f8eed9",
                                        color: isPaid ? "#216e39" : "#8a6418",
                                    }}
                                >
                                    <span>{isPaid ? "✓" : "•"}</span>
                                    {isPaid ? "Payment Successful" : `Payment ${order.status}`}
                                </div>
                            </section>

                            <section
                                className="p-6 md:p-12 space-y-8"
                                style={{ backgroundColor: tokens.surfaceLow }}
                            >
                                <h3
                                    className="text-xl pb-4"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: `1px solid ${tokens.outlineVariant}`,
                                    }}
                                >
                                    Order Summary
                                </h3>

                                {orderItems.length === 0 ? (
                                    <p style={{ color: tokens.secondary }}>
                                        No items found for this order.
                                    </p>
                                ) : (
                                    <div className="space-y-7">
                                        {orderItems.map((item, index) => (
                                            <div
                                                key={item._id || `${item.productId}-${index}`}
                                                className="flex gap-5 md:gap-6 items-center"
                                            >
                                                <div
                                                    className="w-24 h-32 flex-shrink-0 overflow-hidden"
                                                    style={{ backgroundColor: tokens.surfaceHigh }}
                                                >
                                                    {item.images?.[0]?.url && (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            alt={item.title || "Ordered product"}
                                                            src={item.images[0].url}
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex-grow space-y-2 min-w-0">
                                                    <h4
                                                        className="text-lg break-words"
                                                        style={{
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            color: tokens.onSurface,
                                                        }}
                                                    >
                                                        {item.title}
                                                    </h4>

                                                    {item.description && (
                                                        <p
                                                            className="text-sm line-clamp-2"
                                                            style={{ color: tokens.outline }}
                                                        >
                                                            {item.description}
                                                        </p>
                                                    )}

                                                    <p className="text-sm" style={{ color: tokens.secondary }}>
                                                        Quantity: {item.quantity}
                                                    </p>

                                                    <p className="font-semibold mt-2">
                                                        {formatPrice(
                                                            (item.price?.amount ?? 0) * (item.quantity ?? 1),
                                                            item.price?.currency || currency
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div
                                    className="space-y-4 pt-5"
                                    style={{ borderTop: `1px solid ${tokens.outlineVariant}` }}
                                >
                                    <div
                                        className="flex justify-between gap-4 text-sm uppercase tracking-widest"
                                        style={{ color: tokens.secondary }}
                                    >
                                        <span>Items</span>
                                        <span>
                                            {orderItems.reduce(
                                                (sum, item) => sum + (item.quantity || 0),
                                                0
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        className="flex justify-between gap-4 text-lg pt-2"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        <span>{isPaid ? "Total Paid" : "Order Total"}</span>
                                        <span className="font-semibold" style={{ color: tokens.primaryDark }}>
                                            {formatPrice(total, currency)}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12 mt-4 lg:mt-0">
                            <div className="space-y-10">
                                <section className="space-y-4">
                                    <h3
                                        className="text-xl italic"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        Payment Details
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between gap-4">
                                            <span style={{ color: tokens.secondary }}>Status</span>
                                            <span className="uppercase text-sm font-medium">
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span style={{ color: tokens.secondary }}>Payment ID</span>
                                            <span className="text-sm text-right break-all">
                                                {order.razorpay?.paymentId || "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span style={{ color: tokens.secondary }}>Currency</span>
                                            <span>{currency}</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3
                                        className="text-xl italic"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        Order Confirmation
                                    </h3>

                                    <p className="leading-relaxed" style={{ color: tokens.onSurfaceVariant }}>
                                        {isPaid
                                            ? "Your payment has been verified successfully. Keep your order reference for future queries."
                                            : "This order does not have a confirmed payment yet. Check the status before considering it paid."}
                                    </p>
                                </section>

                                <div className="flex flex-col gap-4 pt-4">
                                    <Link
                                        to="/my-orders"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{
                                            backgroundColor: tokens.primaryDark,
                                            color: "#ffffff",
                                        }}
                                    >
                                        View My Orders
                                    </Link>

                                    <Link
                                        to="/"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                                        style={{
                                            backgroundColor: "transparent",
                                            border: `1px solid ${tokens.outline}`,
                                            color: tokens.onSurface,
                                        }}
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            <div
                                className="pt-8"
                                style={{ borderTop: `1px solid ${tokens.outlineVariant}40` }}
                            >
                                <p
                                    className="text-[10px] uppercase tracking-widest leading-loose"
                                    style={{ color: tokens.outline }}
                                >
                                    Thank you for shopping with Snitch.
                                    Your order details have been saved.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default OrderSuccess;
