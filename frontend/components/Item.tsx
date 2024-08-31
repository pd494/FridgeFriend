import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For icons

// Helper function to format the date as MM DD YY
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
  return `Expiry: ${month}/${day}/${year}`;
};

export default function Item({ name, quantity, expiryDate, daysLeft }: { name: string, quantity: number, expiryDate: string, daysLeft: number }) {
  return (
    <View>
      <View style={styles.itemContainer}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.middleSection}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.quantity}>Quantity: {quantity}</Text>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.expiryDateContainer}>
            <MaterialCommunityIcons name="calendar" size={16} color="#FFB74D" />
            <Text style={styles.expiryDate}> {formatDate(expiryDate)}</Text>
          </View>
          <Text style={styles.reminder}>{daysLeft} days left</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#9370DB',
    marginRight: 10,
    borderRadius: 4,
  },
  middleSection: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#24002D',
  },
  quantity: {
    fontSize: 14,
    color: 'gray',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  expiryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A77BCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 13,
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold'
  },
  reminder: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});
