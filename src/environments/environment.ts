
import { initializeApp } from 'firebase/app';
import { getDatabase} from 'firebase/database';
export const environment = {
  production: false,
  firebaseConfig:{
    apiKey: "AIzaSyCvtYw0aNcJBky9pxR6vxKTQ-Z5nQwSpkI",
  authDomain: "uberate-389ba.firebaseapp.com",
  databaseURL: "https://uberate-389ba-default-rtdb.firebaseio.com",
  projectId: "uberate-389ba",
  storageBucket: "uberate-389ba.appspot.com",
  messagingSenderId: "815598838964",
  appId: "1:815598838964:web:a063bef7abe074c5b423e1",
  measurementId: "G-PYQG3RTV92"
  }
  
};
export const firebaseApp =  initializeApp(environment.firebaseConfig);
export const database = getDatabase(firebaseApp);