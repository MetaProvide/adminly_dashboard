<template>
	<div>
		<ul v-for="event in events" :key="event.id" class="event">
			<li>{{ event.title }} {{ event.dateStart }}</li>
			<h3>{{ event.description }}</h3>
			<h4 v-if="event.timeStart !== event.timeEnd">
				Today: {{ event.timeStart }} - {{ event.timeEnd }}
			</h4>
			<h4 v-else>Whole Day</h4>
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
