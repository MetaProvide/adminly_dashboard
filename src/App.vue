<template>
	<main>
		<div class="events-widget">
			<h2>UPCOMING EVENTS</h2>
			<Events :events="upcomingEvents" />
		</div>
		<div class="newsfeed-widget">
			<Newsfeed :news="upcomingNews" />
		</div>
		<div class="booking-widget">
			<h2>BOOK APPOINTMENT</h2>
			<Calendar
				:events="calendarEvents"
				:change-pane="handleFetchCalendarEvents"
			/>
			<Booking :booking-form-url="bookingFormUrl" />
		</div>
	</main>
</template>

<script>
import Events from "./components/Events";
import Calendar from "./components/Calendar";
import Booking from "./components/Booking";
import Newsfeed from "./components/Newsfeed";
import { UserUtil, EventUtil, NewsUtil } from "./utils";

export default {
	name: "App",
	components: {
		Calendar,
		Events,
		Booking,
		Newsfeed,
	},
	props: {
		bookingFormUrl: {
			type: String,
			default() {
				return "";
			},
		},
	},
	data() {
		return {
			message: `Hello ${UserUtil.getDisplayName()}!`,
			calendarEvents: [],
			upcomingEvents: [],
			upcomingNews: [],
		};
	},
	async mounted() {
		// Upcoming events
		const today = EventUtil.getSecondsSince(Date.now());
		const upcomingEvents = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"personal",
			today
		);

		this.upcomingEvents = this.getNextFiveEvents(upcomingEvents);
		const bookingNews = await NewsUtil.fetchBookingNews();
		const vaMessages = await NewsUtil.fetchVaMessages();
		this.upcomingNews = this.upcomingNews.concat(vaMessages, bookingNews);
	},
	methods: {
		getNextFiveEvents: (events) =>
			events
				.sort(
					(evt1, evt2) =>
						new Date(evt1.dateStart).getTime() -
						new Date(evt2.dateStart).getTime()
				)
				.slice(0, Math.min(5, events.length)),
		getEventsByUniqueStartDate: (events) =>
			events.reduce((acc, cur) => {
				if (!acc.some((evt) => cur.dateStart === evt.dateStart))
					acc.push(cur);
				return acc;
			}, []),
		async handleFetchCalendarEvents(year, month, _) {
			const lastMonth = EventUtil.getSecondsSince(
				new Date(year, month - 1).getTime()
			);
			const nextMonth = EventUtil.getSecondsSince(
				new Date(year, month + 1).getTime()
			);

			const calendarEvents = await EventUtil.fetchCalendarEvents(
				UserUtil.getUserName(),
				"personal",
				lastMonth,
				nextMonth
			);

			this.calendarEvents =
				this.getEventsByUniqueStartDate(calendarEvents);
		},
	},
};
</script>

<style scoped>
main {
	background-color: #fff;
	width: 100%;
	min-height: 100vh;
	padding: 20px 0;
	display: grid;
	gap: 20px;
	grid-template-columns: 1fr 2fr 1fr;
	grid-template-rows: 1fr;
}

.events-widget {
	max-width: 390px;
	height: calc(100vh - 70px);
	grid-column-start: 1;
	grid-column-end: 2;
	display: flex;
	flex-direction: column;
	align-content: center;
}

h2 {
	color: #255280;
	text-align: center;
}

.newsfeed-widget {
	grid-column-start: 2;
	grid-column-end: 3;
}

.booking-widget {
	grid-column-start: 3;
	grid-column-end: 4;
	display: flex;
	flex-direction: column;
	align-items: center;
}

main a {
	font-weight: 600;
}
</style>
