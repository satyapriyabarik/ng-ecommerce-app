import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { PRODUCT_QUERY } from "../../graphql/mutations";
import { useCart } from "../../context/CartContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useRef } from "react";
import { useCartIcon } from "../../context/CartIconContext";
import { flyToCart } from "../../utils/flyToCart";
const WhatsAppButton = ({ phone, message }: { phone: string; message: string }) => {
    const sendWhatsApp = () => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    };

    return (
        <button className="btn btn-success mt-2" onClick={sendWhatsApp}>
            Chat on WhatsApp
        </button>
    );
};
export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // GraphQL query
    const { data, loading, error } = useQuery(PRODUCT_QUERY, {
        variables: { id },
        skip: !id,
    });

    // Hooks must always be at top
    const token = sessionStorage.getItem("token");
    const cartRef = useCartIcon();
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

    // Handle add-to-cart
    const handleAddToCart = async (product: any) => {
        if (token) {
            const imgEl = imgRefs.current[0];
            if (imgEl && cartRef.current) {
                flyToCart(imgEl, cartRef.current);
            }
            await addToCart(product, 1);
        } else {
            navigate("/login");
        }
    };

    // Conditional UI rendering
    if (loading) return <p>Loading product...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data?.product) return <p>Product not found</p>;

    const product = data.product;

    return (
        <div className="container py-5">
            <div className="row g-4">
                {/* Image Section */}
                <div className="col-md-5">
                    <Zoom>
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="img-fluid rounded shadow"
                            ref={(el) => {
                                imgRefs.current[0] = el;
                            }}
                        />
                    </Zoom>
                    <h5 className="mt-2">Click to zoom</h5>
                </div>

                {/* Details Section */}
                <div className="col-md-7">
                    <h2>{product.title}</h2>
                    <p className="text-muted">{product.descriptions}</p>
                    <h4 className="text-primary">₹{product.price}</h4>
                    <p>
                        <strong>Stock: </strong>
                        {product.stock > 0 ? (
                            <>
                                <span className="text-success">In Stock</span>
                                <small className="text-muted">
                                    {" "}
                                    (Only {product.stock} left)
                                </small>
                            </>
                        ) : (
                            <span className="text-danger">Out of Stock</span>
                        )}
                    </p>

                    <button
                        className="btn btn-primary mt-3"
                        disabled={product.stock === 0}
                        onClick={() => handleAddToCart(product)}
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    {/* WhatsApp Button */}
                    <div> <WhatsAppButton
                        phone="+919164261165" // Replace with your business number
                        message={`Hello, I have a question about "${product.title}" (ID: ${product._id})`}
                    />
                    </div>

                </div>
            </div>
        </div>
    );
}
