import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password
            });
            const { token } = response.data;
            localStorage.setItem("token", token);
            navigate("/proyectos");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error al iniciar sesion";
            setFormError(message);
            console.error("Error al iniciar sesion:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/proyectos", { replace: true });
        }
    }, [navigate]);
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title mb-4 fw-bold text-center">Iniciar Sesión</h2>

                            {formError ? (
                                <div className="alert alert-warning" role="alert">
                                    {formError}
                                </div>
                            ) : null}

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="******"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Ingresar
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;