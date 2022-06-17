<template>
	<main>
		<div class="events-widget">
			<h2>UPCOMING EVENTS</h2>
			<Events
				:events="upcomingEvents"
				:is-empty="isUpcomingEventsEmpty"
			/>
		</div>
		<div class="newsfeed-widget">
			<h2>NEWSFEED</h2>
			<Newsfeed :news="sortedNews" :is-empty="isNewsfeedEmpty" />
		</div>
		<div class="booking-widget">
			<Calendar
				:events="calendarEvents"
				:change-pane="handleFetchCalendarEvents"
			/>
			<div class="separator-line"></div>
			<h2 class="temporary-header-adjustment">BOOK APPOINTMENT</h2>
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
			isNewsfeedEmpty: false,
			isUpcomingEventsEmpty: false,
		};
	},
	computed: {
		sortedNews() {
			return this.upcomingNews
				.slice(0)
				.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
		},
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

		this.upcomingEvents.length === 0
			? (this.isUpcomingEventsEmpty = true)
			: (this.isUpcomingEventsEmpty = false);

		const bookingNews = await NewsUtil.fetchBookingNews();
		const clientNews = await NewsUtil.fetchClientNews();
		// const vaMessages = await NewsUtil.fetchVaMessages();
		this.upcomingNews = this.upcomingNews.concat(bookingNews, clientNews);
		this.upcomingNews.length === 0
			? (this.isNewsfeedEmpty = true)
			: (this.isNewsfeedEmpty = false);
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
	width: 390px;
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

.separator-line {
	height: 0px;
	width: 65%;
	border: none;
	border-top: 1.2px solid rgba(216, 216, 216, 0.44);
}

/* Used since iframe has built in margin */
.temporary-header-adjustment {
	position: relative;
	top: 25px;
}

.newsfeed-widget {
	grid-column-start: 2;
	grid-column-end: 3;
}

.booking-widget {
	margin-right: 12px;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	border-radius: 16px;
	padding-top: 24px;
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
