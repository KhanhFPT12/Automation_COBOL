/** Convert a meeting's local wall-clock date/time in its IANA timezone to UTC. */
function meetingStartUtc(meeting) {
  const date = new Date(meeting.preferredDate);
  const dateText = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
  const [year, month, day] = dateText.split('-').map(Number);
  const [hour, minute] = meeting.preferredTime.split(':').map(Number);
  const timeZone = meeting.timeZone || 'UTC';
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });

  const desiredWallClock = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utcGuess = desiredWallClock;
  // Two passes also handle most daylight-saving boundaries correctly.
  for (let pass = 0; pass < 2; pass += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(utcGuess))
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, Number(part.value)])
    );
    const renderedWallClock = Date.UTC(
      parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second
    );
    utcGuess += desiredWallClock - renderedWallClock;
  }
  return new Date(utcGuess);
}

module.exports = { meetingStartUtc };
