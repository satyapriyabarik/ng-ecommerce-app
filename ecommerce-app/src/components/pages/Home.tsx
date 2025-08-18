import { useQuery } from "@apollo/client";
import { useCart } from "../../context/CartContext";
import { PRODUCTS_QUERY } from "../../graphql/mutations";
import Banner from "./Banner";
import Spinner from "./spinner";

export default function Home() {
    const { data, loading } = useQuery(PRODUCTS_QUERY);
    const { addToCart } = useCart();

    const handleAdd = async (product) => {
        await addToCart(product, 1); // CartContext handles backend + refetch
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Banner />
            <div className="container mt-4">
                <div className="row">
                    {data?.getProducts.map((p) => (
                        <div className="col-md-4 mb-4" key={p._id}>
                            {p.imageUrl ? (
                                <div className="card">
                                    <img
                                        src={p.imageUrl}
                                        className="card-img-top"
                                        alt={p.title}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.title}</h5>
                                        <h6 className="card-title">{p.descriptions}</h6>
                                        <p className="card-text">₹{p.price}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAdd(p)}
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
