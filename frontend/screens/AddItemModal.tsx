import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
const REMINDER_OPTIONS = [
  { label: 'On day of expiry', value: 0 },
  { label: '1 day before', value: 1 },
  { label: '2 days before', value: 2 },
  { label: '1 week before', value: 7 },
  { label: '2 weeks before', value: 14 },
];

type Reminder = {
  id: number;
  number: number;
  days: number;
};

export default function ItemModal() {
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [reminderType, setReminderType] = useState<'none' | 'days' | 'weeks'>('none');
  const navigation = useNavigation<any>(); // Initialize navigation
  const {username} = useAuth()

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expiryDate;
    setExpiryDate(currentDate);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const openReminderModal = (number: number) => {
    setSelectedNumber(number);
    setShowReminderModal(true);
  };

  const addReminder = (days: number) => {
    if (!selectedNumber) return;

    const newReminder: Reminder = {
      id: Date.now(),
      number: selectedNumber,
      days,
    };

    // Check for duplicate reminders
    const isDuplicate = reminders.some(reminder => 
      reminder.number === newReminder.number && reminder.days === newReminder.days
    );

    if (!isDuplicate) {
      setReminders([...reminders, newReminder]);
    }
    setShowReminderModal(false);
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };


  const handlePress = async ()  =>{
    const formattedDate = (expiryDate.toISOString().split('T')[0])
    
    try{
      const response = await axios.post("http://10.0.0.129:8000/add",{
        expiryDate: formattedDate,
        quantity: quantity,
        name: name,
        username: username

      });
      navigation.reset({
        index: 1,
        routes: [{ name: 'Index' }],
      });
    }
    catch (error) {
      console.error('add error: :', error);
      alert('Could not add item, try again');
    }


  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      {/* Name Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Milk"
          placeholderTextColor="grey"
        />
      </View>

      {/* Quantity Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expiry Date Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiry Date</Text>
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>
      </View>

      {/* Reminders */}
      <View style={styles.formGroup}>
        <View style={styles.reminderHeader}>
          <Text style={styles.label}>Reminders</Text>
          <TouchableOpacity onPress={() => openReminderModal(quantity)} style={styles.addReminderButton}>
            <Text style={styles.addReminderButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {reminders.map(reminder => (
          <View key={reminder.id} style={styles.reminderItem}>
            <Text style={styles.reminderText}>
              {reminder.number} {reminder.number > 1 ? 'items' : 'item'} - {REMINDER_OPTIONS.find(option => option.value === reminder.days)?.label}
            </Text>
            <TouchableOpacity onPress={() => deleteReminder(reminder.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Reminder Modal */}
      <Modal
        visible={showReminderModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {REMINDER_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => addReminder(option.value)}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelButton]}
              onPress={() => setShowReminderModal(false)}
            >
              <Text style={[styles.modalOptionText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handlePress} style={styles.addItemButton}>
        <Text style={styles.addItemButtonText}>Add to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addItemButton: {
    backgroundColor: '#9370DB', // Medium purple color
    borderRadius: 8,
    padding: 15,
    top: '5%',
    alignItems: 'center',
    marginTop: 20, // Adjust spacing as needed
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9370DB',
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 30, // Increase this value for more vertical space
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 16,
    color: '#000000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#9370DB',
  },
  quantityInput: {
    flex: 1,
    height: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#000000',
  },
  datePickerContainer: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
  },
  datePicker: {
    width: '100%',
    height: 50,
    marginBottom: '3%'
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addReminderButton: {
    backgroundColor: 'black', // Purple color for button

    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addReminderButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15, // Increase this value for more vertical space
  },
  reminderText: {
    fontSize: 16,
    color: 'black',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  modalOption: {
    padding: 20, // Increase padding for better spacing
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: 'black',
  },
  cancelButton: {
    borderBottomWidth: 0,
  },
  cancelButtonText: {
    color: '#FF6347',
  },
});
