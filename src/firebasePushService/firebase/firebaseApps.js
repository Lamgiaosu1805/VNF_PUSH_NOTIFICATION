const admin = require('firebase-admin');
const apps = {};

const initFirebaseApp = (alias, keyPath) => {
  if (apps[alias]) return apps[alias];

  const serviceAccount = require(keyPath);

  const app = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
    },
    alias // dùng alias làm tên app duy nhất
  );

  apps[alias] = app;
  return app;
};

const getMessaging = (alias, keyPath) => {
  const app = initFirebaseApp(alias, keyPath);
  return admin.messaging(app);
};

module.exports = { getMessaging };