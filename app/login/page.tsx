"use client";
import { supabase } from '@/lib/supabase/client';
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
export default function Login() {

//variabili di stato per email, password e messaggio
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [messaggio, setMessaggio] = useState("");
const router = useRouter();

//funzione per il login dell'utente
const login = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const { data, error } =await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setMessaggio("Login fallito");
    }else{
        setMessaggio("Login riuscito");
        router.push('/'); // reindirizza alla pagina dashboard dopo il login
    }
    
}

  return (
    <main>
        <form onSubmit={login}>
            <div>
                <h1>Login</h1>
                <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit"> Accedi </button>
            </div>
            
        </form>
        <div> <p>{messaggio}</p></div>
        
    </main>

  );
}
