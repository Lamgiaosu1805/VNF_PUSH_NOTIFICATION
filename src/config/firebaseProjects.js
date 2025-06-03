const path = require('path');

const firebaseProjects = {
  // alias: { projectId (tên Firebase thực), keyPath (đường dẫn key) }
  tikluy: {
    projectId: 'tikluy',
    keyPath: path.join(__dirname, '../firebasePushService/keys/google-services.js'),
  },
//   customerB: {
//     projectId: 'firebase-project-id-b',
//     keyPath: path.join(__dirname, '../keys/projectB-key.json'),
//   },
};

module.exports = firebaseProjects;