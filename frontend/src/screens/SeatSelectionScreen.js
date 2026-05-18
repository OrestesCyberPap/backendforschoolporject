import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Randomly book some seats for mockup
const MOCK_BOOKED_SEATS = ['A3', 'A4', 'C5', 'D2', 'E8', 'F1', 'F2'];

export default function SeatSelectionScreen({ route, navigation }) {
  const { show, date, time } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    if (MOCK_BOOKED_SEATS.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalPrice = selectedSeats.length * show.price;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
         <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Select Seats</Text>
      
      {/* Stage */}
      <View style={styles.stageContainer}>
        <View style={styles.stage} />
        <Text style={styles.stageText}>STAGE</Text>
      </View>

      {/* Seat Map */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mapScroll}>
        <View style={styles.seatMap}>
          {ROWS.map(row => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>
              {COLS.map(col => {
                const seatId = `${row}${col}`;
                const isBooked = MOCK_BOOKED_SEATS.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                
                let seatStyle = styles.seatAvailable;
                if (isBooked) seatStyle = styles.seatBooked;
                if (isSelected) seatStyle = styles.seatSelected;

                return (
                  <TouchableOpacity 
                    key={seatId} 
                    style={[styles.seat, seatStyle]} 
                    disabled={isBooked}
                    onPress={() => toggleSeat(seatId)}
                    activeOpacity={0.7}
                  >
                    {isSelected && <View style={styles.innerSeatSelected} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Summary Section */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Selected: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</Text>
        <Text style={styles.priceText}>Total: ${totalPrice}</Text>
        <TouchableOpacity 
          style={[styles.checkoutBtn, selectedSeats.length === 0 && styles.checkoutBtnDisabled]} 
          disabled={selectedSeats.length === 0}
          onPress={() => navigation.navigate('Checkout', { show, date, time, seats: selectedSeats, totalPrice })}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 60 },
  backBtn: { marginLeft: 20, marginBottom: 20, padding: 10, backgroundColor: '#222', borderRadius: 8, alignSelf: 'flex-start' },
  backText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  stageContainer: { alignItems: 'center', marginBottom: 40 },
  stage: { width: '80%', height: 10, backgroundColor: '#E50914', borderBottomLeftRadius: 50, borderBottomRightRadius: 50, shadowColor: '#E50914', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  stageText: { color: '#888', marginTop: 10, fontSize: 12, letterSpacing: 4 },
  mapScroll: { paddingHorizontal: 20, paddingBottom: 20 },
  seatMap: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  rowLabel: { color: '#fff', width: 30, fontSize: 16, fontWeight: 'bold' },
  seat: { width: 30, height: 30, marginHorizontal: 5, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  seatAvailable: { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' },
  seatBooked: { backgroundColor: '#1a1a1a', opacity: 0.5 },
  seatSelected: { backgroundColor: '#E50914', borderColor: '#ff4d4d', borderWidth: 1 },
  innerSeatSelected: { width: 10, height: 10, backgroundColor: '#fff', borderRadius: 5 },
  summaryBox: { padding: 24, backgroundColor: '#161616', borderTopWidth: 1, borderColor: '#222' },
  summaryText: { color: '#aaa', fontSize: 16, marginBottom: 5 },
  priceText: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  checkoutBtn: { backgroundColor: '#E50914', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutBtnDisabled: { backgroundColor: '#555' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
