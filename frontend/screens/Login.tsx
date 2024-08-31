import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import { useAuth } from '../AuthContext';
export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { setUsername: setAuthUsername } = useAuth(); // Access the context's setUsername
  const navigation = useNavigation<any>(); // Initialize navigation

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async () => {
  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }
  
  try {
    const response = await axios.post('http://10.0.0.129:8000/login/', {
      email: username,
      password: password
    });
    console.log('Logged in:', response.status);
    setAuthUsername(username);
    navigation.reset({
      index: 1,
      routes: [{ name: 'Index' }],
    });
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your credentials.');
  }
};

const handleRegister = async () => {
  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  if (password != confirmPassword){
    alert("passwords are not matching.");
    return;

  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const response = await axios.post('http://10.0.0.129:8000/register/', {
      email: username,
      password: password
    });
    console.log('Registered:', response.status);
    setAuthUsername(username);
    navigation.reset({
      index: 1,
      routes: [{ name: 'Index' }],
    });
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
};
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#8e44ad"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8e44ad"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#8e44ad"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={isLogin ? handleLogin : handleRegister}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleForm}>
          <Text style={styles.toggleButtonText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 10,
    color: '#8e44ad',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'black',
    fontSize: 14,
  },
});
