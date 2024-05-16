// import React, { useRef, useState } from "react";
// import "./App.css";

// // firebase SDK
// import firebase from "firebase/app";

// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // const analytics = getAnalytics(app);
// // import firebase from "firebase/app";

// import "firebase/firestore";
// import "firebase/auth";

// // firebase Hooks
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";

// firebase.initializeApp({
// apiKey: "AIzaSyApiri3b2UoUlewKWdDOydcJ7-up_kD2dM",
// authDomain: "react-chat-interface.firebaseapp.com",
// databaseURL: "https://default.firebaseio.com",
// projectId: "react-chat-interface",
// storageBucket: "react-chat-interface.appspot.com",
// messagingSenderId: "533559123764",
// appId: "1:533559123764:web:71a2dd9e49d7d8a56f8f61",
// measurementId: "G-RKBTW52NVF",
// });

// const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

// function App() {
// 	const [user] = useAuthState(auth);
// 	return (
// 		<div className="App">
// 			<header className="App-header">
// 				<h1>React-chat-interface</h1>
// 				<SignOut />
// 			</header>
// 			<section>{user ? <ChatRoom /> : <SignIn />}</section>
// 		</div>
// 	);
// }

// function SignIn() {
// 	const signInWithGoogle = () => {
// 		const provider = new firebase.auth.GoogleAuthProvider();
// 		// triggers pupup for signin
// 		auth.signInWithPopup(provider);
// 	};

// 	return (
// 		<>
// 			<button className="sign-in" onClick={signInWithGoogle}>
// 				Sign in with Google
// 			</button>
// 			<p>
// 				Do not violate the community guidelines or you will be banned for life!
// 			</p>
// 		</>
// 	);
// }

// function SignOut() {
// 	return (
// 		auth.currentUser && (
// 			<button className="sign-out" onClick={() => auth.signOut()}>
// 				Sign Out
// 			</button>
// 		)
// 	);
// }

// function ChatRoom() {
// 	const dummy = useRef();
// 	const messagesRef = firestore.collection("messages");
// 	const query = messagesRef.orderBy("createdAt").limit(25);

// 	const [messages] = useCollectionData(query, { idField: "id" });

// 	const [formValue, setFormValue] = useState("");

// 	const sendMessage = async (e) => {
// 		e.preventDefault();

// 		const { uid, photoURL } = auth.currentUser;

// 		await messagesRef.add({
// 			text: formValue,
// 			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
// 			uid,
// 			photoURL,
// 		});

// 		setFormValue("");
// 		dummy.current.scrollIntoView({ behavior: "smooth" });
// 	};

// 	return (
// 		<>
// 			<main>
// 				{messages &&
// 					messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

// 				<span ref={dummy}></span>
// 			</main>

// 			<form onSubmit={sendMessage}>
// 				<input
// 					value={formValue}
// 					onChange={(e) => setFormValue(e.target.value)}
// 					placeholder="say something nice"
// 				/>

// 				<button type="submit" disabled={!formValue}>
// 					🕊️
// 				</button>
// 			</form>
// 		</>
// 	);
// }

// function ChatMessage(props) {
// 	const { text, uid, photoURL } = props.message;

// 	const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

// 	return (
// 		<div className={`message ${messageClass}`}>
// 			<img
// 				src={
// 					photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
// 				}
// 			/>
// 			<p>{text}</p>
// 		</div>
// 	);
// }

// export default App;
import { checkIfServerApp } from "./utils/firebase.ts";

import React, { useRef, useState } from "react";
import "./App.css";

// Firebase SDK v9
import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	orderBy,
	limit,
	addDoc,
	serverTimestamp,
	onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// const exampleObj = { settings: {} };

const firebaseConfig = {
	apiKey: "AIzaSyApiri3b2UoUlewKWdDOydcJ7-up_kD2dM",
	authDomain: "react-chat-interface.firebaseapp.com",
	projectId: "react-chat-interface",
	storageBucket: "react-chat-interface.appspot.com",
	messagingSenderId: "533559123764",
	appId: "1:533559123764:web:71a2dd9e49d7d8a56f8f61",
	measurementId: "G-RKBTW52NVF",
	databaseURL: "https://default.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {
	console.log(checkIfServerApp(firebaseConfig));
	const [user] = useAuthState(auth);
	return (
		<div className="App">
			<header className="App-header">
				<h1>React-chat-interface</h1>
				<SignOut />
			</header>
			<section>{user ? <ChatRoom /> : <SignIn />}</section>
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(provider);
		// signInWithPopup(auth, provider);
	};

	return (
		<>
			<button className="sign-in" onClick={signInWithGoogle}>
				Sign in with Google
			</button>
			{/* <p>
				Do not violate the community guidelines or you will be banned for life!
			</p> */}
		</>
	);
}

function SignOut() {
	return (
		auth.currentUser && (
			<button className="sign-out" onClick={() => signOut(auth)}>
				Sign Out
			</button>
		)
	);
}

function ChatRoom() {
	const dummy = useRef();
	const messagesRef = collection(firestore, "messages");
	const q = query(messagesRef, orderBy("createdAt"), limit(25));

	const [messages] = useCollectionData(q, { idField: "id" });

	const [formValue, setFormValue] = useState("");

	const sendMessage = async (e) => {
		e.preventDefault();

		const { uid, photoURL } = auth.currentUser;

		await addDoc(messagesRef, {
			text: formValue,
			createdAt: serverTimestamp(),
			uid,
			photoURL,
		});

		setFormValue("");
		dummy.current.scrollIntoView({ behavior: "smooth" });
	};

	// http://localhost:3000

	return (
		<>
			<main>
				{messages &&
					messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

				<span ref={dummy}></span>
			</main>

			<form onSubmit={sendMessage}>
				<input
					value={formValue}
					onChange={(e) => setFormValue(e.target.value)}
					placeholder="say something nice"
				/>

				<button type="submit" disabled={!formValue}>
					🕊️
				</button>
			</form>
		</>
	);
}

function ChatMessage({ message }) {
	const { text, uid, photoURL } = message;

	const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

	return (
		<div className={`message ${messageClass}`}>
			<img
				src={
					photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
				}
				alt="Profile"
			/>
			<p>{text}</p>
		</div>
	);
}

export default App;
