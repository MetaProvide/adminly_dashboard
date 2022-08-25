import axios from "@nextcloud/axios";

export const UserUtil = {
	getUserName: () => document.querySelector("head").getAttribute("data-user"),
	getDisplayName: () =>
		document.querySelector("head").getAttribute("data-user-displayname"),
};

const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

const getBookingTitleBySubject = (subject) => {
	if (subject.includes("new")) return "New booking created";
	else if (subject.includes("confirmed")) return "Booking confirmed";
	else return "Booking updated";
};
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

export const getDateYesterday = () => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	return yesterday;
};

export const isMoreThanAweekAgo = (dateTime) => {
	const today = new Date();
	const date = new Date(dateTime);
	return today.getDate() - date.getDate() >= 7;
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
		const vevents = data[2];
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
			"/ocs/v2.php/apps/activity/api/v2/activity/appointment?format=json&limit=10";
		return axios
			.get(url, {
				validateStatus: (status) => {
					return status < 500; // Resolve only if the status code is less than 500
				},
			})
			.then((resp) => {
				switch (resp.status) {
					case 200:
						break;
					case 304:
						return [];
					default:
						throw new Error("Error appointments activities");
				}
				return resp.data.ocs.data.map((elm) => ({
					...elm,
					title: getBookingTitleBySubject(elm.subject),
					link: elm.subject_rich[1].booking.link,
					booking: elm.subject_rich[1].booking.name,
					dtStart: elm.subject_rich[1].dtStart.name,
					subject: elm.subject_rich[0].replace(/{([^}]+)}/g, ""),
				}));
			})
			.catch((err) => console.error(err));
	},
	fetchClientNews: () => {
		const url =
			"/ocs/v2.php/apps/activity/api/v2/activity/clients?format=json&limit=10";
		return axios
			.get(url, {
				validateStatus: (status) => {
					return status < 500; // Resolve only if the status code is less than 500
				},
			})
			.then((resp) => {
				switch (resp.status) {
					case 200:
						break;
					case 304:
						return [];
					default:
						throw new Error("Error fetching client activities");
				}

				return resp.data.ocs.data.map((elm) => ({
					...elm,
					title: "New client",
					link: "/apps/adminly_clients/",
					subject: elm.subject_rich[0].replace("{client}", ""),
					clientName: elm.subject_rich[1].client.name,
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
		];
	},
};

export const AdminlyUtil = {
	getAdminlyColor: (string) => {
		const adminlyColors = [
			"#8AE21A",
			"#E21A7A",
			"#D21AE2",
			"#5A1AE2",
			"#1A76E2",
			"#1AB2E2",
			"#1AE2D6",
			"#1AE2A6",
			"#010564",
			"#F68500",
		];
		const arrayLength = adminlyColors.length;
		const index =
			string.length > arrayLength
				? string.length - arrayLength
				: string.length;
		return adminlyColors[index];
	},
};
