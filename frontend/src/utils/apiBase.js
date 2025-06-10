export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:4000' // local dev server
  : 'https://us-central1-chatter-24302.web.app/api'; // Firebase Cloud Function