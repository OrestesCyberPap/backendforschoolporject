import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { AuthContext } from '../context/AuthContext';

// Mock Data
const MOCK_SHOWS = [
  { id: '1', title: 'Hamlet', genre: 'Tragedy', duration: '140 min', price: 25, image: 'https://via.placeholder.com/150/0a0a0a/E50914?text=HAMLET', synopsis: 'The Prince of Denmark seeks revenge for his father’s murder in this classic Shakespearean tragedy.', cast: 'Kenneth Branagh, Kate Winslet' },
  { id: '2', title: 'The Phantom of the Opera', genre: 'Musical', duration: '150 min', price: 40, image: 'https://via.placeholder.com/150/0a0a0a/E50914?text=PHANTOM', synopsis: 'A masked figure falls in love with a young soprano, haunting the Paris Opera House.', cast: 'Ramin Karimloo, Sierra Boggess' },
  { id: '3', title: 'Wicked', genre: 'Musical', duration: '160 min', price: 35, image: 'https://via.placeholder.com/150/0a0a0a/E50914?text=WICKED', synopsis: 'The untold story of the witches of Oz and their unlikely friendship.', cast: 'Idina Menzel, Kristin Chenoweth' },
];

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const renderShow = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShowDetails', { show: item })}>
      <Image source={{ uri: item.image }} style={styles.poster} />
      <View style={styles.cardContent}>
        <Text style={styles.showTitle}>{item.title}</Text>
        <Text style={styles.showGenre}>{item.genre} • {item.duration}</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('ShowDetails', { show: item })}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Discover top theatrical shows</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.myTicketsBtn} onPress={() => navigation.navigate('MyTickets')}>
         <Text style={styles.myTicketsText}>🎟️ My Tickets</Text>
      </TouchableOpacity>
      <FlatList 
        data={MOCK_SHOWS}
        keyExtractor={item => item.id}
        renderItem={renderShow}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  logoutBtn: { padding: 8, backgroundColor: '#222', borderRadius: 8 },
  logoutText: { color: '#E50914', fontWeight: 'bold' },
  myTicketsBtn: { marginHorizontal: 24, marginBottom: 10, padding: 12, backgroundColor: '#161616', borderRadius: 10, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  myTicketsText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContainer: { padding: 24, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#222', overflow: 'hidden' },
  poster: { width: 100, height: 140 },
  cardContent: { flex: 1, padding: 16, justifyContent: 'center' },
  showTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  showGenre: { fontSize: 14, color: '#aaa', marginBottom: 12 },
  bookButton: { backgroundColor: '#E50914', padding: 10, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontWeight: 'bold' }
});
