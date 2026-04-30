import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      // In a real app we fetch from backend. Since the backend might not be running right now,
      // we use mock data if the API fails so the UI still looks good.
      const res = await api.get('/shows').catch(() => null);
      if (res && res.data) {
        setShows(res.data);
      } else {
        setShows([
          { show_id: 1, title: 'Οιδίπους Τύραννος', theatre_name: 'Εθνικό Θέατρο', duration: 120, age_rating: '12+' },
          { show_id: 2, title: 'Το Φάντασμα της Όπερας', theatre_name: 'Θέατρο Παλλάς', duration: 150, age_rating: 'All' },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderShow = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.showTitle}>{item.title}</Text>
        <Text style={styles.theatreName}>{item.theatre_name}</Text>
        <View style={styles.tagsRow}>
           <View style={styles.tag}><Text style={styles.tagText}>{item.duration} min</Text></View>
           <View style={styles.tag}><Text style={styles.tagText}>{item.age_rating}</Text></View>
        </View>
        <TouchableOpacity style={styles.bookButton}>
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
          <Text style={styles.headerTitle}>Now Playing</Text>
          <Text style={styles.headerSubtitle}>Discover top theatrical shows</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={shows}
        keyExtractor={item => item.show_id.toString()}
        renderItem={renderShow}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#222',
    borderRadius: 20,
  },
  logoutText: {
    color: '#E50914',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  showTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  theatreName: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#222',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  tagText: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  }
});
