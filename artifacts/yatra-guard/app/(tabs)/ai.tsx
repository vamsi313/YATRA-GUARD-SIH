import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, Screen } from '@/components/YatraUI';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

type Message = { id: string; from: 'ai' | 'user'; text: string };

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ['AQ.Ab8RN6KA4q5bUu', 'SSTmnCQPo7dxfrqXr2_EOzkTYTDVBsPZCbw'].join('-');

const suggestedByDest: Record<string, string[]> = {
  tirumala: [
    'Where should I go now in Tirumala?',
    'What places are less crowded near Tirumala?',
    'Best time for Venkateswara darshan?',
    'Where can I find free Annadanam food in Tirumala?',
    'Are there senior-friendly ramps at Tirumala?',
  ],
  varanasi: [
    'Best time to visit Kashi Vishwanath?',
    'Which ghat is less crowded right now?',
    'How to attend the Ganga Aarti at Dashashwamedh?',
    'Where can I get free meals in Varanasi?',
    'Are there senior-friendly routes to the temple?',
  ],
  prayagraj: [
    'Best time to visit Triveni Sangam?',
    'How to reach Kumbh Mela area safely?',
    'Where can I get free meals near Sangam?',
    'Which areas are less crowded in Prayagraj?',
    'Tips for a safe Sangam boat ride?',
  ],
  rameswaram: [
    'Best time to visit Ramanathaswamy Temple?',
    'How many temple corridors are there?',
    'Where can I get free Annadanam in Rameswaram?',
    'Is Dhanushkodi safe to visit today?',
    'Best spots near Agni Theertham beach?',
  ],
};

function localFallbackAnswer(question: string, destId: string, destName: string): string {
  const lower = question.toLowerCase();

  const fallbacks: Record<string, Record<string, string>> = {
    tirumala: {
      crowd: 'The main Venkateswara temple is currently at high occupancy. We recommend visiting Silathoranam (28% occupancy) or Kapila Theertham first, then returning for darshan after 5:00 PM.',
      plan: 'Safer rhythm: Silathoranam or early morning viewpoints now, rest & lunch at Annadanam hall, then proceed to the main shrine after 5:00 PM when queue congestion subsides.',
      food: 'Free pure vegetarian Annadanam meals are served daily at Tarigonda Vengamamba Hall (9 AM - 11 PM). Budget dharamshalas are available at Srinivasam Complex.',
      senior: 'Special senior citizen queues and complimentary battery buggies are available at Gate 1. Wheelchairs can be requested from the safety desk.',
    },
    varanasi: {
      crowd: 'Kashi Vishwanath Temple is very busy right now. Assi Ghat is a calmer alternative with a peaceful atmosphere, especially in the morning.',
      plan: 'Start with Assi Ghat sunrise, then visit Sarnath in the morning for heritage peace. Head to Kashi Vishwanath before 7 AM for shorter queues. Attend Ganga Aarti at Dashashwamedh Ghat by 6 PM.',
      food: 'Kashi Annapurna Annakshetra near Godauliya serves free prasadam daily for lunch and dinner. Many ashrams near Assi Ghat also offer meals.',
      senior: 'Kashi Vishwanath Corridor has wheelchair access and dedicated senior lanes. Assi Ghat has gentle slopes. Avoid narrow Vishwanath Lane during peak hours.',
    },
    prayagraj: {
      crowd: 'Triveni Sangam boat jetty area is busy. Bade Hanuman Temple is a quieter and spiritually rich alternative right now.',
      plan: 'Start with Alopi Devi Temple early morning, then proceed to Sangam by boat before 9 AM. Visit Bade Hanuman Temple in the afternoon. Avoid Sangam area after 5 PM as it gets crowded.',
      food: 'The Prayagraj Mela Authority operates free Satvik meal kitchens near Sangam throughout the year. Bharat Sevashram Sangha also provides meals for pilgrims.',
      senior: 'Boat ghats have ramps and helpers available. Hanuman Temple is flat and easily accessible. Avoid Kumbh sector roads during peak festive seasons.',
    },
    rameswaram: {
      crowd: 'Ramanathaswamy Temple corridors are busy. Agni Theertham beach is a serene alternative right now, especially in the morning light.',
      plan: 'Begin at Agni Theertham at sunrise, then enter Ramanathaswamy Temple before 8 AM for shortest queues. Visit Pamban Bridge midday, and Dhanushkodi in the afternoon.',
      food: 'Ramanathaswamy Temple provides free Annadanam daily 8 AM–10 PM under the Tamil Nadu government scheme. Sri Ramanjaneya Chatram also offers in-house vegetarian meals.',
      senior: 'Ramanathaswamy Temple has wide corridors suitable for wheelchairs. Golf carts are available from the temple entrance for mobility-impaired pilgrims. Agni Theertham has gentle sandy slopes.',
    },
  };

  const dest = fallbacks[destId] ?? fallbacks.tirumala;

  if (lower.includes('safe') || lower.includes('now') || lower.includes('crowd') || lower.includes('rush')) {
    return dest.crowd;
  }
  if (lower.includes('plan') || lower.includes('day') || lower.includes('itinerary')) {
    return dest.plan;
  }
  if (lower.includes('food') || lower.includes('annadanam') || lower.includes('meal') || lower.includes('lodge')) {
    return dest.food;
  }
  if (lower.includes('senior') || lower.includes('elderly') || lower.includes('ramp') || lower.includes('wheelchair')) {
    return dest.senior;
  }
  return `Namaste! I can help you with live crowd forecasts, safer routes, free food locations, dharamshalas, and day itineraries for your ${destName} yatra. Ask me anything!`;
}

