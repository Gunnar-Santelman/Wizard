import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

// sets up firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;
