import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, TextInput, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchShows = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/shows${query ? `?search=${query}` : ''}`);
      setShows(response.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
      Alert.alert('Error', 'Failed to load shows. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleSearch = () => {
    fetchShows(searchQuery);
  };

  const renderShow = ({ item }) => {
    // Generate a placeholder image based on title
    const imageUrl = `https://via.placeholder.com/150/0a0a0a/E50914?text=${item.title.substring(0, 10).toUpperCase()}`;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShowDetails', { show: { ...item, image: imageUrl } })}>
        <Image source={{ uri: imageUrl }} style={styles.poster} />
        <View style={styles.cardContent}>
          <Text style={styles.showTitle}>{item.title}</Text>
          <Text style={styles.showGenre}>{item.theatre_name} • {item.duration} min</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('ShowDetails', { show: { ...item, image: imageUrl } })}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by title, theatre, location..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.myTicketsBtn} onPress={() => navigation.navigate('MyTickets')}>
         <Text style={styles.myTicketsText}>🎟️ My Tickets</Text>
      </TouchableOpacity>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : shows.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No shows found.</Text>
        </View>
      ) : (
        <FlatList 
          data={shows}
          keyExtractor={item => item.show_id.toString()}
          renderItem={renderShow}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  searchContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: '#161616', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  searchBtn: { backgroundColor: '#222', padding: 12, borderRadius: 8, marginLeft: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  searchBtnText: { color: '#fff', fontSize: 16 },
  myTicketsBtn: { marginHorizontal: 24, marginBottom: 10, padding: 12, backgroundColor: '#161616', borderRadius: 10, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  myTicketsText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  listContainer: { padding: 24, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#222', overflow: 'hidden' },
  poster: { width: 100, height: 140 },
  cardContent: { flex: 1, padding: 16, justifyContent: 'center' },
  showTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  showGenre: { fontSize: 14, color: '#aaa', marginBottom: 12 },
  bookButton: { backgroundColor: '#E50914', padding: 10, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontWeight: 'bold' }
});
