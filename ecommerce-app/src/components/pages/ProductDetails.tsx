import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { PRODUCT_QUERY } from "../../graphql/mutations";
import { useCart } from "../../context/CartContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(PRODUCT_QUERY, {
        variables: { id },
        skip: !id,
    });

    if (loading) return <p>Loading product...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data?.product) return <p>Product not found</p>;

    const product = data.product;
    const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

    const handleAddToCart = async (product: any) => {
        if (token) {
            await addToCart(product, 1); // CartContext handles backend + refetch
        } else {
            navigate('/login')
        }
    };

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
                        {product.stock > 0 ? (<>
                            <span className="text-success">In Stock</span>
                            <small className="text-muted"> (Only {product.stock} left)</small>
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
                </div>
            </div>
        </div>
    );
}
