import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

export default function MyTicketsScreen({ route, navigation }) {
  const [tickets, setTickets] = useState([
    { id: 'TKT-1001', show: { title: 'Hamlet' }, date: 'Oct 05', time: '19:00', seats: ['A1'], totalPrice: 25 }
  ]);

  useEffect(() => {
    if (route.params?.newTicket) {
      const newT = {
        id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
        ...route.params.newTicket
      };
      setTickets([newT, ...tickets]);
    }
  }, [route.params?.newTicket]);

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.show.title}</Text>
        <Text style={styles.ticketId}>#{item.id}</Text>
      </View>
      <Text style={styles.ticketInfo}>{item.date} • {item.time}</Text>
      <Text style={styles.ticketInfo}>Seats: {item.seats.join(', ')}</Text>
      
      <View style={styles.qrMock}>
        <Text style={styles.qrText}>[ QR CODE MOCKUP ]</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
           <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Tickets</Text>
      </View>

      <FlatList 
        data={tickets}
        keyExtractor={item => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.list}
      />
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
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  ticketTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  ticketId: { color: '#E50914', fontWeight: 'bold', marginLeft: 10 },
  ticketInfo: { color: '#aaa', fontSize: 16, marginBottom: 5 },
  qrMock: { marginTop: 20, height: 100, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qrText: { color: '#000', fontWeight: 'bold', letterSpacing: 2 }
});
