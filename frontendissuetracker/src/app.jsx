import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar"
import ProyectosList from "./ProyectosList";
import ProyectoDetail from "./ProyectoDetail";
const App = () => {
    return (

        <BrowserRouter>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/proyectos" element={<ProyectosList />} />
                    <Route path="/proyectos/:id" element={<ProyectoDetail />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;