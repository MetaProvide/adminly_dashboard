import axios from "@nextcloud/axios";

export const UserUtil = {
	getUserName: () => document.querySelector("head").getAttribute("data-user"),
	getDisplayName: () =>
		document.querySelector("head").getAttribute("data-user-displayname"),
};

export const EventUtil = {
	getApiUrl: (userName, calendarName, fromDate) =>
		`/remote.php/dav/calendars/${userName}/${calendarName}?export&accept=jcal&componentType=VEVENT&start=${fromDate}`,
	fetchCalendarEvents: async (user, calendarName, fromDate) => {
		const url = EventUtil.getApiUrl(user, calendarName, fromDate);
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
	mapEvents: (element) => ({
		id: EventUtil.getId(element),
		title: EventUtil.getTitle(element),
		description: EventUtil.getDescription(element),
		dateStart: EventUtil.getStartDate(element),
		dateEnd: EventUtil.getEndDate(element),
		timeStart: EventUtil.getStartHour(element),
		timeEnd: EventUtil.getEndHour(element),
	}),
	getId: (event) => event[1][4][3],
	getTitle: (event) => event[1]?.[8]?.[3] ?? "Untitled event",
	getSecondsSinceEpoch: () => Math.round(Date.now() / 1000),
	getSecondsSinceEpochMinus6Months: () =>
		Math.round(Date.now() / 1000 - 16200000),
	getStartDate: (event) =>
		new Date(event[1][5][3]).toISOString().split("T")[0],
	getEndDate: (event) =>
		event[1]?.[6]?.[3]
			? new Date(event[1][6][3])?.toISOString()?.split("T")[0]
			: null,
	getStartHour: (event) =>
		event[1]?.[5]?.[3]
			? new Date(event[1][5][3]).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
			  })
			: null,
	getEndHour: (event) =>
		event[1]?.[6]?.[3]
			? new Date(event[1][6][3]).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
			  })
			: null,
	getObjects: (data) => data[2].slice(1),
	getDescription: (event) =>
		Object.keys(event[1]).length > 9 ? event[1][9][3] : "",
};
