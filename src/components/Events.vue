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
import { EventUtil, UserUtil } from "../utils.js";

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
				.get(
					EventUtil.getApiUrl(
						UserUtil.getName,
						"personal",
						currentDate
					)
				)
				.then((response) => {
					// handle success
					this.events = EventUtil.getObjects(response.data).map(
						(element) => ({
							id: EventUtil.getId(element),
							title: EventUtil.getTitle(element),
							description: EventUtil.getDescription(element),
							tstart: EventUtil.getStartDate(element),
							tend: EventUtil.getEndDate(element),
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
