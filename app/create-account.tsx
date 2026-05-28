import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
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

import { setLoggedIn } from './(tabs)/index';

// ── 8-color rainbow stripe ────────────────────────────────────────────────────
const RAINBOW = ['#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#E67E22', '#9B59B6', '#1ABC9C', '#2980B9'];

function RainbowStripe({ slim }: { slim?: boolean }) {
  return (
    <View style={[styles.rainbowRow, slim && { height: 3, marginVertical: 10 }]}>
      {RAINBOW.map((c, i) => (
        <View key={i} style={[styles.rainbowSeg, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

function AjrakBorder() {
  return (
    <View style={styles.ajrakRow}>
      {RAINBOW.map((c, i) => (
        <View key={i} style={[styles.ajrakDia, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <View
            style={[
              styles.stepDot,
              i < current && styles.stepDotDone,
              i === current && styles.stepDotActive,
            ]}
          >
            {i < current
              ? <Text style={styles.stepCheck}>✓</Text>
              : i === current
              ? <View style={styles.stepDotInner} />
              : null}
          </View>
          {i < total - 1 && (
            <View style={[styles.stepLine, i < current && styles.stepLineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default function CreateAccountScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const btnScale = useRef(new Animated.Value(1)).current;
  const animateBtn = (v: number) =>
    Animated.spring(btnScale, { toValue: v, useNativeDriver: true, speed: 20 }).start();

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim()) { Alert.alert('Missing Info', 'Please enter your full name.'); return; }
      setStep(1);
    } else if (step === 1) {
      if (!email.trim() || !password.trim()) { Alert.alert('Missing Fields', 'Please fill in all fields.'); return; }
      if (password !== confirmPassword) { Alert.alert('Password Mismatch', 'Passwords do not match.'); return; }
      setStep(2);
    }
  };

  const handleCreate = () => {
    // TODO: Firebase create account logic
    setLoggedIn(true);
    router.replace('/(tabs)');
  };

  const inp = (field: string) => [styles.inputWrap, focused === field && styles.inputFocused];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Mini hero ── */}
          <View style={styles.heroCard}>
            <View style={styles.triangleTop} />
            <View style={styles.sagaBadge}>
              <Text style={styles.sagaBadgeText}>SINDH SAGA</Text>
            </View>
            <Text style={styles.heroSindhi}>سنڌي ورثو</Text>
            <Text style={styles.heroTitle}>Join the Saga</Text>
            <RainbowStripe />
            <Text style={styles.heroSub}>◆ Begin your cultural journey ◆</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <AjrakBorder />

            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Your story starts here</Text>

            <StepIndicator current={step} total={3} />

            {/* ── Step 0: Identity ── */}
            {step === 0 && (
              <View>
                <Text style={styles.stepHeading}>Your Identity</Text>
                <Text style={styles.stepDesc}>How shall we know you, traveller?</Text>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>FULL NAME</Text>
                  <View style={inp('name')}>
                    <Text style={styles.inputIcon}>◈</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Your full name"
                      placeholderTextColor="#A89880"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>
                    DISPLAY NAME <Text style={styles.optTag}>(OPTIONAL)</Text>
                  </Text>
                  <View style={inp('display')}>
                    <Text style={styles.inputIcon}>◇</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="How you appear to others"
                      placeholderTextColor="#A89880"
                      value={displayName}
                      onChangeText={setDisplayName}
                      autoCapitalize="words"
                      onFocus={() => setFocused('display')}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* ── Step 1: Credentials ── */}
            {step === 1 && (
              <View>
                <Text style={styles.stepHeading}>Your Credentials</Text>
                <Text style={styles.stepDesc}>Secure your access to Sindh Saga</Text>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>EMAIL</Text>
                  <View style={inp('email')}>
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
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>PASSWORD</Text>
                  <View style={inp('password')}>
                    <Text style={styles.inputIcon}>◉</Text>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Create a password"
                      placeholderTextColor="#A89880"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Text style={styles.eyeText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
                  <View style={inp('confirm')}>
                    <Text style={styles.inputIcon}>◉</Text>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Repeat your password"
                      placeholderTextColor="#A89880"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      onFocus={() => setFocused('confirm')}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Text style={styles.eyeText}>{showConfirm ? 'HIDE' : 'SHOW'}</Text>
                    </TouchableOpacity>
                  </View>
                  {confirmPassword.length > 0 && (
                    <Text style={[styles.matchHint, password === confirmPassword ? styles.matchOk : styles.matchErr]}>
                      {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* ── Step 2: Confirmation ── */}
            {step === 2 && (
              <View style={styles.confirmWrap}>
                <View style={styles.confirmBadge}>
                  <Text style={styles.confirmBadgeText}>✦</Text>
                </View>
                <Text style={styles.confirmTitle}>Almost There!</Text>
                <Text style={styles.confirmSubtitle}>
                  Welcome to Sindh Saga,{'\n'}
                  <Text style={styles.confirmName}>{displayName || name}</Text>
                </Text>
                <RainbowStripe slim />
                <Text style={styles.confirmSindhi}>سنڌ جي ڪهاڻيون توهان جو انتظار ڪري رهيون آهن</Text>
                <Text style={styles.confirmHint}>The stories of Sindh await you.</Text>

                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>NAME</Text>
                  <Text style={styles.summaryValue}>{name}</Text>
                  <View style={styles.summaryDivider} />
                  <Text style={styles.summaryLabel}>EMAIL</Text>
                  <Text style={styles.summaryValue}>{email}</Text>
                </View>
              </View>
            )}

            {/* ── Action button ── */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={step < 2 ? handleNext : handleCreate}
                onPressIn={() => animateBtn(0.97)}
                onPressOut={() => animateBtn(1)}
                activeOpacity={1}
              >
                <Text style={styles.primaryBtnText}>
                  {step === 0 ? 'Continue →' : step === 1 ? 'Continue →' : 'Begin My Journey →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Back / sign in row */}
            <View style={styles.bottomRow}>
              {step > 0
                ? <TouchableOpacity onPress={() => setStep(s => s - 1)}>
                    <Text style={styles.backText}>← Back</Text>
                  </TouchableOpacity>
                : <View />
              }
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.signInText}>Already have an account? Sign In</Text>
              </TouchableOpacity>
            </View>

            <AjrakBorder />
          </View>

          <Text style={styles.footerNote}>سنڌي ورثو · Sindhi Heritage</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG     = '#E8DDD0';
const INDIGO = '#2C3E7A';
const BRICK  = '#C0392B';
const GOLD   = '#C9A84C';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: { paddingHorizontal: 20, paddingVertical: 24 },

  rainbowRow: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '70%',
    marginVertical: 12,
  },
  rainbowSeg: { flex: 1 },

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
    opacity: 0.85,
  },

  // Hero card
  heroCard: {
    backgroundColor: INDIGO,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  triangleTop: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -70,
    width: 0,
    height: 0,
    borderLeftWidth: 70,
    borderRightWidth: 70,
    borderBottomWidth: 110,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(216,180,140,0.15)',
  },
  sagaBadge: {
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
  },
  sagaBadgeText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 3 },
  heroSindhi: { color: '#E8D9C0', fontSize: 16, marginBottom: 2, textAlign: 'center' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  heroSub: { color: '#9A8E7A', fontSize: 11, fontStyle: 'italic', letterSpacing: 0.5 },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
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
  cardTitle: { fontSize: 22, fontWeight: '800', color: INDIGO, marginBottom: 4, letterSpacing: 0.3 },
  cardSubtitle: { fontSize: 13, color: '#8A7A6A', marginBottom: 20 },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: '#D4C8B8',
    backgroundColor: '#F5F0EA',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { borderColor: BRICK, backgroundColor: '#FDF0EE' },
  stepDotDone: { borderColor: INDIGO, backgroundColor: '#EEF0F8' },
  stepDotInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: BRICK },
  stepCheck: { fontSize: 11, color: INDIGO, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#D4C8B8' },
  stepLineDone: { backgroundColor: INDIGO, opacity: 0.4 },

  stepHeading: { fontSize: 15, fontWeight: '700', color: INDIGO, marginBottom: 3 },
  stepDesc: { fontSize: 12, color: '#8A7A6A', marginBottom: 16 },

  // Fields
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: INDIGO, letterSpacing: 2, marginBottom: 6, opacity: 0.7 },
  optTag: { fontSize: 9, color: '#A89880', letterSpacing: 1 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F0EA', borderRadius: 10,
    borderWidth: 1.5, borderColor: '#D4C8B8',
    paddingHorizontal: 14, paddingVertical: 12,
  },
  inputFocused: { borderColor: INDIGO, backgroundColor: '#EEE8DF' },
  inputIcon: { fontSize: 13, color: INDIGO, marginRight: 10, opacity: 0.6 },
  input: { flex: 1, fontSize: 15, color: '#2C2010', padding: 0 },
  eyeText: { fontSize: 10, color: BRICK, fontWeight: '700', letterSpacing: 1, paddingLeft: 8 },

  matchHint: { fontSize: 11, marginTop: 5 },
  matchOk: { color: '#27AE60' },
  matchErr: { color: BRICK },

  // Confirm step
  confirmWrap: { alignItems: 'center', paddingVertical: 8 },
  confirmBadge: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderColor: GOLD,
    backgroundColor: '#FDF8EE',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  confirmBadgeText: { fontSize: 24, color: GOLD },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: INDIGO, marginBottom: 6, textAlign: 'center' },
  confirmSubtitle: { fontSize: 14, color: '#6A5A4A', textAlign: 'center', lineHeight: 22, marginBottom: 4 },
  confirmName: { color: BRICK, fontWeight: '700' },
  confirmSindhi: { fontSize: 12, color: '#8A7A6A', textAlign: 'center', letterSpacing: 0.5, marginBottom: 4, lineHeight: 20 },
  confirmHint: { fontSize: 12, color: '#A89880', fontStyle: 'italic', marginBottom: 16 },
  summaryBox: {
    width: '100%',
    backgroundColor: '#F5F0EA', borderRadius: 10,
    borderWidth: 1, borderColor: '#D4C8B8',
    padding: 14, marginBottom: 16,
  },
  summaryLabel: { fontSize: 9, fontWeight: '700', color: INDIGO, letterSpacing: 2, opacity: 0.6, marginBottom: 3 },
  summaryValue: { fontSize: 14, color: '#2C2010', marginBottom: 10 },
  summaryDivider: { height: 1, backgroundColor: '#D4C8B8', marginBottom: 10 },

  // Buttons
  primaryBtn: {
    backgroundColor: BRICK, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 2 },
  backText: { fontSize: 13, color: INDIGO, fontWeight: '600' },
  signInText: { fontSize: 12, color: BRICK, fontWeight: '500' },

  footerNote: { textAlign: 'center', color: '#A89880', fontSize: 11, letterSpacing: 1.5, marginTop: 20 },
});
