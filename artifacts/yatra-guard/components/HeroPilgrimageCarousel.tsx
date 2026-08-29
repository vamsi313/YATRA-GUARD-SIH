/**
 * HeroPilgrimageCarousel — React Native
 *
 * A full-bleed editorial hero carousel for the YatraGuard auth screen.
 * Every card shares one top edge. The focused card unfurls to full height while
 * its neighbours stay clipped to half, so the strip reads as a row of cropped
 * heads with one complete portrait standing in the middle.
 *
 * Built with react-native-reanimated + react-native-gesture-handler
 * (already present in the project), so no extra packages are needed.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export interface PilgrimageCarouselItem {
  id: string;
  /** Headline — shown above the strip */
  title: string;
  /** Sub-label e.g. "Andhra Pradesh" */
  subtitle: string;
  image: ImageSourcePropType;
  /** Background accent hue for the overlay */
  accent: string;
  /** Right-aligned facts shown beside the headline */
  meta?: string[];
}

interface Props {
  items: PilgrimageCarouselItem[];
  /** Height of the whole carousel section (filmstrip + title) */
  height: number;
  /** Width of the stage (defaults to screen width) */
  width?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  onIndexChange?: (i: number) => void;
}

const SPRING = { damping: 32, stiffness: 260, mass: 0.9 };
const CLAMP = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function HeroPilgrimageCarousel({
  items,
  height,
  width: propWidth,
  autoplay = true,
  autoplayDelay = 4000,
  onIndexChange,
}: Props) {
  const screenW = propWidth ?? Dimensions.get('window').width;

  // ── Geometry (all relative to the stage) ──────────────────────────────────
  const CARD_H_FULL = height * 0.62;
  const CARD_H_HALF = CARD_H_FULL * 0.48;
  const CARD_W = CARD_H_FULL * 0.62; // roughly 3:4.8
  const GAP = Math.max(6, Math.round(CARD_W * 0.04));
  const STEP = CARD_W + GAP;
  const TITLE_STRIP_H = height - CARD_H_FULL - 12; // space above the strip

  const last = items.length - 1;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const xOffset = useSharedValue(0); // track x in pixels (negative = right items)
  const dragStartX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Background cross-fade progress (0→1 on each slide change)
  const bgOpacity = useSharedValue(1);

  // ── Helpers ────────────────────────────────────────────────────────────────
  // The centre of card[i] in the track coordinate system
  const centreFor = useCallback(
    (i: number) => -(i * STEP - screenW / 2 + CARD_W / 2),
    [STEP, screenW, CARD_W]
  );

  const go = useCallback(
    (next: number) => {
      const clamped = CLAMP(next, 0, last);
      setIndex(clamped);
      onIndexChange?.(clamped);
      xOffset.value = withSpring(centreFor(clamped), SPRING);

      // Fade background
      bgOpacity.value = 0;
      bgOpacity.value = withTiming(1, { duration: 600 });
    },
    [last, centreFor, xOffset, bgOpacity, onIndexChange]
  );

  // Snap to initial position on mount
  useEffect(() => {
    xOffset.value = centreFor(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Autoplay ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoplay || paused || items.length < 2) return;
    const id = setTimeout(() => go(index === last ? 0 : index + 1), autoplayDelay);
    return () => clearTimeout(id);
  }, [autoplay, autoplayDelay, index, items.length, last, paused, go]);

  // ── Pan gesture ───────────────────────────────────────────────────────────
  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      dragStartX.value = xOffset.value;
      runOnJS(setPaused)(true);
    })
    .onUpdate((e) => {
      xOffset.value = dragStartX.value + e.translationX * 0.85;
    })
    .onEnd((e) => {
      isDragging.value = false;
      // Nearest card + flick bias
      const thrown = xOffset.value + e.velocityX * 0.08;
      const approxIndex = Math.round((-thrown + screenW / 2 - CARD_W / 2) / STEP);
      runOnJS(go)(approxIndex);
      runOnJS(setPaused)(false);
    });

  // ── Animated styles ───────────────────────────────────────────────────────
  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xOffset.value }],
  }));

  const bgFadeStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const active = items[index];

  return (
    <View
      style={[styles.stage, { height, width: screenW }]}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* ── Background: full-bleed image with color overlay ── */}
      <Animated.View style={[StyleSheet.absoluteFillObject, bgFadeStyle]}>
        <Image
          source={active.image}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          blurRadius={Platform.OS === 'android' ? 2 : 0}
        />
        {/* Hue overlay — takes the accent's hue while preserving luminance */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: active.accent, opacity: 0.48 },
          ]}
        />
        {/* Vignette for legibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.62)']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* ── Headline block ── */}
      <View style={[styles.titleBlock, { height: TITLE_STRIP_H, paddingHorizontal: 20 }]}>
        <AnimatedText item={active} index={index} />
      </View>

      {/* ── Filmstrip ── */}
      <GestureDetector gesture={pan}>
        <View style={[styles.strip, { height: CARD_H_FULL }]}>
          <Animated.View style={[styles.track, trackStyle]}>
            {items.map((item, i) => (
              <CardItem
                key={item.id}
                item={item}
                isActive={i === index}
                fullH={CARD_H_FULL}
                halfH={CARD_H_HALF}
                width={CARD_W}
                onPress={() => go(i)}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      {/* ── Progress rail ── */}
      <ProgressRail index={index} total={items.length} width={screenW * 0.22} />
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CardItem({
  item,
  isActive,
  fullH,
  halfH,
  width,
  onPress,
}: {
  item: PilgrimageCarouselItem;
  isActive: boolean;
  fullH: number;
  halfH: number;
  width: number;
  onPress: () => void;
}) {
  const height = useSharedValue(isActive ? fullH : halfH);

  useEffect(() => {
    height.value = withSpring(isActive ? fullH : halfH, SPRING);
  }, [isActive, fullH, halfH, height]);

  const cardStyle = useAnimatedStyle(() => ({ height: height.value }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 0 : 0.15, { duration: 350 }),
  }));

  return (
    <Pressable onPress={onPress} style={{ width }}>
      <Animated.View style={[styles.card, { width }, cardStyle]}>
        <Image
          source={item.image}
          style={[styles.cardImg, { width }]}
          resizeMode="cover"
        />
        {/* Dim overlay for unfocused cards */}
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.cardDim, dimStyle]} />
      </Animated.View>
    </Pressable>
  );
}

