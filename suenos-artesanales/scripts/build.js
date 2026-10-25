// Genera public/config.js con la configuración PÚBLICA de Firebase (variables de Netlify).
const fs = require('fs');
const keys = ['FIREBASE_API_KEY','FIREBASE_AUTH_DOMAIN','FIREBASE_PROJECT_ID','FIREBASE_APP_ID'];
const missing = keys.filter(k => !process.env[k]);
if (missing.length) { console.error('Faltan variables: ' + missing.join(', ')); process.exit(1); }
const cfg = { apiKey: process.env.FIREBASE_API_KEY, authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID, appId: process.env.FIREBASE_APP_ID };
fs.writeFileSync('public/config.js', 'window.FIREBASE_CONFIG = ' + JSON.stringify(cfg, null, 2) + ';\n');
console.log('config.js generado');