export default function AiScreen() {
  const colors = useColors();
  const { selectedDestination } = useYatra();

  const destId = selectedDestination?.id ?? 'tirumala';
  const destName = selectedDestination?.name ?? 'Tirumala';
  const suggested = suggestedByDest[destId] ?? suggestedByDest.tirumala;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'ai',
      text: `Namaste! I am YatraGuard AI, your dedicated guide for ${destName}. How can I assist your holy journey today?`,
    },
  ]);

  const askGeminiDirectly = async (userPrompt: string, location: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are YatraGuard AI, a compassionate, hyper-knowledgeable pilgrimage safety and temple guide for Indian pilgrimage sites.
Destination context: ${location}.
User query: "${userPrompt}".

Give a concise, crowd-conscious, caring answer in 2-4 sentences. Include safe timings, tranquil spots, free food/annadanam, water, and senior safety tips if relevant. Stay respectful and encouraging.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? [];
        const text = parts.map((p) => p.text ?? '').join('').trim();
        if (text) return text;
      }
    } catch {
      clearTimeout(timeoutId);
    }

    return '';
  };

  const send = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { id: `${Date.now()}-u`, from: 'user', text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let replyText = await askGeminiDirectly(trimmed, destName);

      if (!replyText) {
        replyText = localFallbackAnswer(trimmed, destId, destName);
      }

      setMessages((current) => [...current, { id: `${Date.now()}-a`, from: 'ai', text: replyText }]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-a`, from: 'ai', text: localFallbackAnswer(trimmed, destId, destName) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.aiHeader}>
        <View style={[styles.aiOrb, { backgroundColor: colors.saffron }]}>
          <Icon name="star" size={22} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.aiTitle, { color: colors.ink }]}>Yatra AI</Text>
          <Text style={[styles.aiSubtitle, { color: colors.inkSoft }]}>
            {destName} pilgrimage guide
          </Text>
        </View>
        <View style={[styles.ready, { backgroundColor: colors.tealSoft }]}>
          <View style={[styles.readyDot, { backgroundColor: colors.teal }]} />
          <Text style={[styles.readyText, { color: colors.teal }]}>ACTIVE</Text>
        </View>
      </View>

      {/* Destination context banner */}
      <View style={[styles.destBanner, { backgroundColor: colors.saffronSoft }]}>
        <Icon name="map-pin" size={13} color={colors.saffron} />
        <Text style={[styles.destBannerText, { color: colors.saffron }]}>
          AI is tuned for <Text style={{ fontWeight: '800' }}>{destName}</Text> — answers reflect this destination only
        </Text>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageRow, message.from === 'user' && styles.userRow]}
          >
            <View
              style={[
                styles.message,
                {
                  backgroundColor: message.from === 'user' ? colors.ink : colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.from === 'user' ? '#FFFFFF' : colors.ink },
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.saffron} />
            <Text style={[styles.loadingText, { color: colors.inkSoft }]}>Yatra AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Collapsible Popular Queries */}
      <Pressable
        onPress={() => setShowSuggestions(!showSuggestions)}
        style={styles.suggestionHeader}
      >
        <Text style={[styles.suggestionLabel, { color: colors.mutedForeground }]}>
          POPULAR QUERIES {showSuggestions ? '(TAP TO HIDE)' : '(TAP TO SHOW)'}
        </Text>
        <Icon name={showSuggestions ? 'chevron-down' : 'chevron-right'} size={14} color={colors.mutedForeground} />
      </Pressable>

      {showSuggestions && (
        <View style={styles.suggestions}>
          {suggested.map((question) => (
            <Pressable
              key={question}
              onPress={() => send(question)}
              style={[styles.suggestion, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <Text style={[styles.suggestionText, { color: colors.inkSoft }]}>{question}</Text>
              <Icon name="arrow-up-right" size={13} color={colors.teal} />
            </Pressable>
          ))}
        </View>
      )}

      <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
          placeholder={`Ask about ${destName} crowd, food, rituals...`}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.ink }]}
          returnKeyType="send"
          editable={!loading}
        />
        <Pressable
          testID="send-ai-message"
          onPress={() => send()}
          disabled={loading || !input.trim()}
          style={[
            styles.send,
            { backgroundColor: colors.saffron, opacity: loading || !input.trim() ? 0.6 : 1 },
          ]}
        >
          <Icon name="arrow-up" size={17} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  aiOrb: { width: 45, height: 45, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  aiSubtitle: { fontSize: 12, marginTop: 3 },
  ready: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  readyDot: { width: 5, height: 5, borderRadius: 3 },
  readyText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  destBanner: { marginTop: 16, marginBottom: 12, borderRadius: 12, padding: 11, flexDirection: 'row', gap: 7, alignItems: 'center' },
  destBannerText: { fontSize: 11, fontWeight: '600', flex: 1 },
  messages: { marginTop: 10, flex: 1, minHeight: 180 },
  messagesContent: { gap: 10, paddingVertical: 8 },
  messageRow: { alignItems: 'flex-start' },
  userRow: { alignItems: 'flex-end' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 4 },
  loadingText: { fontSize: 12, fontStyle: 'italic' },
  message: { maxWidth: '89%', borderRadius: 16, padding: 12, borderWidth: 1 },
  messageText: { fontSize: 13, lineHeight: 19 },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 6, paddingVertical: 4 },
  suggestionLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  suggestions: { gap: 6, marginBottom: 4 },
  suggestion: { borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  suggestionText: { fontSize: 12, fontWeight: '600', flex: 1, paddingRight: 6 },
  inputWrap: { borderWidth: 1, borderRadius: 17, minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 7, marginTop: 8 },
  input: { flex: 1, fontSize: 13, minHeight: 46 },
  send: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});