import React from "react";
import { View, Button, Text } from 'react-native';
import { autenticacao } from "../firebase";
import { signOut } from "firebase/auth";

function HomeScreen( { navigation, route }){

    const {email, uid} = route.params;

    const sairDoHome = () =>{
        signOut(autenticacao).then(() => navigation.navigate('Login'));
    }

    return (<View>
        <Text>Vem vindo a tela inicial!</Text>
        <Text>Email: {email}</Text>
        <Text>Uid: {uid}</Text>
        <Button title="Ir para Produtos" onPress={() => navigation.navigate("Produto")} />
        <Button titel="Sair" onPress={sairDoHome} />
    </View>)
}

export default HomeScreen;