/** Strip control characters/whitespace that can sneak into a dashboard-pasted
 * env var (a trailing \n crashes cors/redirect setHeader calls). */
const cleanEnvUrl = (value, fallback) =>
  (value || fallback).replace(/[^\x20-\x7E]/g, '').trim();

module.exports = { cleanEnvUrl };
