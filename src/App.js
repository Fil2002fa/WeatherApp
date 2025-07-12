import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./LoginTemp";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  const isAuthenticated = localStorage.getItem("auth"); // opzionale se usi Firebase

  return (
    <Router>
      <Routes>
        {/* Route iniziale: se loggato va alla home, altrimenti login */}
        <Route path="/" element={
          isAuthenticated ?
            <Navigate to="/home" /> :
            <Navigate to="/login" />
        } />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Home protetta */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
