import React from "react";
import { View, Button, Text } from 'react-native';
import { autenticacao } from "../firebase";
import { signOut } from "firebase/auth";

function HomeScreen(){

    const sairDoHome = () =>{
        signOut(autenticacao).then(() => navigation.navigate('Login'));
    }

    return (<View>
        <Text>Vem vindo a tela inicial!</Text>
        <Button titel="Sair" onPress={sairDoHome} />
    </View>)
}

export default HomeScreen;