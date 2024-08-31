# Fridge Friend

This app is a mobile tool designed for tracking food items in your fridge, using your camera or manually. It helps you manage your fridge efficiently by simplifying the process of keeping track of what's inside and when it needs to be used with push notifs.

 
## Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install` & `npm install -g expo-cli` to install the dependencies.
3. Start the frontend by running `npx expo start`.

#Note: You'll need your own HuggingFace key if you want to use the camera feature in `CameraModal.tsx`
## Backend Setup
1. Navigate to the directory containing your FastAPI application.
2. Install FastAPI and Uvicorn by running:
   ```
   pip install fastapi uvicorn
   ```

3. Run the following command to start the backend server:
   ```
   uvicorn api:router --host <your_ip_address> --port 8000 
   ```
   Replace `<your_ip_address>` with your desired IP address.
