<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="event-column">
		<div v-for="(event, idx) in safeHtmlNonAllDayEvents" :key="event.key">
<<<<<<< HEAD
			<UpcomingEventCard
=======
			<EventCard
>>>>>>> fixed uft8 characters
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
	},
	computed: {
		safeHtmlNonAllDayEvents() {
			return this.events
				.filter((evt) => !evt.isAllDay)
				.map((evt) => ({
					...evt,
					description: sanitizeHtml(evt.description),
					location: sanitizeHtml(evt.location),
				}));
		},
	},
};
</script>

<style lang="scss">
.event-column {
	max-width: 385px;
	padding: 10px 22px 0px 22px;
	overflow-y: scroll;
	height: 100%;
	background: linear-gradient(
		180deg,
		rgba(255, 255, 255, 0) 0%,
		#dcedff 79.45%,
		#e2e2ff 100%
	);
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
</style>
