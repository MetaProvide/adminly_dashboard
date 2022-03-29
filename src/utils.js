import axios from "@nextcloud/axios";

export const UserUtil = {
	getUserName: () => document.querySelector("head").getAttribute("data-user"),
	getDisplayName: () =>
		document.querySelector("head").getAttribute("data-user-displayname"),
};

const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

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
		const dateStart = isAllDay ? vent.dtstart : vent.dtstart.split("T")[0];
		const dateEnd = isAllDay ? vent.dtend : vent.dtend.split("T")[0];
		const timeStart = isAllDay
			? null
			: vent.dtstart.split("T")[1].slice(0, 5);
		const timeEnd = isAllDay ? null : vent.dtend.split("T")[1].slice(0, 5);
		const recurranceId = vent.recurrenceId ?? "";
		return {
			id: vent.uid,
			recurranceId,
			key: vent.uid + recurranceId,
			title: vent.summary ?? "Untitled event",
			description: vent.description ?? "",
			isAllDay,
			dateStart,
			dateEnd,
			timeStart,
			timeEnd,
			location: vent.location ?? "",
		};
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
