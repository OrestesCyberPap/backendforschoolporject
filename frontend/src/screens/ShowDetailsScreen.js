import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const MOCK_DATES = ['Oct 10', 'Oct 11', 'Oct 12'];
const MOCK_TIMES = ['19:00', '21:30'];

export default function ShowDetailsScreen({ route, navigation }) {
  const { show } = route.params;
  const [selectedDate, setSelectedDate] = useState(MOCK_DATES[0]);
  const [selectedTime, setSelectedTime] = useState(MOCK_TIMES[0]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
         <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Image source={{ uri: show.image }} style={styles.banner} />
      <View style={styles.content}>
        <Text style={styles.title}>{show.title}</Text>
        <Text style={styles.price}>${show.price} per ticket</Text>
        
        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.description}>{show.synopsis}</Text>
        
        <Text style={styles.sectionTitle}>Cast</Text>
        <Text style={styles.description}>{show.cast}</Text>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.row}>
          {MOCK_DATES.map(date => (
            <TouchableOpacity key={date} onPress={() => setSelectedDate(date)} style={[styles.pill, selectedDate === date && styles.pillActive]}>
              <Text style={[styles.pillText, selectedDate === date && styles.pillTextActive]}>{date}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.row}>
          {MOCK_TIMES.map(time => (
            <TouchableOpacity key={time} onPress={() => setSelectedTime(time)} style={[styles.pill, selectedTime === time && styles.pillActive]}>
              <Text style={[styles.pillText, selectedTime === time && styles.pillTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.continueBtn} 
          onPress={() => navigation.navigate('SeatSelection', { show, date: selectedDate, time: selectedTime })}
        >
          <Text style={styles.continueText}>Select Seats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8 },
  backText: { color: '#fff', fontWeight: 'bold' },
  banner: { width: '100%', height: 250, resizeMode: 'cover' },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  price: { fontSize: 18, color: '#E50914', marginTop: 4, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 24, marginBottom: 8 },
  description: { fontSize: 14, color: '#aaa', lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10 },
  pill: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#333', marginRight: 10 },
  pillActive: { backgroundColor: '#E50914', borderColor: '#E50914' },
  pillText: { color: '#aaa', fontWeight: 'bold' },
  pillTextActive: { color: '#fff' },
  continueBtn: { marginTop: 40, backgroundColor: '#E50914', padding: 16, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
