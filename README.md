# Fridge Friend

This app is a mobile-based food management tool that allows users to take photos of items, identify them using image recognition, and save details like item name, expiry date, and quantity to a database with push notifications. It streamlines the process of tracking inventory by automating item recognition and data entry through a user-friendly interface.
 
## Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install` & `npm install -g expo-cli` to install the dependencies.
3. Start the frontend by running `npx expo start`.

## Backend Setup
# FastAPI Backend

## Backend Setup
1. Make sure you have Python installed on your system.
2. Install FastAPI and Uvicorn by running:
   ```
   pip install fastapi uvicorn
   ```

## Running the Backend
1. Navigate to the directory containing your FastAPI application.
2. Run the following command to start the backend server:
   ```
   uvicorn api:router --host <your_ip_address> --port 8000 
   ```
   Replace `<your_ip_address>` with your desired IP address.
