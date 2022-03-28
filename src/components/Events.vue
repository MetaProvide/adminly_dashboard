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
