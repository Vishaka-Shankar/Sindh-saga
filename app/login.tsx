import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { setLoggedIn } from './(tabs)/index';

// ── 8-color rainbow stripe (matches HomeScreen hero) ─────────────────────────
function RainbowStripe() {
  return (
    <View style={styles.rainbowRow}>
      {RAINBOW.map((c, i) => (
        <View key={i} style={[styles.rainbowSeg, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

// ── Ajrak diamond row ─────────────────────────────────────────────────────────
function AjrakBorder() {
  return (
    <View style={styles.ajrakRow}>
      {RAINBOW.map((c, i) => (
        <View key={i} style={[styles.ajrakDia, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;
  const animateBtn = (v: number) =>
    Animated.spring(btnScale, { toValue: v, useNativeDriver: true, speed: 20 }).start();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    setLoggedIn(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero card (matches HomeScreen CulturalHero) ── */}
          <View style={styles.heroCard}>
            {/* Triangle background shapes */}
            <View style={styles.triangleTop} />
            <View style={styles.triangleBottom} />

            {/* SINDH SAGA badge */}
            <View style={styles.sagaBadge}>
              <Text style={styles.sagaBadgeText}>SINDH SAGA</Text>
            </View>

            {/* Sindhi script */}
            <Text style={styles.heroSindhi}>سنڌي ورثو</Text>
            <Text style={styles.heroTitle}>Sindhu Ki Kahani</Text>

            {/* Rainbow stripe */}
            <RainbowStripe />

            <Text style={styles.heroTagline}>
              Discover the stories of Sindh
            </Text>
            <Text style={styles.heroSub}>
              ◆ Sindhi Heritage · سنڌ جي ڪهاڻيون ◆
            </Text>
          </View>

          {/* ── Login card ── */}
          <View style={styles.card}>
            <AjrakBorder />

            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue your journey</Text>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <View style={[styles.inputWrap, emailFocused && styles.inputFocused]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#A89880"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={[styles.inputWrap, passwordFocused && styles.inputFocused]}>
                <Text style={styles.inputIcon}>◉</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#A89880"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In — brick red, matches "Record a story" button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleLogin}
                onPressIn={() => animateBtn(0.97)}
                onPressOut={() => animateBtn(1)}
                activeOpacity={1}
              >
                <Text style={styles.primaryBtnText}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divDia}>◆</Text>
              <View style={styles.divLine} />
            </View>

            {/* Create account — outline style, matches "Explore stories" */}
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/create-account')}
              activeOpacity={0.8}
            >
              <Text style={styles.outlineBtnText}>Create an Account</Text>
            </TouchableOpacity>

            <AjrakBorder />
          </View>

          <Text style={styles.footerNote}>سنڌي ورثو · Sindhi Heritage</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const RAINBOW = ['#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#E67E22', '#9B59B6', '#1ABC9C', '#2980B9'];
const BG       = '#E8DDD0';      // sandy beige page bg
const INDIGO   = '#2C3E7A';      // deep indigo (hero card)
const BRICK    = '#C0392B';      // brick red (primary button)
const GOLD     = '#C9A84C';      // gold (badge border, accents)
const CARD_BG  = '#FFFFFF';      // white card

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // Hero card
  heroCard: {
    backgroundColor: INDIGO,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  triangleTop: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -80,
    width: 0,
    height: 0,
    borderLeftWidth: 80,
    borderRightWidth: 80,
    borderBottomWidth: 130,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(216,180,140,0.15)',
  },
  triangleBottom: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    marginLeft: -60,
    width: 0,
    height: 0,
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderTopWidth: 90,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(216,180,140,0.10)',
  },
  sagaBadge: {
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginBottom: 14,
  },
  sagaBadgeText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
  heroSindhi: {
    color: '#E8D9C0',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  rainbowRow: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '70%',
    marginBottom: 14,
  },
  rainbowSeg: {
    flex: 1,
  },
  heroTagline: {
    color: '#C8BBAA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  heroSub: {
    color: '#9A8E7A',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  // Ajrak border
  ajrakRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginVertical: 14,
  },
  ajrakDia: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },

  // Login card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4C8B8',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: INDIGO,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#8A7A6A',
    marginBottom: 20,
  },

  // Fields
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: INDIGO,
    letterSpacing: 2,
    marginBottom: 6,
    opacity: 0.7,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0EA',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D4C8B8',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: INDIGO,
    backgroundColor: '#EEE8DF',
  },
  inputIcon: {
    fontSize: 14,
    color: INDIGO,
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C2010',
    padding: 0,
  },
  eyeText: {
    fontSize: 10,
    color: BRICK,
    fontWeight: '700',
    letterSpacing: 1,
    paddingLeft: 8,
  },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: BRICK, fontWeight: '500' },

  // Primary button — solid brick red (matches "Record a story")
  primaryBtn: {
    backgroundColor: BRICK,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: '#D4C8B8' },
  divDia: { color: GOLD, fontSize: 10, marginHorizontal: 10 },

  // Outline button — matches "Explore stories"
  outlineBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BRICK,
    backgroundColor: 'transparent',
  },
  outlineBtnText: {
    color: BRICK,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  footerNote: {
    textAlign: 'center',
    color: '#A89880',
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 20,
  },
});
