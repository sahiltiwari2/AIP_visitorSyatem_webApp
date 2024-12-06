import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const createUser = async (req, res) => {
  try {
    const { newEmail, department } = req.body;

    // Create the user with email and password on Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: newEmail,
      password: '123456',
    });

    // Create user data in Realtime Database
    await admin.database().ref('users/' + newEmail.split("@")[0]).set({
      username: newEmail.split("@")[0],
      number: "Set in Settings",
      department: department,
    });

    res.status(200).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ error: error.message });
  }
};

export default createUser;
