
import { initializeApp } from 'firebase/app';
import { getDatabase} from 'firebase/database';
export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyCCXs0RStFccHHk5S3nBqo34_-WzmE1gV0",
    authDomain: "uber-eats-62e7e.firebaseapp.com",
    databaseURL: "https://uber-eats-62e7e-default-rtdb.firebaseio.com/",
    projectId: "uber-eats-62e7e",
    storageBucket: "uber-eats-62e7e.appspot.com",
    messagingSenderId: "1098990918871",
    appId: "1:1098990918871:web:c25808449ce4f9b8ba2492",
    measurementId: "G-C9C2KP6ETQ"
  },
  
};
export const firebaseApp =  initializeApp(environment.firebaseConfig);
export const database = getDatabase(firebaseApp);