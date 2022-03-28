<template>
	<main>
		<div class="greeting-card">
			<h1>{{ message }}</h1>
			<p>It's good to see you again!</p>
		</div>

		<div class="calendar-widget centered large-text">
			<Calendar :events="calendarEvents" />
		</div>
		<div class="events-widget centered large-text">
			<Events :events="upcomingEvents" />
		</div>
		<div class="booking-widget centered large-text">Create Booking</div>
	</main>
</template>

<script>
import Events from "./components/Events.vue";
import Calendar from "./components/Calendar";
import { UserUtil, EventUtil } from "./utils";

export default {
	name: "App",
	components: {
		Calendar,
		Events,
	},
	data() {
		return {
			message: `Hello ${UserUtil.getDisplayName()}!`,
			calendarEvents: [],
			upcomingEvents: [],
		};
	},
	async mounted() {
		// Upcoming events
		const today = EventUtil.getSecondsSinceEpoch();
		const upcomingEvents = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"personal",
			today
		);

		this.upcomingEvents = this.getNextFiveEvents(upcomingEvents);

		// Calendar events
		const sixMonthsBack = EventUtil.getSecondsSinceEpochMinus6Months();
		const calendarEvents = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"personal",
			sixMonthsBack
		);

		this.calendarEvents = this.getEventsByUniqueStartDate(calendarEvents);
	},
	methods: {
		getNextFiveEvents: (events) =>
			events.slice(0, Math.min(5, events.length)),
		getEventsByUniqueStartDate: (events) =>
			events.reduce((acc, cur) => {
				if (!acc.some((evt) => cur.dateStart === evt.dateStart))
					acc.push(cur);
				return acc;
			}, []),
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
</style>
