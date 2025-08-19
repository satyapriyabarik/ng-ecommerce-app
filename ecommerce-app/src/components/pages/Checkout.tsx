import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useMutation } from "@apollo/client";
import { CREATE_RAZORPAY_ORDER, PLACE_ORDER_MUTATION, VERIFY_PAYMENT } from "../../graphql/mutations";
import { openRazorpay } from "../../razorpay/checkout";
import { useNavigate, Link } from "react-router-dom";
export default function Checkout() {
    const { cart, updateCart, removeFromCart, clearCart } = useCart();
    const [verifyPaymentMutation] = useMutation(VERIFY_PAYMENT);
    const [placeOrderMutation] = useMutation(PLACE_ORDER_MUTATION);
    const [createOrder, { loading }] = useMutation(CREATE_RAZORPAY_ORDER, {
        onCompleted: (data) => {
            openRazorpay(data.createRazorpayOrder.id, total, async (paymentDetails) => {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

                const { data: verifyData } = await verifyPaymentMutation({
                    variables: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
                });
                if (verifyData.verifyPayment) {
                    await placeOrderMutation({
                        variables: {
                            paymentId: razorpay_payment_id,
                            paymentMethod: 'Razorpay',
                        },
                    });
                    await clearCart();
                    navigate('/order-success', {
                        state: {
                            orderId: razorpay_order_id,
                            amount: total.toFixed(2),
                        },
                    });
                } else {
                    navigate('/payment-failed');
                }
            });
        },
        onError: (err) => console.error('Order creation failed:', err),
    });
    const total = cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );
    const navigate = useNavigate();
    const handlePayment = () => {
        createOrder({ variables: { amount: total } });
    };


    return (
        <div className="container mt-5">
            <h4 className="animate__animated animate__flip text-info">Shopping Cart</h4>
            <hr />
            {cart.length === 0 ? (
                <div className="container py-5">
                    <p>Your cart is empty</p>
                    <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
                </div>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cart.map((item) => (
                            <li
                                key={item.product._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            > <h5 className="m-3">{item.product?.title}</h5>
                                <div className="d-flex align-items-center">
                                    <p className="m-3">₹{item.product?.price?.toFixed(2)}</p>
                                    <Link to={`/product/${item.product._id}`} className="text-decoration-none">
                                        <img src={item.product?.imageUrl} alt={item.product?.title} className="img-fluid m-3" style={{ width: '100px', height: "100px" }} />

                                    </Link>
                                    <div className="d-flex align-items-center">
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() =>
                                                updateCart(item.product._id, Math.max(item.quantity - 1, 1))
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className="btn btn-sm btn-outline-secondary ms-2"
                                            onClick={() => updateCart(item.product._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <strong>
                                        ₹{(item.product?.price || 0) * item.quantity}
                                    </strong>
                                    <button
                                        className="btn btn-sm btn-danger ms-3"
                                        onClick={() => removeFromCart(item.product._id)}
                                    ><FaTrashAlt />

                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Total:  ₹{total.toFixed(2)}</h4>
                        <div>
                            <button className="btn btn-warning me-2" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <button className="btn btn-success" onClick={handlePayment}>Proceed to Payment</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
