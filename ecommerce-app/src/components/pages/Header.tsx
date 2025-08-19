
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaAddressCard, FaListAlt, FaLock, FaPlusCircle, FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { BiCart, BiSolidCartAdd } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "../../graphql/mutations";
import { useState, useEffect, useRef } from "react";

function Header() {
    const { cart = [] } = useCart();
    const totalItems = Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchProducts, { data }] = useLazyQuery(SEARCH_PRODUCTS);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (keyword.length > 1) {
            searchProducts({ variables: { keyword } });
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [keyword]);

    // close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
        window.location.reload();
        sessionStorage.clear();
    };

    const handleAddItem = () => {
        navigate("/admin/add-product");
    };

    const handleSelect = (id: string) => {
        setKeyword("");
        setShowSuggestions(false);
        navigate(`/product/${id}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container d-flex align-items-center justify-content-between">
                {/* Logo */}
                <h2 className="m-0">
                    <Link className="navbar-brand" to={token ? "/home" : "/login"}>
                        <TiShoppingCart size="2em" className="logo animate_animate animate__rubberBand" /> NGKart
                    </Link>
                </h2>

                {/* Search Box */}
                <div className="position-relative flex-grow-1 mx-3" ref={wrapperRef}>
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />

                    {showSuggestions && data?.searchProducts?.length > 0 && (
                        <ul className="list-group position-absolute w-100 mt-1 shadow">
                            {data.searchProducts.map((p: any) => (
                                <li
                                    key={p._id}
                                    className="list-group-item list-group-item-action d-flex align-items-center"
                                    onClick={() => handleSelect(p._id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img src={p.imageUrl} alt={p.title} width="40" className="me-2 rounded" />
                                    <div>
                                        <strong>{p.title}</strong>
                                        <div className="text-muted small">₹{p.price}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Cart + User */}
                <div className="d-flex align-items-center">
                    {/* Cart */}
                    <Link to="/checkout" className="btn btn-outline-light position-relative me-3">
                        {totalItems > 0 ? <BiSolidCartAdd /> : <BiCart />}
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalItems}
                        </span>
                    </Link>

                    {/* User Menu */}
                    {user ? (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light dropdown-toggle"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <FaUser /> {user.fullName}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        <FaAddressCard /> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/my-orders">
                                        <FaListAlt /> My Orders
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {token && user.role === "ADMIN" && (
                                    <li>
                                        <button className="dropdown-item" onClick={handleAddItem}>
                                            <FaPlusCircle /> Add Product
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link className="btn btn-outline-light" to="/login">
                            <FaLock /> Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;

