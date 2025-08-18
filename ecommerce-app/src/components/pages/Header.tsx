import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaAddressCard, FaListAlt, FaLock, FaPlusCircle, FaSearch, FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function Header() {
    const { cart = [] } = useCart();
    const totalItems = Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate('/'); // Redirect after logout
        window.location.reload(); // Reload to reset state
        sessionStorage.clear(); // Clear session storage
    };
    const handleAddItem = () => {
        navigate('/admin/add-product'); // Redirect to add product page
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className='container'>
                <h2 className="col-lg-2"><Link className="navbar-brand" to={token ? "/home" : "/login"}><FaShoppingCart className="logo animate_animate animate__rubberBand" />NGKart</Link>
                </h2>
                <div className="col-lg-7 text-end">
                    <form className="d-flex ms-auto me-3">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search products..."
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-light" type="submit">
                            <FaSearch />
                        </button>
                    </form>

                </div>

                <div className="col-lg-3 text-end">

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {/* Cart Link */}
                        <li className="nav-item">
                            <Link to="/checkout" className="btn btn-outline-light position-relative">
                                <FaShoppingCart />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {totalItems}
                                </span>
                            </Link>
                        </li>

                        {/* If user is logged in */}
                        {user ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FaUser /> {user.fullName}
                                </a>
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
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>{token && user.role === 'ADMIN' ? (
                                        <button className="btn btn-default  m-1" onClick={handleAddItem}><FaPlusCircle /> Add Product</button>
                                    ) : (
                                        <></>
                                    )}</li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item text-end">
                                <Link className="nav-link border-round ml-2" to="/login">
                                    <FaLock /> Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

        </nav>
    );
}

export default Header;
