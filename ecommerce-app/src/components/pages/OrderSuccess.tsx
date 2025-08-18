import { useLocation } from "react-router-dom";
const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, amount } = location.state || {};
    return (
        <div className="order-success container mx-auto p-4 text-white">
            <h4 className="animate__animated animate__flip animate__flipInY text-mted text-info">Order Successful!</h4>
            <hr />
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <p>We will send you an email confirmation shortly.</p>
            <details>
                <summary>Order Details</summary>
                <p>Order ID: {orderId}</p>
                <p>Total Amount: ₹{amount}</p>
                <p>Payment Method: Razorpay</p>
                <p>Estimated Delivery: 3-5 business days</p>
            </details>
        </div>
    );
}
export default OrderSuccess;