<template>
	<main>
		<div class="greeting-card">
			<h1>{{ message }}</h1>
			<p>It's good to see you again!</p>
		</div>

		<div class="calendar-widget centered large-text">Calendar</div>
		<div class="events-widget large-text">
			Events
			<Events />
		</div>
		<div class="booking-widget centered large-text">Create Booking</div>
	</main>
</template>

<script>
import axios from "@nextcloud/axios";
import Events from "./components/Events.vue";

const calendarEvents = [];
let description = "";
const currentDate = Date.now().toString().slice(0, -5);
axios
	.get(
		"/remote.php/dav/calendars/testsson/personal?" +
			"&export&accept=jcal&componentType=VEVENT&start=" +
			currentDate +
			"&end=" +
			currentDate +
			600000
	)
	.then(function (response) {
		// handle success
		response.data[2].slice(1).forEach((element) => {
			if (Object.keys(element[1]).length > 9) {
				description = element[1][9][3];
			} else description = "";
			const startDate = new Date(element[1][5][3]);
			const endDate = new Date(element[1][6][3]);
			calendarEvents.unshift({
				id: element[1][4][3],
				title: element[1][8][3],
				content: description,
				tstart: startDate.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				tend: endDate.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			});
		});
	});

export default {
	name: "App",
	components: {
		Events,
	},
	data() {
		return {
			message:
				"Hello " +
				document
					.querySelector("head")
					.getAttribute("data-user-displayname") +
				"!",
		};
	},
};
</script>

<style scoped>
.centered {
	height: 100%;
	display: flex;
	justify-content: center;
	align-content: center;
}

.large-text {
	font-size: 1.5rem;
}

main {
	background-color: #e6e4e4;
	width: 100%;
	height: 100vh;
	padding: 20px;
	display: grid;
	gap: 20px;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 3fr 2fr;
}

.greeting-card {
	background-color: lightblue;
	grid-column-start: 1;
	grid-column-end: 3;
	grid-row-start: 1;
	grid-row-end: 2;
}

.calendar-widget {
	background-color: azure;
	grid-column-start: 1;
	grid-column-end: 2;
	grid-row-start: 2;
	grid-row-end: 3;
}

.events-widget {
	background-color: lightpink;
	grid-column-start: 2;
	grid-column-end: 3;
	grid-row-start: 2;
	grid-row-end: 3;
}

.booking-widget {
	background-color: bisque;
	grid-column-start: 1;
	grid-column-end: 3;
	grid-row-start: 3;
	grid-row-end: 4;
}

.event {
	background-color: lightgreen;
}
</style>
