export const userName = document
	.querySelector("head")
	.getAttribute("data-user-displayname");
export const getEventsUrl = (userName, calendarName,fromDate) =>
	`/remote.php/dav/calendars/${userName}/${calendarName}?export&accept=jcal&componentType=VEVENT&start=${fromDate}`;
export const getEventId = (event) => event[1][4][3];
export const getTitle = (event) => event[1][8][3];
export const getStartDate = (event) =>
	new Date(event[1][5][3]).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
export const getEndDate = (event) =>
	new Date(event[1][6][3]).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
export const getEventsObjects = (data) => data[2].slice(1);
export const getDescription = (event) => {
	if (Object.keys(event[1]).length > 9) {
		return event[1][9][3];
	} else return "";
};
