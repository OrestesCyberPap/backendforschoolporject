import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import api from '../api/api';

export default function MyTicketsScreen({ route, navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations/user');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Alert.alert('Error', 'Failed to load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [route.params?.refresh]);

  const handleCancel = (reservationId) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation? This action cannot be undone.',
      [
        { text: 'No, keep it', style: 'cancel' },
        { 
          text: 'Yes, cancel it', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/reservations/${reservationId}`);
              Alert.alert('Cancelled', 'Your reservation has been cancelled.');
              fetchTickets(); // Refresh the list
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to cancel the reservation.');
            }
          }
        }
      ]
    );
  };

  const renderTicket = ({ item }) => {
    const dateObj = new Date(item.date_time);
    const displayDate = dateObj.toLocaleDateString();
    const displayTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>{item.show_title}</Text>
          <Text style={styles.ticketId}>#{item.reservation_id}</Text>
        </View>
        <Text style={styles.ticketInfo}>{item.theatre_name}</Text>
        <Text style={styles.ticketInfo}>{displayDate} • {displayTime}</Text>
        <Text style={styles.ticketInfo}>Seats: {item.seats ? item.seats.join(', ') : 'N/A'}</Text>
        
        <View style={styles.qrMock}>
          <Text style={styles.qrText}>[ QR CODE MOCKUP ]</Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.reservation_id)}>
          <Text style={styles.cancelText}>Cancel Reservation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.modifyBtn} 
          onPress={() => {
            const imageUrl = `https://via.placeholder.com/150/0a0a0a/E50914?text=${item.show_title.substring(0, 10).toUpperCase()}`;
            navigation.navigate('ShowDetails', { 
              show: { 
                show_id: item.show_id, 
                title: item.show_title, 
                description: item.show_description,
                duration: item.duration,
                theatre_name: item.theatre_name,
                image: imageUrl
              }
            });
          }}
        >
          <Text style={styles.modifyText}>Modify Reservation</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
           <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Tickets</Text>
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : tickets.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#888', fontSize: 16}}>You have no upcoming reservations.</Text>
        </View>
      ) : (
        <FlatList 
          data={tickets}
          keyExtractor={item => item.reservation_id.toString()}
          renderItem={renderTicket}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { padding: 24, paddingTop: 60, borderBottomWidth: 1, borderColor: '#222' },
  backBtn: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#222', borderRadius: 8, marginBottom: 15 },
  backText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  list: { padding: 24 },
  ticketCard: { backgroundColor: '#161616', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed' },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ticketTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  ticketId: { color: '#E50914', fontWeight: 'bold', marginLeft: 10 },
  ticketInfo: { color: '#aaa', fontSize: 16, marginBottom: 5 },
  qrMock: { marginTop: 20, height: 100, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qrText: { color: '#000', fontWeight: 'bold', letterSpacing: 2 },
  cancelBtn: { marginTop: 15, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ff4d4d', alignItems: 'center' },
  cancelText: { color: '#ff4d4d', fontWeight: 'bold' },
  modifyBtn: { marginTop: 10, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#4da6ff', alignItems: 'center' },
  modifyText: { color: '#4da6ff', fontWeight: 'bold' }
});
