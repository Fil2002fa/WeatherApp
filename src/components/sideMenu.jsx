import { X } from 'lucide-react';
import '../styles/Sidebar.css';
import Toggle from './toggle';
import { useState } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // ⚠️ assicurati che il percorso sia corretto
import emailjs from 'emailjs-com';

export default function SideMenu({ show, onClose, cittaSelezionatePreferite }) {
  // 🔧 Costruzione stato iniziale
  const [attivazioni, setAttivazioni] = useState(() => {
    const iniziali = {};
    cittaSelezionatePreferite.forEach(città => {
      iniziali[città] = false;
    });
    return iniziali;
  });

  function sendEmail(userName, userEmail, città, weatherMessage) {
  const templateParams = {
    name: userName,
    user_email: userEmail,
    city: città,
    weather: weatherMessage,
    time: new Date().toLocaleString(),
    message: `Ciao ${userName}, ecco le previsioni per ${città}: ${weatherMessage}`,
  };

  return emailjs.send(
    'service_g5vq938',
    'template_hi4bekt',
    templateParams,
    '6VMh25seJWxjUntdG'
  )
  .then((response) => {
    console.log('✅ Email inviata con successo:', response.status, response.text);
    alert("Email inviata con successo!");
  })
  .catch((err) => {
    console.error('❌ Errore durante l’invio dell’email:', err);
    alert("Errore nell’invio dell’email. Riprova più tardi.");
  });
}






  // 🔁 Gestione cambio toggle
 async function handleToggle(città, nuovoStato) {
  setAttivazioni(prev => {
    const nuovaAttivazione = {};
    for (const key in prev) nuovaAttivazione[key] = false;
    if (nuovoStato) nuovaAttivazione[città] = true;
    return nuovaAttivazione;
  });

  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      // ✅ Salva la preferenza in Firestore
      await setDoc(doc(db, "utenti", user.uid), {
        preferenzaUnica: nuovoStato ? città : null,
        email: user.email,
        nome: user.displayName || "Utente",
      }, { merge: true });

      console.log("✅ Preferenza aggiornata in Firestore:", nuovoStato ? città : "rimosso");

      // ✅ Invia email immediata se il toggle è attivato
      if (nuovoStato) {
        const weatherMessage = "Soleggiato"; // sostituisci con meteo reale se vuoi
        await sendEmail(
          user.displayName || "Utente",
          user.email,
          città,
          weatherMessage
        );
      }
    } catch (err) {
      console.error("❌ Errore nel salvataggio su Firestore:", err);
    }
  } else {
    console.warn("Utente non loggato. Impossibile salvare preferenza.");
  }
}

  return (
    <div className={show ? 'sidenav active' : 'sidenav'}>
      <button onClick={onClose} className="close-button">
        <X />
      </button>
      <div className="cittaprefeSidemenu">
        <p>
          Toggle on to immediately receive an email with the weather in your city.
        </p>
        {cittaSelezionatePreferite.slice(0, 3).map((città, index) => (
          <div key={index} className="città-voce">
            <span>{città}</span>
            <Toggle
              città={città}
              attivato={attivazioni[città]}
              onToggle={handleToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
