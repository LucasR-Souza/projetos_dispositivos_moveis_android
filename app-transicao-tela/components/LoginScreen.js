
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

function LoginScreen({ navigation }){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const realizarLogin = () => {
        if( email.trim() && senha.trim() !== '' ){
            if(senha.trim().length > 5){
                navigation.navigate('TelaInicial', {email})
            }else{
                alert("A senha deve ter no mínimo 6 characteres!")
            }
        }else{
            alert("Preencha os campos corretamente!")
        }
    }

    return  (
        <View style={styles.container}>
            <Text style={styles.label}>Email: </Text>
            <TextInput
                placeholder="Digite seu e-mail"
                styles={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Digite sua senha"
                styles={styles.input}
                value={senha}
                onChangeText={setSenha}
            />
            <Button title="Login" onPress={realizarLogin}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        juustifyContent: 'center',
        padding: 16
    },
    label: {
        fontSize: 18,
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4
    }
})

export default LoginScreen;