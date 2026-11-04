"use client";

import { supabase } from '@/lib/supabase/client';
import { register } from 'module';
import React, {useState} from 'react';
export default function Register() {

//variabili di stato per email, password e messaggio
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [messaggio, setMessaggio] = useState("");

//funzione per registrare l'utente
const register = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const { data, error } =await supabase.auth.signUp({ email, password });
    if (error) {
        setMessaggio("Registrazione fallita");
    }else{
        setMessaggio("Registrazione riuscita");
    }
    
}

  return (
    <main>
        <form onSubmit={register}>
            <div>
                <h1>Registrazione</h1>
                <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit"> Registrati </button>
            </div>
            
        </form>
        <div> <p>{messaggio}</p></div>
        
    </main>

  );

}