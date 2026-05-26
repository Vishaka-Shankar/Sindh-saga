import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { setLoggedIn } from './(tabs)/index';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    // TODO: replace with real login logic
    setLoggedIn(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>سنڌ</Text>
          <Text style={styles.appName}>Sindh Saga</Text>
          <Text style={styles.tagline}>Discover the stories of Sindh</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/create-account')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0D', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 24 },
  header: { alignItems: 'center', marginBottom: 32, paddingTop: 16 },
  logo: { fontSize: 48, color: '#C9A84C', fontWeight: '700', letterSpacing: 2 },
  appName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5, marginTop: 4 },
  tagline: { fontSize: 13, color: '#888', marginTop: 4, letterSpacing: 0.5 },
  card: { backgroundColor: '#1A1A1A', borderRadius: 20, padding: 28, borderWidth: 1, borderColor: '#2A2A2A' },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#AAAAAA', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { backgroundColor: '#242424', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#FFFFFF', borderWidth: 1, borderColor: '#333' },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 70 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  eyeText: { fontSize: 13, color: '#C9A84C', fontWeight: '600' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotText: { fontSize: 13, color: '#C9A84C', fontWeight: '500' },
  primaryBtn: { backgroundColor: '#C9A84C', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  primaryBtnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A2A2A' },
  dividerText: { color: '#555', marginHorizontal: 12, fontSize: 13 },
  secondaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', borderWidth: 1.5, borderColor: '#C9A84C' },
  secondaryBtnText: { color: '#C9A84C', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
});
