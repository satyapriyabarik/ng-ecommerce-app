
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaAddressCard, FaListAlt, FaLock, FaPlusCircle, FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { BiCart, BiSolidCartAdd } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "../../graphql/mutations";
import { useState, useEffect, useRef } from "react";
import { useCartIcon } from "../../context/CartIconContext";

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
    const [cartAnim, setCartAnim] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const cartRef = useCartIcon();
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
    useEffect(() => {
        if (totalItems > 0) {
            const timer = setTimeout(() => setCartAnim(true), 1000);
            return () => clearTimeout(timer);
        }

    }
        , [totalItems]);
    return (

        <nav className="navbar navbar-dark bg-dark sticky-top">
            <div className="container">
                {/* First Row: Logo + Cart/Login */}
                <div className="d-flex w-100 align-items-center justify-content-between">
                    {/* Logo */}
                    <h2 className="m-0">
                        <Link className="navbar-brand d-flex align-items-center" to={"/home"}>
                            <TiShoppingCart size="2em" className="logo animate_animate animate__rubberBand me-2" />
                            NGKart
                        </Link>
                    </h2>

                    {/* Search (Desktop Only, centered, 70%) */}
                    <div className="d-none d-lg-flex flex-grow-1 justify-content-center" ref={wrapperRef}>
                        <div className="position-relative w-100" style={{ maxWidth: "70%" }}>
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
                    </div>

                    {/* Cart + User */}
                    <div className="d-flex align-items-center">
                        {/* Cart */}
                        <Link to="/checkout" className="btn btn-outline-light position-relative me-3" ref={cartRef}>
                            {totalItems > 0 ? (
                                <BiSolidCartAdd className={`${cartAnim ? "animate__animated animate__bounce" : ""}`} />
                            ) : (
                                <BiCart />
                            )}
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

                {/* Second Row (Mobile Only Search, full width, centered) */}
                <div className="d-flex d-lg-none justify-content-center mt-2" ref={wrapperRef}>
                    <div className="position-relative w-100" style={{ maxWidth: "90%" }}>
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
                </div>
            </div>
        </nav>


    );
}

export default Header;

