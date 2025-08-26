import { useQuery } from "@apollo/client";
import { useCart } from "../../context/CartContext";
import { PRODUCTS_QUERY } from "../../graphql/mutations";
import Banner from "./Banner";
import Spinner from "./spinner";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { flyToCart } from "../../utils/flyToCart";
import { useCartIcon } from "../../context/CartIconContext";

export default function Home() {
    const { data, loading } = useQuery(PRODUCTS_QUERY);
    const { addToCart } = useCart();
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const cartRef = useCartIcon();
    // Array of refs for product images
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

    const handleAdd = async (product, index: number) => {
        if (token) {
            const imgEl = imgRefs.current[index];
            if (imgEl && cartRef.current) {
                flyToCart(imgEl, cartRef.current);
            }
            await addToCart(product, 1);
        } else {
            navigate("/login");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Banner />
            <div className="container mt-4">
                <div className="row">
                    {data?.getProducts.map((p, index) => (
                        <div className="col-md-4 mb-4" key={p._id}>
                            {p.imageUrl ? (
                                <div className="card">
                                    <Link to={`/product/${p._id}`}>
                                        <img
                                            ref={(el) => { imgRefs.current[index] = el; }}
                                            src={p.imageUrl}
                                            className="card-img-top"
                                            alt={p.title}
                                        />
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{p.title}</h5>
                                        <p className="card-desc">{p.descriptions}</p>
                                        <p className="card-text">₹{p.price}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAdd(p, index)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Spinner />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
