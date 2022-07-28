<template>
	<main>
		<div class="events-widget">
			<h2>Upcoming Events</h2>
			<Events
				:events="upcomingEvents"
				:is-empty="isUpcomingEventsEmpty"
			/>
		</div>
		<div class="newsfeed-widget">
			<h2>Newsfeed</h2>
			<Newsfeed :news="sortedNews" :is-empty="isNewsfeedEmpty" />
		</div>
		<div class="calendar-booking">
			<Calendar
				:events="calendarEvents"
				:slots="calendarSlots"
				:change-pane="handleFetchCalendarEvents"
			/>
			<Booking
				class="booking-widget"
				:booking-form-url="bookingFormUrl"
			/>
		</div>
	</main>
</template>

<script>
import Events from "./components/Events";
import Calendar from "./components/Calendar";
import Booking from "./components/Booking";
import Newsfeed from "./components/Newsfeed";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { UserUtil, EventUtil, NewsUtil } from "./utils";

dayjs.extend(isBetween);

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
			calendarSlots: [],
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

		this.isUpcomingEventsEmpty = this.upcomingEvents.length === 0;

		const bookingNews = await NewsUtil.fetchBookingNews();
		const clientNews = await NewsUtil.fetchClientNews();
		// const vaMessages = await NewsUtil.fetchVaMessages();
		this.upcomingNews = this.upcomingNews.concat(bookingNews, clientNews);

		this.isNewsfeedEmpty = this.upcomingNews.length === 0;

		const previousMonth = dayjs().month(today.month() - 1);
		const eventsThisMonth = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"personal",
			previousMonth.unix(),
			nextMonth.unix()
		);

		const slotsThisMonth = await EventUtil.fetchCalendarEvents(
			UserUtil.getUserName(),
			"appointment-slots",
			previousMonth.unix(),
			nextMonth.unix()
		);

		this.calendarSlots = slotsThisMonth.map((slotEvent) => ({
			...slotEvent,
			isBooked: eventsThisMonth.some((evt) =>
				dayjs(slotEvent.dtstart).isBetween(
					evt.dtstart,
					evt.dtend,
					"minute",
					"[]"
				)
			),
		}));
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
	background: linear-gradient(180deg, #ffffff 0%, #e3e4f7 100%) !important;
	width: 100%;
	min-height: 100vh;
	padding-top: 1.25rem;
	display: grid;
	gap: 1.25rem;
	grid-template-columns: 1fr 2fr 1fr;
	grid-template-rows: 1fr;
}

.events-widget {
	width: 420px;
	grid-column-start: 1;
	grid-column-end: 2;
	display: flex;
	flex-direction: column;
	align-content: center;
	position: static;
}

h2 {
	color: #010564;
	text-align: center;
	font-size: 1.6rem;
}

.separator-line {
	height: 0px;
	width: 65%;
	border: none;
	border-top: 1.2px solid rgba(216, 216, 216, 0.44);
}

.booking-header {
	margin-top: 2.25rem;
	margin-bottom: 0.5rem;
}

.newsfeed-widget {
	grid-column-start: 2;
	grid-column-end: 3;
	padding-top: 9.25rem;
}

.calendar-booking {
	width: 420px;
	margin-left: auto;
	border-radius: 10px;
	padding-top: 1.8rem;
	grid-column-start: 3;
	grid-column-end: 4;
	display: flex;
	flex-direction: column;
	align-items: center;
}

main a {
	font-weight: 600;
}

.booking-widget {
	padding-bottom: 1rem;
}
</style>
