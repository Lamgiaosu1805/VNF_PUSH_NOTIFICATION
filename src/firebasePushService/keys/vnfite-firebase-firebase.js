module.exports = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID_VNF,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID_VNF,
    private_key: process.env.FIREBASE_PRIVATE_KEY_VNF.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL_VNF,
    client_id: process.env.FIREBASE_CLIENT_ID_VNF,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL_VNF,
    universe_domain: "googleapis.com"
  };