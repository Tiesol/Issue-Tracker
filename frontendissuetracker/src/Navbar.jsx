import { Link, useNavigate } from 'react-router-dom';
const Navbar = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Issue Tracker</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {!token ? (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link"
                                    onClick={handleLogout}
                                    style={{ textDecoration: 'none' }}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}


export default Navbar;