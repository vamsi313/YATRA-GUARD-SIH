import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, Screen, styles as ui } from '@/components/YatraUI';
import { getPlace, getOccupancy } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

type Message = { id: string; from: 'ai' | 'user'; text: string };
const suggested = ['Where should I go now?', 'What places are less crowded?', 'Plan my day.', 'Is this area safe?'];

function mockAnswer(question: string) {
  const lower = question.toLowerCase();
  if (lower.includes('safe') || lower.includes('now') || lower.includes('crowd')) return 'The main temple area is currently at 120% occupancy with a 5-hour wait, so I recommend avoiding the queue for now. Visit Silathoranam at 28% occupancy, then Kapila Theertham at 34%. You can return after approximately 5 PM.';
  if (lower.includes('plan')) return 'Here is a safer Tirumala rhythm: Silathoranam now, lunch near Tirupati, Tiruchanur in the afternoon, then return to the main temple after 5 PM when the forecast eases.';
  return 'I can help with crowd conditions, safer alternatives, transport, food and a day plan. Try asking where to go now or ask me to plan your day.';
}

export default function AiScreen() {
  const colors = useColors();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', from: 'ai', text: 'Namaste. I’m your Yatra AI guide. I read the current prototype conditions so I can help you move through your pilgrimage with more confidence.' }]);
  const send = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { id: `${Date.now()}-u`, from: 'user', text: trimmed }, { id: `${Date.now()}-a`, from: 'ai', text: mockAnswer(trimmed) }]);
    setInput('');
  };
  return <Screen><View style={styles.aiHeader}><View style={[styles.aiOrb, { backgroundColor: colors.saffron }]}><Icon name="star" size={22} color="#FFFFFF" /></View><View><Text style={[styles.aiTitle, { color: colors.ink }]}>Yatra AI</Text><Text style={[styles.aiSubtitle, { color: colors.inkSoft }]}>Your personal pilgrimage guide</Text></View><View style={[styles.ready, { backgroundColor: colors.tealSoft }]}><View style={[styles.readyDot, { backgroundColor: colors.teal }]} /><Text style={[styles.readyText, { color: colors.teal }]}>READY</Text></View></View>
    <View style={[styles.notice, { backgroundColor: colors.goldSoft }]}><Icon name="info" size={15} color="#94631D" /><Text style={styles.noticeText}>AI recommendations are mock responses in this prototype.</Text></View>
    <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>{messages.map((message) => <View key={message.id} style={[styles.messageRow, message.from === 'user' && styles.userRow]}><View style={[styles.message, { backgroundColor: message.from === 'user' ? colors.ink : colors.card, borderColor: colors.border }]}><Text style={[styles.messageText, { color: message.from === 'user' ? '#FFFFFF' : colors.ink }]}>{message.text}</Text></View></View>)}</ScrollView>
    <Text style={[styles.suggestionLabel, { color: colors.mutedForeground }]}>TRY ASKING</Text><View style={styles.suggestions}>{suggested.map((question) => <Pressable key={question} onPress={() => send(question)} style={[styles.suggestion, { borderColor: colors.border, backgroundColor: colors.card }]}><Text style={[styles.suggestionText, { color: colors.inkSoft }]}>{question}</Text><Icon name="arrow-up-right" size={13} color={colors.teal} /></Pressable>)}</View>
    <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}><TextInput value={input} onChangeText={setInput} onSubmitEditing={() => send()} placeholder="Ask about your yatra..." placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.ink }]} returnKeyType="send" /><Pressable testID="send-ai-message" onPress={() => send()} style={[styles.send, { backgroundColor: colors.saffron }]}><Icon name="arrow-up" size={17} color="#FFFFFF" /></Pressable></View>
  </Screen>;
}

const styles = StyleSheet.create({
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  aiOrb: { width: 45, height: 45, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  aiSubtitle: { fontSize: 12, marginTop: 3 },
  ready: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  readyDot: { width: 5, height: 5, borderRadius: 3 },
  readyText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  notice: { marginTop: 18, borderRadius: 12, padding: 10, flexDirection: 'row', gap: 7, alignItems: 'center' },
  noticeText: { color: '#94631D', fontSize: 10, fontWeight: '600' },
  messages: { marginTop: 12, maxHeight: 270 },
  messagesContent: { gap: 10, paddingVertical: 8 },
  messageRow: { alignItems: 'flex-start' },
  userRow: { alignItems: 'flex-end' },
  message: { maxWidth: '89%', borderRadius: 16, padding: 12, borderWidth: 1 },
  messageText: { fontSize: 13, lineHeight: 19 },
  suggestionLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginTop: 17, marginBottom: 10 },
  suggestions: { gap: 8 },
  suggestion: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  suggestionText: { fontSize: 12, fontWeight: '600' },
  inputWrap: { borderWidth: 1, borderRadius: 17, minHeight: 54, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 7, marginTop: 18 },
  input: { flex: 1, fontSize: 13, minHeight: 48 },
  send: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});