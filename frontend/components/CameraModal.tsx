import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import axios from 'axios';

// Function to load config
const loadConfig = async () => {
  const config = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'config.json');
  return JSON.parse(config);
};

export default function CameraModal() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);
  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation<any>();
  const { username } = useAuth();

  const [huggingfaceApiKey, setHuggingfaceApiKey] = useState<string | null>(null);

  useEffect(() => {
    loadConfig().then(config => {
      setHuggingfaceApiKey(config.huggingface_api_key);
    });
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <Text>We need your permission to show the camera</Text>
            <TouchableOpacity onPress={requestPermission}>
              <Text>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current && huggingfaceApiKey) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo!.uri); // Save the photo
      setLoading(true);
      const result = await query(photo!.uri);
      setLoading(false);
      setDetectionResult(result[0]); // Save the detection result
    }
  }

  async function query(uri: string) {
    const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
      {
        headers: {
          Authorization: `Bearer ${huggingfaceApiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: file }),
      }
    );
    const result = await response.json();
    return result;
  }

  async function handleSave() {
    const formattedDate = expiryDate.toISOString().split('T')[0];
    
    try {
      const response = await axios.post("http://10.0.0.129:8000/add", {
        expiryDate: formattedDate,
        quantity: quantity,
        name: detectionResult.label,
        username: username
      });
      
      // Reset the navigation stack to the Index screen
      navigation.reset({
        index: 1,
        routes: [{ name: 'Index' }],
      });
      
      // Close the modal
      setModalVisible(false);
    } catch (error) {
      console.error('add error: ', error);
      alert('Could not add item, try again');
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expiryDate;
    setExpiryDate(currentDate);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9370DB" />
          <Text style={styles.loadingText}>Identifying item...</Text>
        </View>
      ) : !capturedPhoto ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        />
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.capturedImageContainer}>
            <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          </View>
          {detectionResult && (
            <TextInput
              style={[styles.input, styles.itemNameInput]}
              placeholder="Item Name"
              value={detectionResult?.label || ''}
              onChangeText={(text) => {
                // Do nothing, just pre-fill the field
              }}
            />
          )}
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
          {detectionResult && (
            <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleSave}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {!capturedPhoto && (
        <TouchableOpacity style={styles.snapshotButton} onPress={takePicture}>
          <Text style={styles.text}>Snapshot</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  snapshotButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#9370DB',
    padding: 25,
    borderRadius: 15,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedImageContainer: {
    width: '90%',

    height: 300,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 2,
    borderColor: '#9370DB',
    fontSize: 20,
    padding: 10,
    marginBottom: 20,
    width: '90%',
    borderRadius: 8,
  },
  itemNameInput: {
  },
  formGroup: {
    marginBottom: 20,
    width: '90%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9370DB',
    marginBottom: 10,
  },
  datePickerContainer: {
    borderColor: '#9370DB',
    borderWidth: 2,
    borderRadius: 10,
  },
  datePicker: {
    width: '100%',
    height: 50,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#9370DB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#9370DB',
    marginHorizontal: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    color: '#9370DB',
    fontSize: 18,
    marginTop: 10,
  },
});

