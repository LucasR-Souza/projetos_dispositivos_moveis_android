import React, { useState } from "react";
import { View, TextInput, Button, Text } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { autenticacao } from "../firebase";

function LoginScreen( {navigation} ){

    const [email, setEmail] = useState('');
    const [senha, setSetnha] = useState('');

    const RealizarLogin = async () => {
        try{
        const credenciais_do_usuario = await signInWithEmailAndPassword(autenticacao, email, senha)
        const usuario = credenciais_do_usuario.user;
        console.log(usuario);
        
            navigation.navigate('Home', {
            email: usuario.email,
            uid: usuario.uid
            });
    
        }catch (error) {
            if (error.code === 'auth/wrong-password'){
                console.log("Senha incorreta, tente novamente.")
            }else if(error.code === 'auth/user-not-fount'){
                console.log("Usurio nao encontrado");
            }else if(error.code === 'auth/user-not-found'){
                console.log("Email Invalido.");
            }
        }   
    }

    return(
    <View>
        <Text>Login</Text>    
        <TextInput placeholder="E-mail" onChangeText={setEmail} value={email} />
        <TextInput placeholder="Senha" secureTextEntry onChangeText={setSetnha} value={senha} />
        <Button title="Entrar" onPress={RealizarLogin} />
        <Button title="Cadastrar" onPress={(() => navigation.navigate("Registrar"))} />
    </View>
    )

}

export default LoginScreen