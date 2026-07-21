const { google } = require('googleapis');
const crypto = require('crypto');
const GoogleIntegration = require('../models/GoogleIntegration');

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
];

function assertConfigured() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
    const err = new Error(
      'Google Calendar chưa được cấu hình. Cần thiết lập GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI trong backend/.env.'
    );
    err.code = 'GOOGLE_NOT_CONFIGURED';
    throw err;
  }
}

function createOAuthClient() {
  assertConfigured();
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Build the Google consent URL. `state` carries the requesting admin's JWT
 * through the redirect, since Google's callback is a plain browser GET with
 * no Authorization header for us to verify the caller with otherwise.
 */
function getAuthUrl(state) {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  });
}

/** Exchange an OAuth code for tokens and persist them (single-doc collection). */
async function connectFromCode(code, adminUserId) {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  let connectedEmail = '';
  try {
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();
    connectedEmail = data.email || '';
  } catch (e) {
    console.warn('Could not fetch Google account email:', e.message);
  }

  await GoogleIntegration.deleteMany({});
  await GoogleIntegration.create({
    connectedEmail,
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    accessTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    connectedBy: adminUserId,
  });

  return { connectedEmail };
}

async function getStatus() {
  const doc = await GoogleIntegration.findOne({});
  return { connected: !!doc, connectedEmail: doc ? doc.connectedEmail : null };
}

async function disconnect() {
  await GoogleIntegration.deleteMany({});
}

/** Returns an OAuth2 client hydrated with the stored refresh token, or null if not connected. */
async function getAuthorizedClient() {
  const doc = await GoogleIntegration.findOne({}).select('+refreshToken +accessToken');
  if (!doc || !doc.refreshToken) return null;

  const client = createOAuthClient();
  client.setCredentials({
    refresh_token: doc.refreshToken,
    access_token: doc.accessToken,
    expiry_date: doc.accessTokenExpiry ? doc.accessTokenExpiry.getTime() : undefined,
  });

  // Persist refreshed access tokens so we don't re-hit Google unnecessarily.
  client.on('tokens', async (tokens) => {
    try {
      const update = {};
      if (tokens.access_token) update.accessToken = tokens.access_token;
      if (tokens.expiry_date) update.accessTokenExpiry = new Date(tokens.expiry_date);
      if (Object.keys(update).length) {
        await GoogleIntegration.updateOne({ _id: doc._id }, update);
      }
    } catch (e) {
      console.warn('Failed to persist refreshed Google token:', e.message);
    }
  });

  return client;
}

/**
 * Create a Calendar event with an auto-generated Google Meet link.
 * Throws if no Google account is connected yet.
 */
async function createMeetEvent({ summary, description, startISO, endISO, timeZone, attendeeEmail }) {
  const client = await getAuthorizedClient();
  if (!client) {
    const err = new Error(
      'Chưa kết nối Google Calendar. Vào Admin > Settings để kết nối trước khi duyệt lịch họp.'
    );
    err.code = 'GOOGLE_NOT_CONNECTED';
    throw err;
  }

  const calendar = google.calendar({ version: 'v3', auth: client });
  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary,
      description,
      start: { dateTime: startISO, timeZone },
      end: { dateTime: endISO, timeZone },
      attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  });

  return {
    eventId: data.id,
    meetLink: data.hangoutLink || '',
  };
}

module.exports = {
  getAuthUrl,
  connectFromCode,
  getStatus,
  disconnect,
  createMeetEvent,
};
