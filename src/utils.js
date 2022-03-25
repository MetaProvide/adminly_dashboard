export const UserUtil = {
	getName: document.querySelector("head").getAttribute("data-user"),
	getDisplayName: document
		.querySelector("head")
		.getAttribute("data-user-displayname"),
};

export const EventUtil = {
	getApiUrl: (userName, calendarName, fromDate) =>
		`/remote.php/dav/calendars/${userName}/${calendarName}?export&accept=jcal&componentType=VEVENT&start=${fromDate}`,
	getId: (event) => event[1][4][3],
	getTitle: (event) => event[1][8][3],
	getStartDate: (event) =>
		new Date(event[1][5][3]).toISOString().split("T")[0],
	getEndDate: (event) => new Date(event[1][6][3]).toISOString().split("T")[0],
	getStartHour: (event) =>
		new Date(event[1][5][3]).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	getEndHour: (event) =>
		new Date(event[1][6][3]).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	getObjects: (data) => data[2].slice(1),
	getDescription: (event) =>
		Object.keys(event[1]).length > 9 ? event[1][9][3] : "",
};
