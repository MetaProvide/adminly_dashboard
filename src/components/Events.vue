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
import {
	getEventsUrl,
	getEventId,
	getDescription,
	getEndDate,
	getEventsObjects,
	getStartDate,
	getTitle,
	userName,
} from "../utils.js";

const currentDate = Date.now().toString().slice(0, -3);
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
			axios
				.get(getEventsUrl(userName, "personal", currentDate))
				.then((response) => {
					// handle success
					this.events = getEventsObjects(response.data).map(
						(element) => ({
							id: getEventId(element),
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
