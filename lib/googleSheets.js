import { google } from 'googleapis';
import { readFileSync } from 'fs';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(readFileSync('process.env.GOOGLE_CREDENTIALS')),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

export const sheets = google.sheets({ version: 'v4', auth });
