const { getMessaging } = require('./firebaseApps');
const firebaseProjects = require('../../config/firebaseProjects');

const sendNotification = async (alias, fcmToken, title, body, data) => {
  const projectConfig = firebaseProjects[alias];

  if (!projectConfig) {
    throw new Error(`Alias '${alias}' chưa được cấu hình`);
  }

  const { keyPath } = projectConfig;
  const messaging = getMessaging(alias, keyPath);

  const message = {
    notification: { title, body },
    token: fcmToken,
    ...(data && { data }),
  };

  return messaging.send(message);
};


const BATCH_SIZE = 500;
const sendMulticastNotification = async (alias, tokens, title, body, data) => {
  const projectConfig = firebaseProjects[alias];
  if (!projectConfig) throw new Error(`Alias '${alias}' chưa được cấu hình`);

  const { keyPath } = projectConfig;
  const messaging = getMessaging(alias, keyPath);

  const allResponses = [];
  let totalSuccess = 0;
  let totalFailure = 0;

  // Chia tokens thành từng batch 500
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const tokenBatch = tokens.slice(i, i + BATCH_SIZE);
    const message = {
      notification: { title, body },
      tokens: tokenBatch,
      ...(data && { data }),
    };

    try {
      const response = await messaging.sendEachForMulticast(message);
      allResponses.push(response);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
    } catch (err) {
      allResponses.push({ error: err.message, failedTokens: tokenBatch });
      totalFailure += tokenBatch.length;
    }
  }

  return {
    totalBatches: Math.ceil(tokens.length / BATCH_SIZE),
    totalSuccess,
    totalFailure,
    results: allResponses,
  };
};

module.exports = { sendNotification, sendMulticastNotification };