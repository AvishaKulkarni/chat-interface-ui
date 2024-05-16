import firebase from "firebase/compat/app";

// Define the interface
export interface FirebaseServerApp {
  settings?:firebase.firestore.Settings;
    //settings?: unknown; // Adjust the type based on your actual type
    // Other properties of FirebaseServerApp
  }
  
  // Type guard function
  export function isFirebaseServerApp(obj: any): obj is FirebaseServerApp {
    return obj && typeof obj === 'object' && 'settings' in obj;
  }
  
  // Function that uses the type guard
  export function checkIfServerApp(obj: any): boolean {
    if (isFirebaseServerApp(obj)) {
      return obj.settings !== undefined;
    }
    return false;
  }
  
 
  