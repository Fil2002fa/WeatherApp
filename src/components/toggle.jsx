import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Toggle({ città, attivato, onToggle }) {
  const [isOn, setIsOn] = useState(attivato);

  useEffect(() => {
    setIsOn(attivato); // aggiorna il toggle ogni volta che cambia da fuori
  }, [attivato]);

  function handleClick() {
    const newValue = !isOn;
    setIsOn(newValue);
    onToggle(città, newValue); // Comunica al genitore il cambiamento
  }

  const container = {
    width: "60px",
    height: "30px",
    backgroundColor: isOn ? "#4caf50" : "#ccc",
    borderRadius: "15px",
    display: "flex",
    padding: "4px",
    cursor: "pointer",
  };

  const handle = {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "#fff",
  };

  return (
    <button
      className="toggle-container"
      style={{
        ...container,
        justifyContent: isOn ? "flex-end" : "flex-start",
      }}
      onClick={handleClick}
    >
      <motion.div
        className="toggle-handle"
        style={handle}
        layout
        transition={{ type: "spring", duration: 0.2, bounce: 0.2 }}
      />
    </button>
  );
}
