import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/YatraUI';

interface BootSplashScreenProps {
  onFinish: () => void;
}

export function BootSplashScreen({ onFinish }: BootSplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0.7)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(25)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(20)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the glowing ring
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.4,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Main entrance sequence
    Animated.sequence([
      // 1. Logo entrance
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // 2. Title & Subtitle entrance
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 3. Team Vibe Coders Banner & Progress Line
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(badgeTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progressWidth, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 4. Hold to display clearly, then fade out smoothly
      Animated.delay(500),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });

    // Safety timeout to ensure boot splash screen always dismisses
    const safetyTimer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Deep dark gradient overlay */}
      <View style={styles.glowBg} />

      {/* Main Logo Image with Glowing Outer Ring */}
      <View style={styles.logoSection}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Main App Title */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <Text style={styles.brandTitle}>YATRAGUARD</Text>
        <Text style={styles.brandSubtitle}>AI PILGRIMAGE & CROWD SAFETY</Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              transform: [{ scaleX: progressWidth }],
            },
          ]}
        />
      </View>

      {/* PROMINENT & HIGH VISIBILITY DEVELOPER CREDIT BOX */}
      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: badgeOpacity,
            transform: [{ translateY: badgeTranslateY }],
          },
        ]}
      >
        <View style={styles.vibeCard}>
          <View style={styles.vibeBadgeRow}>
            <Icon name="zap" size={18} color="#FF9F1C" />
            <Text style={styles.developedText}>DEVELOPED BY</Text>
          </View>
          <Text style={styles.teamTitle}>TEAM VIBE CODERS</Text>
          <View style={styles.divider} />
          <Text style={styles.sihTag}>SIH 2026 · SMART INDIA HACKATHON</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#090D16',
    zIndex: 999999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  glowBg: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#FF9F1C',
    opacity: 0.14,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#FF9F1C',
  },
  logoContainer: {
    shadowColor: '#FF9F1C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  logoImage: {
    width: 130,
    height: 130,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF9F1C',
  },
  textContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF9F1C',
    letterSpacing: 2.5,
    marginTop: 6,
  },
  progressTrack: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
    marginTop: 32,
    marginBottom: 35,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF9F1C',
    borderRadius: 3,
  },
  footerContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  vibeCard: {
    width: '100%',
    backgroundColor: '#131B2E',
    borderColor: '#FF9F1C',
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  vibeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  developedText: {
    color: '#FF9F1C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  teamTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 2,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 159, 28, 0.4)',
    marginVertical: 8,
    borderRadius: 1,
  },
  sihTag: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
