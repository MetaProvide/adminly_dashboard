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
import dayjs from "dayjs";

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
		const today = dayjs();
		const nextMonth = dayjs().month(today.month() + 1);
		const upcomingEvents = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"personal",
			today.unix(),
			nextMonth.unix()
		);

		this.upcomingEvents = this.getNextFiveNonAllDayEvents(upcomingEvents);

		const bookingNews = await NewsUtil.fetchBookingNews();
		const vaMessages = await NewsUtil.fetchVaMessages();
		this.upcomingNews = this.upcomingNews.concat(vaMessages, bookingNews);
	},
	methods: {
		getNextFiveNonAllDayEvents: (events) =>
			events
				.filter((evt) => !evt.isAllDay)
				.sort((evt1, evt2) => {
					const c = new Date(evt1.dtstart);
					const d = new Date(evt2.dtstart);
					return c - d;
				})
				.slice(0, Math.min(5, events.length)),
		getEventsByUniqueStartDate: (events) =>
			events.reduce((acc, cur) => {
				if (
					!acc.some((evt) =>
						dayjs(cur.dtstart).isSame(evt.dtstart, "day")
					)
				)
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
	height: calc(100% - 70px);
	grid-column-start: 1;
	grid-column-end: 2;
	display: flex;
	flex-direction: column;
	align-content: center;
	position: fixed;
	top: 70px;
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
	/* Use style below to make fixed */
	/* TODO: adjust calendar & booking component to Figma Design */
	/* position: fixed;
	top: 70px;
	left: calc(100% - 440px); */
}

main a {
	font-weight: 600;
}
</style>
