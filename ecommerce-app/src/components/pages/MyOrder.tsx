import { useQuery } from "@apollo/client";
import { GET_MY_ORDERS } from "../../graphql/mutations";

export default function MyOrders() {
    const { loading, error, data } = useQuery(GET_MY_ORDERS);

    if (loading) return <p className="text-center mt-5">Loading your orders...</p>;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error.message}</p>;

    const orders = data?.myOrders || [];

    return (
        <div className="container mt-5">
            <h4 className="animate__animated animate__flip text-info">My Orders</h4>
            <hr />

            {orders.length === 0 ? (
                <p className="mt-3">You haven't placed any orders yet.</p>
            ) : (
                <div className="list-group">
                    {orders.map((order: any) => (
                        <div key={order.id} className="list-group-item mb-3 shadow-sm rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5>Order #{order.id}</h5>
                                <span className="badge bg-success">{order.paymentMethod}</span>
                            </div>
                            <p className="text-muted mb-1">
                                Placed on {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>

                            <ul className="list-group mt-3">
                                {order.items.map((item: any, idx: number) => (
                                    <li
                                        key={idx}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <h6 className="mb-0">{item.product?.title}</h6>
                                            <small>₹{item.product?.price?.toFixed(2)} x {item.quantity}</small>
                                        </div>
                                        <span>₹{(item.product?.price || 0) * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
