import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroPilgrimageCarousel, PilgrimageCarouselItem } from '@/components/HeroPilgrimageCarousel';
import { Icon, PrimaryButton } from '@/components/YatraUI';
import { useYatra } from '@/context/YatraContext';
import { useColors } from '@/hooks/useColors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ── Pilgrimage destinations for the carousel ─────────────────────────────────
const DESTINATIONS: PilgrimageCarouselItem[] = [
  {
    id: 'tirumala',
    title: 'Tirumala\nTirupati',
    subtitle: 'Andhra Pradesh',
    image: require('@/assets/images/tirumala.jpg'),
    accent: '#B8860B',
    meta: ['5 LAKH DAILY', 'YEAR-ROUND'],
  },
  {
    id: 'prayagraj',
    title: 'Prayagraj\nKumbh',
    subtitle: 'Uttar Pradesh',
    image: require('@/assets/images/prayagraj.png'),
    accent: '#C84B11',
    meta: ['MAHA KUMBH', '2025'],
  },
  {
    id: 'varanasi',
    title: 'Varanasi\nGanga Aarti',
    subtitle: 'Uttar Pradesh',
    image: require('@/assets/images/varanasi.jpg'),
    accent: '#7B2D35',
    meta: ['GHAT CEREMONY', 'EVERY EVENING'],
  },
  {
    id: 'rameshwaram',
    title: 'Rameshwaram\nTemple',
    subtitle: 'Tamil Nadu',
    image: require('@/assets/images/rameswaram.jpg'),
    accent: '#0077B6',
    meta: ['CHAR DHAM', 'COASTAL PILGRIM'],
  },
];

// The carousel occupies this fraction of the screen height
const CAROUSEL_H = SCREEN_H * 0.52;

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useYatra();

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const isAuthority = email.trim().toLowerCase() === 'admin';
    if (!isAuthority && (!email.trim() || !email.includes('@'))) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a valid email address.');
      } else {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      }
      return;
    }
    if (!password || password.length < 4) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a password with at least 4 characters.');
      } else {
        Alert.alert('Invalid Password', 'Please enter a password with at least 4 characters.');
      }
      return;
    }

    setLoading(true);

    if (isLoginMode) {
      const res = await signIn(email, password);
      setLoading(false);
      if (res.success) {
        // DestinationGuard in _layout will automatically route authority vs pilgrim
      } else {
        if (Platform.OS === 'web') {
          window.alert(res.error || 'Please check your email and password.');
        } else {
          Alert.alert('Login Failed', res.error || 'Please check your email and password.');
        }
      }
    } else {
      if (!name.trim()) {
        setLoading(false);
        if (Platform.OS === 'web') {
          window.alert('Please enter your name.');
        } else {
          Alert.alert('Missing Name', 'Please enter your name.');
        }
        return;
      }
      const res = await signUp(name, email, password);
      setLoading(false);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        if (Platform.OS === 'web') {
          window.alert(res.error || 'Could not complete registration.');
        } else {
          Alert.alert('Registration Failed', res.error || 'Could not complete registration.');
        }
      }
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Hero Carousel (top portion) ── */}
      <HeroPilgrimageCarousel
        items={DESTINATIONS}
        height={CAROUSEL_H}
        width={SCREEN_W}
        autoplay
        autoplayDelay={4200}
      />

      {/* YatraGuard brand mark pinned over the carousel top-left */}
      <View style={[styles.brandOverlay, { top: insets.top + 14 }]}>
        <View style={styles.brandPill}>
          <Icon name="shield" size={13} color="#FFFFFF" />
          <Text style={styles.brandText}>YATRAGUARD</Text>
        </View>
      </View>

      {/* ── Form Panel (bottom portion) ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formOuter}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.formScroll,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          {/* Glass card */}
          <View style={[styles.glassCard, { backgroundColor: colors.background }]}>
            {/* Tab row */}
            <View style={[styles.tabRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Pressable
                onPress={() => setIsLoginMode(false)}
                style={[styles.tab, !isLoginMode && { backgroundColor: colors.saffron }]}
              >
                <Text style={[styles.tabText, { color: !isLoginMode ? '#FFFFFF' : colors.inkSoft }]}>
                  Sign Up
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsLoginMode(true)}
                style={[styles.tab, isLoginMode && { backgroundColor: colors.saffron }]}
              >
                <Text style={[styles.tabText, { color: isLoginMode ? '#FFFFFF' : colors.inkSoft }]}>
                  Sign In
                </Text>
              </Pressable>
            </View>

            {/* Headline */}
            <Text style={[styles.formHeadline, { color: colors.ink }]}>
              {isLoginMode ? 'Welcome back,\nPilgrim' : 'Begin your\nYatra safely'}
            </Text>
            <Text style={[styles.formSub, { color: colors.inkSoft }]}>
              {isLoginMode
                ? 'Sign in to access crowd alerts, route guidance and family tracking.'
                : 'Create a free account — your safety companion on every pilgrimage.'}
            </Text>

            {/* Fields */}
            <View style={styles.fields}>
              {!isLoginMode && (
                <InputRow
                  icon="user"
                  placeholder="Full name"
                  value={name}
                  onChangeText={setName}
                  colors={colors}
                />
              )}
              <InputRow
                icon="mail"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                colors={colors}
              />
              <InputRow
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                colors={colors}
              />
            </View>

            {/* CTA */}
            <View style={styles.ctaRow}>
              {loading ? (
                <View style={[styles.loadingBtn, { backgroundColor: colors.saffron }]}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.loadingText}>Processing…</Text>
                </View>
              ) : (
                <PrimaryButton
                  label={isLoginMode ? 'Sign In' : 'Create Account'}
                  icon="arrow-up-right"
                  onPress={handleSubmit}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Shared Input Row ─────────────────────────────────────────────────────────
function InputRow({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  colors,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Icon name={icon} size={17} color={colors.mutedForeground} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'words'}
        style={[styles.input, { color: colors.ink }]}
      />
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  brandOverlay: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  formOuter: {
    flex: 1,
  },
  formScroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  glassCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    marginTop: -20,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  formHeadline: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 31,
    marginBottom: 6,
  },
  formSub: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 18,
  },
  fields: {
    gap: 10,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
  },
  ctaRow: {
    marginTop: 20,
  },
  loadingBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
