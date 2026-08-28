import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Icon, PrimaryButton, Screen, styles as ui } from '@/components/YatraUI';
import { useYatra } from '@/context/YatraContext';
import { useColors } from '@/hooks/useColors';

export default function AuthScreen() {
  const colors = useColors();
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
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={ui.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Icon name="arrow-left" size={20} color={colors.ink} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </Text>
          <Icon name="shield" size={19} color={colors.saffron} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.heroCard, { backgroundColor: colors.ink }]}>
            <View style={[styles.badge, { backgroundColor: colors.saffron }]}>
              <Text style={styles.badgeText}>YATRAGUARD ACCOUNT</Text>
            </View>
            <Text style={styles.heroTitle}>
              {isLoginMode ? 'Welcome Back' : 'Join YatraGuard'}
            </Text>
            <Text style={styles.heroSub}>
              {isLoginMode
                ? 'Sign in to access your saved temples and pilgrimage preferences.'
                : 'Create an account with just your name, email, and password.'}
            </Text>
          </View>

          {/* Toggle between Sign Up and Sign In */}
          <View style={[styles.toggleContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              onPress={() => setIsLoginMode(false)}
              style={[
                styles.toggleBtn,
                !isLoginMode && { backgroundColor: colors.saffron },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: !isLoginMode ? '#FFFFFF' : colors.inkSoft },
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsLoginMode(true)}
              style={[
                styles.toggleBtn,
                isLoginMode && { backgroundColor: colors.saffron },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: isLoginMode ? '#FFFFFF' : colors.inkSoft },
                ]}
              >
                Sign In
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {!isLoginMode && (
              <>
                <Text style={[styles.label, { color: colors.ink }]}>Full Name</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Icon name="user" size={18} color={colors.mutedForeground} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.mutedForeground}
                    style={[styles.input, { color: colors.ink }]}
                  />
                </View>
              </>
            )}

            <Text style={[styles.label, { color: colors.ink }]}>Email Address</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="mail" size={18} color={colors.mutedForeground} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@example.com"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.ink }]}
              />
            </View>

            <Text style={[styles.label, { color: colors.ink }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="lock" size={18} color={colors.mutedForeground} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.ink }]}
              />
            </View>

            <View style={styles.btnRow}>
              {loading ? (
                <View style={[styles.loadingBtn, { backgroundColor: colors.saffron }]}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.loadingBtnText}>Processing...</Text>
                </View>
              ) : (
                <PrimaryButton
                  label={isLoginMode ? 'Sign In' : 'Create Account'}
                  icon="arrow-up-right"
                  onPress={handleSubmit}
                  style={{ backgroundColor: colors.saffron }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 16, fontWeight: '700' },
  heroCard: { borderRadius: 20, padding: 18, marginTop: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  heroTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '700', letterSpacing: -0.3 },
  heroSub: { color: '#D1E0DE', fontSize: 12, lineHeight: 17, marginTop: 6 },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginTop: 18,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: { fontSize: 12, fontWeight: '700' },
  form: { marginTop: 12, gap: 6 },
  label: { fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 4 },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 13 },
  btnRow: { marginTop: 22 },
  loadingBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
