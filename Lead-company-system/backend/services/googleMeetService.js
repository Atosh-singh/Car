import { google } from "googleapis";

export const createMeet = async (auth) => {
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: "CRM Meeting",
    start: {
      dateTime: new Date().toISOString(),
    },
    end: {
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    conferenceData: {
      createRequest: {
        requestId: "meet-" + Date.now(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
};