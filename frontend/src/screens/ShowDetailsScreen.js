import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import api from '../api/api';

export default function ShowDetailsScreen({ route, navigation }) {
  const { show } = route.params;
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [groupedDates, setGroupedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await api.get(`/shows/${show.show_id}/showtimes`);
        const times = response.data;
        setShowtimes(times);
        
        // Group by Date
        const groups = {};
        times.forEach(st => {
          const dateObj = new Date(st.date_time);
          const dateStr = dateObj.toLocaleDateString();
          if (!groups[dateStr]) {
            groups[dateStr] = [];
          }
          groups[dateStr].push({
            ...st,
            timeStr: dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          });
        });
        
        setGroupedDates(groups);
        const availableDates = Object.keys(groups);
        if (availableDates.length > 0) {
          setSelectedDate(availableDates[0]);
          setSelectedShowtime(groups[availableDates[0]][0]);
        }
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        Alert.alert('Error', 'Failed to load showtimes.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShowtimes();
  }, [show.show_id]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (groupedDates[date] && groupedDates[date].length > 0) {
      setSelectedShowtime(groupedDates[date][0]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
         <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Image source={{ uri: show.image }} style={styles.banner} />
      <View style={styles.content}>
        <Text style={styles.title}>{show.title}</Text>
        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.description}>{show.description || 'No description available.'}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 30 }} />
        ) : Object.keys(groupedDates).length === 0 ? (
          <Text style={{color: '#aaa', marginTop: 20}}>No showtimes available for this show.</Text>
        ) : (
          <>
            <Text style={styles.price}>${selectedShowtime?.price || 'N/A'} per ticket</Text>
            
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
              {Object.keys(groupedDates).map(date => (
                <TouchableOpacity key={date} onPress={() => handleDateSelect(date)} style={[styles.pill, selectedDate === date && styles.pillActive]}>
                  <Text style={[styles.pillText, selectedDate === date && styles.pillTextActive]}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedDate && groupedDates[selectedDate] && (
              <>
                <Text style={styles.sectionTitle}>Select Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
                  {groupedDates[selectedDate].map(st => (
                    <TouchableOpacity key={st.showtime_id} onPress={() => setSelectedShowtime(st)} style={[styles.pill, selectedShowtime?.showtime_id === st.showtime_id && styles.pillActive]}>
                      <Text style={[styles.pillText, selectedShowtime?.showtime_id === st.showtime_id && styles.pillTextActive]}>{st.timeStr}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity 
              style={[styles.continueBtn, !selectedShowtime && {backgroundColor: '#555'}]} 
              disabled={!selectedShowtime}
              onPress={() => navigation.navigate('SeatSelection', { 
                show, 
                showtime: selectedShowtime 
              })}
            >
              <Text style={styles.continueText}>Select Seats</Text>
            </TouchableOpacity>
          </>
        )}
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
  price: { fontSize: 18, color: '#E50914', marginTop: 10, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 24, marginBottom: 8 },
  description: { fontSize: 14, color: '#aaa', lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10 },
  pill: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#333', marginRight: 10, marginBottom: 10 },
  pillActive: { backgroundColor: '#E50914', borderColor: '#E50914' },
  pillText: { color: '#aaa', fontWeight: 'bold' },
  pillTextActive: { color: '#fff' },
  continueBtn: { marginTop: 40, backgroundColor: '#E50914', padding: 16, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
