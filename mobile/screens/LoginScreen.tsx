import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button, Alert } from 'react-native';
import { LoginScreenProps } from '../navigation/types'; 
import { authClient } from '../api/auth-client';
import { DEFAULT_DOCTOR_ID } from '../api/config';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Cores = {
  verdePrincipal: '#86A789',
  fundo: '#F5F5F5',
  textoInput: '#333',
  bordaInput: '#DCDCDC',
  cinzaClaro: '#B2B2B2'
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
        await authClient.signIn.email({
            email,
            password,
        });
        const doctorId = DEFAULT_DOCTOR_ID;
        navigation.navigate('Chamados', { doctorId });
    };

  return (
     <View style={styles.container}>
      <Text style={styles.title}>Login Médico</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: Cores.fundo,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Cores.bordaInput,
    color: Cores.textoInput,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Cores.verdePrincipal,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: Cores.textoInput,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen;