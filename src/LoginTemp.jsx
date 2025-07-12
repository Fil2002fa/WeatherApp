// import "../styles/Login.css"
import React from "react";
import { LogIn } from 'lucide-react';
import { auth,googleProvider } from "./firebase";
import {signInWithEmailAndPassword,signInWithPopup } from "firebase/auth";
import {setPersistence,browserLocalPersistence,browserSessionPersistence} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './styles/Login.css';
import { Link } from "react-router-dom";


export default function Login(){
    const [name , setname] = React.useState("")
    const [email , setemail] = React.useState("")
    const [password , setpassword] = React.useState("")
    const [rememberMe, setRememberMe] = React.useState(false);
      const navigate = useNavigate();
     
      const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Login riuscito:", user);
    alert("Accesso eseguito con successo!");
    navigate("/home"); // ✅ AGGIUNGI QUESTO

  } catch (error) {
    console.error("Errore login:", error.message);
    alert("Email o password errati.");
  }
};
      

    const signwithGoogle = async () => {
        try {
    await signInWithPopup(auth, googleProvider);
    console.log("Utente registrato con successo");
   navigate("/home"); // ✅ Vai alla Home
  } catch (err) {
    console.error("Errore durante la registrazione:", err.message);
  }
};
        function holdelemail(e){
            setemail(e.target.value)
        }
        function holdpassword(e){
            setpassword(e.target.value)
        }
        function holdrememeberMe(e){
            setRememberMe(e.target.value)
        }


    return(
        <>
         <div className="page-wrapper">
          <main className="container-pricipal">
         <form onSubmit={handleLogin}>
         <LogIn className="loginIcon" size={33} />
              <div className="container-header">
                <h1>Access to your Account</h1>
                <p>Inserisci le tue credenziali per accedere al tuo account</p>
              </div>

              <div className="container-input">
                <p>Email Address</p>
                    <input 
                    type="email" 
                    placeholder="Example@gmail.com" 
                    onChange={holdelemail}
                    />
                <p>Password</p> 
                    <input 
                    type="password" 
                    placeholder="ExamplePassword" 
                    onChange={holdpassword}
                    
                    />
                <p>Password dimenticata?</p>
              </div>
              <div className="container-checkbox">
               
                    <input type="checkbox" 
                    checked={rememberMe}
                    onChange={holdrememeberMe}
                    />
                 <p>Ricordami</p>
               </div>
               
            <div className="container-access">
                <button type="submit">Accedi</button>
            </div>
            <div className="container-singIn">
                <p>
                  You don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>

            <div className="container-google">
                <p>OR CONTINUE WITH GOOGLE</p>
                <button onClick={signwithGoogle}>Google</button>
            </div>
            
            </form>
         </main>
         </div>
        </>
    )

}