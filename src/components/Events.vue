<template>
	<div>
		<ul v-for="event in events" :key="event.id" class="event">
			<li>{{ event.title }} {{ event.tstart }}</li>
			<h3>{{ event.description }}</h3>
			<h4>{{ event.tstart }} - {{ event.tend }}</h4>
		</ul>
	</div>
</template>

<script>
import axios from "@nextcloud/axios";

const userName = document
	.querySelector("head")
	.getAttribute("data-user-displayname");
const currentDate = Date.now().toString().slice(0, -3);
const getEventsUrl = (userName, calendarName) =>
	`/remote.php/dav/calendars/${userName}/${calendarName}?export&accept=jcal&componentType=VEVENT&start=${currentDate}`;
const calName = "personal";
const getId = (element) => element[1][4][3];
const getTitle = (element) => element[1][8][3];
const getStartDate = (element) =>
	new Date(element[1][5][3]).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
const getEndDate = (element) =>
	new Date(element[1][6][3]).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
const getEventsObjects = (data) => data[2].slice(1);
const getDescription = (element) => {
	if (Object.keys(element[1]).length > 9) {
		return element[1][9][3];
	} else return "";
};

export default {
	name: "Events",
	data() {
		return {
			events: null,
		};
	},
	mounted() {
		this.loadCalendarEvents();
	},

	methods: {
		loadCalendarEvents() {
			axios.get(getEventsUrl(userName, calName)).then((response) => {
				// handle success
				this.events = getEventsObjects(response.data).map(
					(element) => ({
						id: getId(element),
						title: getTitle(element),
						description: getDescription(element),
						tstart: getStartDate(element),
						tend: getEndDate(element),
					})
				);
			});
		},
	},
};
</script>

<style scoped>
.event {
	background-color: lightgreen;
	padding: 10px;
	margin: 10px;
	border-radius: 25px;
}
</style>
