const path = require('path');

const firebaseProjects = {
  // alias: { projectId (tên Firebase thực), keyPath (đường dẫn key) }
  tikluy: {
    projectId: 'tikluy',
    keyPath: path.join(__dirname, '../firebasePushService/keys/google-services.js'),
  },
  vnfite: {
    projectId: 'vnfite-firebase',
    keyPath: path.join(__dirname, '../firebasePushService/keys/vnfite-firebase-firebase.js'),
  },
};

module.exports = firebaseProjects;