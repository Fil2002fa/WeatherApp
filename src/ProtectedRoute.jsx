import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [utente, setUtente] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUtente(user);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        Caricamento...
      </div>
    );
  }

  if (!utente) {
    return <Navigate to="/login" replace />;
  }

  // 👉 Aggiunto wrapper per evitare problemi di layout
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
