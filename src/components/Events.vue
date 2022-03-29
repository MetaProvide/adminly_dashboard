<template>
	<div>
		<ul v-for="event in events" :key="event.key" class="event">
			<li>{{ event.title }} {{ event.dateStart }}</li>
			<h3 v-if="event.description">{{ event.description }}</h3>
			<p v-if="event.location">{{ event.location }}</p>
			<h4 v-if="event.isAllDay">All Day</h4>
			<h4 v-else>{{ event.timeStart }} - {{ event.timeEnd }}</h4>
		</ul>
	</div>
</template>

<script>
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
