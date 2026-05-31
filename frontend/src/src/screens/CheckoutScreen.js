import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import api from '../api/api';

export default function CheckoutScreen({ route, navigation }) {
  const { show, showtime, seats, totalPrice } = route.params;
  const [name, setName] = useState('');
  const [card, setCard] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!name || card.length < 16) {
      Alert.alert('Validation Error', 'Please enter a valid name and a 16-digit card number.');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/reservations', {
        showtimeId: showtime.showtime_id,
        seats: seats
      });
      Alert.alert('Success!', 'Your reservation has been confirmed.', [
        { text: 'OK', onPress: () => navigation.navigate('MyTickets', { refresh: true }) }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create reservation.');
    } finally {
      setLoading(false);
    }
  };

  const dateObj = new Date(showtime.date_time);
  const displayDate = dateObj.toLocaleDateString();
  const displayTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
           <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Checkout</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{show.title}</Text>
          <Text style={styles.summaryText}>{displayDate} at {displayTime}</Text>
          <Text style={styles.summaryText}>Seats: {seats.join(', ')}</Text>
          <View style={styles.divider} />
          <Text style={styles.totalText}>Total: ${totalPrice}</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Details</Text>
        <TextInput style={styles.input} placeholder="Cardholder Name" placeholderTextColor="#666" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Card Number (16 digits)" placeholderTextColor="#666" keyboardType="numeric" maxLength={16} value={card} onChangeText={setCard} />
        <View style={styles.row}>
          <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="MM/YY" placeholderTextColor="#666" />
          <TextInput style={[styles.input, {flex: 1}]} placeholder="CVV" placeholderTextColor="#666" keyboardType="numeric" maxLength={3} />
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={loading}>
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.confirmText}>Confirm Reservation</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 24, paddingTop: 60 },
  backBtn: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#222', borderRadius: 8, marginBottom: 20 },
  backText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  summaryCard: { backgroundColor: '#161616', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#222', marginBottom: 30 },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  summaryText: { fontSize: 16, color: '#aaa', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 12 },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#E50914' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  input: { backgroundColor: '#0f0f0f', color: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 15 },
  row: { flexDirection: 'row' },
  confirmBtn: { backgroundColor: '#E50914', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  confirmText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
