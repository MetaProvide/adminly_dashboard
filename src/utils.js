import axios from "@nextcloud/axios";

export const UserUtil = {
	getUserName: () => document.querySelector("head").getAttribute("data-user"),
	getDisplayName: () =>
		document.querySelector("head").getAttribute("data-user-displayname"),
};

const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

// Function to check if a date is today or not
export const isDateSame = (date, baselineDate) => {
	const otherDate = new Date(date);

	if (
		otherDate.getDate() === baselineDate.getDate() &&
		otherDate.getMonth() === baselineDate.getMonth() &&
		otherDate.getYear() === baselineDate.getYear()
	) {
		return true;
	} else {
		return false;
	}
};

export const getDateTomorrow = () => {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	return tomorrow;
};

export const EventUtil = {
	oneMonthInSeconds: 60 * 60 * 24 * 31,
	getApiUrl: (userName, calendarName, fromDate, endDate) => {
		let url = `/remote.php/dav/calendars/${userName}/${calendarName}?export&expand=1&accept=jcal&componentType=VEVENT&start=${fromDate}`;
		url += `&end=${endDate || fromDate + EventUtil.oneMonthInSeconds}`;
		return url;
	},
	fetchCalendarEvents: async (user, calendarName, fromDate, endDate) => {
		const url = EventUtil.getApiUrl(user, calendarName, fromDate, endDate);
		return axios
			.get(url)
			.then((resp) => {
				if (resp.status !== 200)
					throw new Error("Error fetching events");

				const events = EventUtil.getObjects(resp.data).map(
					EventUtil.mapEvents
				);

				return events;
			})
			.catch((err) => console.error(err));
	},
	mapEvents: (vent) => {
		const isAllDay =
			!vent.dtstart.includes("T") && !vent.dtend.includes("T");
		const recurranceId = vent.recurrenceId ?? "";
		const description = vent.description ?? "";
		const meetingType =
			description.match(/Meeting type: (.*)/)?.[1] ?? "Session";
		const event = {
			id: vent.uid,
			recurranceId,
			key: vent.uid + recurranceId,
			summary: vent.summary ?? "Untitled event",
			dtstart: vent.dtstart,
			dtend: vent.dtend,
			description,
			meetingType,
			isAllDay,
			location: vent.location ?? "",
		};
		return event;
	},
	getSecondsSince: (dateByMilliSecs) => Math.round(dateByMilliSecs / 1000),
	getSecondsSinceMinusOneMonth: (dateByMilliSecs) =>
		Math.round(dateByMilliSecs / 1000 - EventUtil.oneMonthInSeconds),
	getObjects: (data) => {
		const vevents = data[2].slice(1);
		const veventsData = vevents.map((vevt) => vevt[1]);
		const recontructedEvents = veventsData.map((vevent) =>
			vevent.reduce((acc, el) => {
				acc[camelize(el[0])] = el[3];
				return acc;
			}, {})
		);
		return recontructedEvents;
	},
};

export const NewsUtil = {
	fetchBookingNews: () => {
		const url =
			"/ocs/v2.php/apps/activity/api/v2/activity/calendar?format=json";
		return axios
			.get(url)
			.then((resp) => {
				if (resp.status !== 200) throw new Error("Error fetching news");

				const bookingNews = resp.data.ocs.data.filter(
					(elm) =>
						elm.type === "calendar_events" &&
						elm.subject.includes("You updated event ✔️")
				);

				return bookingNews.map((elm) => ({
					...elm,
					time: new Date(elm.datetime).toLocaleString(),
				}));
			})
			.catch((err) => console.error(err));
	},
	fetchVaMessages: () => {
		// TODO
		return [
			{
				activityId: 11,
				subject:
					"Hi, This is a sample text message from your virtual assistant",
				time: "11AM",
				vaName: "Your VA Name",
				type: "vaMessage",
				icon: "/svg/core/logo/logo?color=000000&v=1",
			},
			{
				activityId: 12,
				subject: "Hi, This is a second text message from your VA",
				time: "11AM",
				vaName: "Your VA Name",
				type: "vaMessage",
				icon: "/svg/core/logo/logo?color=000000&v=1",
			},
			{
				activityId: 13,
				subject: "Reschedule booking from Carlos",
				time: "1PM",
				title: "RESCHEDULE:",
				type: "appointments",
			},
			{
				activityId: 14,
				subject: "Deleted booking from Carlos",
				time: "2PM",
				type: "appointments",
			},
			{
				activityId: 15,
				subject: "Reschedule booking from Carlos",
				time: "6PM",
				title: "RESCHEDULE:",
				type: "appointments",
			},
		];
	},
};
