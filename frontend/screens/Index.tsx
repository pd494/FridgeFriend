// DisplayBoard.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import axios from 'axios';
import Item from '../components/Item';
import { FloatingAction } from 'react-native-floating-action';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import CameraModal from '../components/CameraModal';


const DisplayBoard = () => {
  const [items, setItems] = useState([]);
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const { username } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://10.0.0.129:8000/getItems', {
          params: {
            username: username
          }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, [username]);

  const actions = [
    {
      text: "Add manually",
      color: '#9370DB',
      name: "bt_accessibility",
      position: 1,
      onPress: () => {
        navigation.navigate('ItemModal');
      }
    },
    {
      text: "Add with camera",
      color: '#9370DB',
      name: "bt_language",
      position: 2,
      onPress: () => {
        setCameraModalVisible(true); // Show Camera Modal
      }
    },
    {
      text: "Scan barcode",
      color: '#9370DB',
      name: "bt_room",
      position: 3
    }
  ];

  const renderItem = ({ item }: { item: { name: string, quantity: number, expiryDate: string } }) => {
    const daysLeft = calculateDaysLeft(item.expiryDate);

    return (
      <Item
        name={item.name}
        quantity={item.quantity}
        expiryDate={item.expiryDate}
        daysLeft={daysLeft}
      />
    );
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your fridge is empty</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
        />
      )}
      <Button title="Test Button" onPress={() => console.log('hi')} />
      <FloatingAction
        actions={actions}
        color='#9370DB'
        onPressItem={(name) => {
          if (name === 'bt_accessibility') {
            navigation.navigate('ItemModal');
          }
          else if (name == "bt_language"){
            navigation.navigate('Camera')
          }
        }}
      />
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  list: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#A77BCC',
  },
});

export default DisplayBoard;
