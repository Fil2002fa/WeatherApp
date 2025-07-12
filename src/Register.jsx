import { db } from "./firebase"; // importa Firestore
import { doc, setDoc } from "firebase/firestore"; // importa funzioni Firestore
import './styles/Registrazione.css';
import React from "react";
import IconCircle from "./IconCircle"; // metti quel cazzo di due puntini
import { auth, googleProvider} from "./firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
    const [name , setname] = React.useState("")
    const [email , setemail] = React.useState("")
    const [password , setpassword] = React.useState("")
    const [checkpassword, setcheckpassword] = React.useState("");
    const [pravacy , setpravacy] = React.useState(false)
    
    const navigate = useNavigate();
          const signIn = async (e) => {
  e.preventDefault();

  if (password !== checkpassword) {
    alert("Le password non corrispondono");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password.trim()
    );
    const user = userCredential.user;

    console.log("✅ UserCredential:", userCredential); // 🔥 LOG 1
    console.log("✅ auth.currentUser subito dopo createUser:", auth.currentUser); // 🔥 LOG 2

    await setDoc(doc(db, "users", user.uid), {
      nome: name,
      email: user.email,
      preferenzaUnica: ""
    }, { merge: true });

    console.log("✅ Navigating to /home ora...");
    navigate("/home");
  } catch (err) {
    console.error("❌ Errore registrazione:", err.code, err.message);
    if (err.code === "auth/email-already-in-use") {
      alert("Questa email è già registrata. Prova a fare il login.");
    } else {
      alert("Errore: " + err.message);
    }
  }
};


      const signwithGoogle = async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                await setDoc(doc(db, "users", user.uid), {
                nome: user.displayName || "",
                email: user.email,
                preferenzaUnica: ""
                }, { merge: true });
                navigate("/home");
                console.log("Utente registrato con Google e salvato in Firestore");
            } catch (err) {
                console.error("Errore durante la registrazione con Google:", err.message);
            }
            };
        function holdname(e){
            setname(e.target.value)
        }
        function holdelemail(e){
            setemail(e.target.value)
        }
        function holdpassword(e){
            setpassword(e.target.value)
        }

        function holdcheckpassword(e) {
            setcheckpassword(e.target.value);
          }
       

        const isLongEnough = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        
    return(
        <>
            <div className="page-wrapper">
                         <main className="container-pricipal">
        <IconCircle />
         <form onSubmit={signIn}>

              <div className="container-header">
                <h1>Create Your Account</h1>
                <p>Join our community today and get started</p>
              </div>
              
              <div className="container-input">
                <p>Full Name</p>
                    <input 
                    type="text" 
                    placeholder="FilippoLoro" 
                    onChange={holdname}
                    required/>
                <p>Email Address</p>
                    <input 
                    type="email" 
                    placeholder="Example@gmail.com" 
                    onChange={holdelemail}
                    required/>
                <p>Password</p> 
                    <input 
                    type="password" 
                    placeholder="ExamplePassword" 
                    onChange={holdpassword}
                    minLength={8}
                    required/>

                    <div className="password-requirements">
                        <p className={isLongEnough ? "valid" : "invalid"}>• At least 8 characters</p>
                        <p className={hasLowerCase ? "valid" : "invalid"}>• At least one lowercase letter</p>
                        <p className={hasNumber ? "valid" : "invalid"}>• At least one number</p>
                    </div>


                <p>Confirm Password</p>
                    <input 
                    type="password" 
                    placeholder="Confirm" 
                    onChange={holdcheckpassword}
                    required/>
              </div>
               
                <div className="container-createaccount">
                     <button type="submit">Create Account</button>
                </div>

               <div className="container-google">
                    <p>OR CONTINUE WITH GOOGLE</p>
                    <button onClick={signwithGoogle}>Google</button>
                </div>

              <div className="container-singIn">
                    <p>
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
            </div>
            </form>
         </main>
            </div>
        </>
    )

}