<!-- eslint-disable vue/no-v-html -->
<template>
	<div>
		<ul v-for="event in safeHtmlEvents" :key="event.key" class="event">
			<li>{{ event.title }} {{ event.dateStart }}</li>
			<h3
				v-if="event.description"
				v-linkified
				v-html="event.description"
			></h3>
			<p v-if="event.location" v-linkified v-html="event.location"></p>
			<h4 v-if="event.isAllDay">All Day</h4>
			<h4 v-else>{{ event.timeStart }} - {{ event.timeEnd }}</h4>
		</ul>
	</div>
</template>

<script>
import sanitizeHtml from "sanitize-html";

export default {
	name: "Events",
	props: {
		events: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	computed: {
		safeHtmlEvents() {
			return this.events.map((evt) => ({
				...evt,
				description: sanitizeHtml(evt.description),
				location: sanitizeHtml(evt.location),
			}));
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
