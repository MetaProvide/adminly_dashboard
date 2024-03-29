<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="event-column">
		<div v-if="hasEvents">
			<div
				v-for="(event, idx) in safeHtmlNonAllDayEvents"
				:key="event.key"
			>
				<UpcomingEventCard
					:is-primary="idx === 0"
					:main-title="event.meetingType"
					:date-time-start="event.dtstart"
					:date-time-end="event.dtend"
					:participants="event.summary.split('\n')[0].split(',')"
					:has-paid="false"
					:location="event.location"
					:description="event.description"
					:meeting-type="event.meetingType"
				/>
			</div>
		</div>
		<div v-else-if="isEmpty" class="no-event-container">
			<p>No sessions in the next 5 days 💤</p>
		</div>
		<div v-if="shouldLoadEvents" class="loading"></div>
	</div>
</template>

<script>
import sanitizeHtml from "sanitize-html";
import UpcomingEventCard from "./UpcomingEventCard.vue";

export default {
	name: "Events",
	components: { UpcomingEventCard },
	props: {
		events: {
			type: Array,
			default() {
				return [];
			},
		},
		isEmpty: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	computed: {
		hasEvents() {
			return this.events.length > 0;
		},
		safeHtmlNonAllDayEvents() {
			return this.events
				.filter((evt) => !evt.isAllDay)
				.map((evt) => ({
					...evt,
					description: sanitizeHtml(evt.description),
					location: sanitizeHtml(evt.location),
				}));
		},
		shouldLoadEvents() {
			return !this.isEmpty && !this.hasEvents;
		},
	},
};
</script>

<style lang="scss">
.event-column {
	padding-top: 0.5rem;
	display: flex;
	justify-content: center;
	overflow-y: scroll;
	height: 100%;
}

.no-event-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50%;
}

.no-event-container p {
	font-weight: 300;
}

::-webkit-scrollbar {
	width: 3px;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background-color: rgba(155, 155, 155, 0.15);
	border-radius: 10px;
	border: transparent;
	height: 10px;
}

.loading {
	margin-top: 2rem;
}
</style>