function AnimatedText({
  item,
  index: _index,
}: {
  item: PilgrimageCarouselItem;
  index: number;
}) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(12);

  useEffect(() => {
    opacity.value = 0;
    ty.value = 12;
    opacity.value = withTiming(1, { duration: 480 });
    ty.value = withSpring(0, { damping: 28, stiffness: 220 });
  }, [_index, opacity, ty]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Animated.View style={[styles.titleInner, textStyle]}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.subtitleText}>{item.subtitle}</Text>
      {item.meta && (
        <View style={styles.metaRow}>
          {item.meta.map((fact, i) => (
            <Text key={i} style={styles.metaText}>
              {fact}
            </Text>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

function ProgressRail({
  index,
  total,
  width,
}: {
  index: number;
  total: number;
  width: number;
}) {
  const fillPct = ((index + 1) / total) * 100;
  const fillW = useSharedValue((fillPct / 100) * width);

  useEffect(() => {
    fillW.value = withSpring((fillPct / 100) * width, SPRING);
  }, [fillPct, width, fillW]);

  const fillStyle = useAnimatedStyle(() => ({ width: fillW.value }));

  return (
    <View style={styles.railWrap}>
      <View style={styles.railNumbers}>
        <Text style={styles.railNum}>{String(index + 1).padStart(2, '0')}</Text>
        <Text style={styles.railNum}>{String(total).padStart(2, '0')}</Text>
      </View>
      <View style={[styles.railTrack, { width }]}>
        <Animated.View style={[styles.railFill, fillStyle]} />
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  stage: {
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  titleBlock: {
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  titleInner: {
    gap: 4,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  strip: {
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    position: 'absolute',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cardImg: {
    height: '100%',
  },
  cardDim: {
    backgroundColor: '#000000',
  },
  railWrap: {
    position: 'absolute',
    bottom: 14,
    left: 20,
  },
  railNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  railNum: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  railTrack: {
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
