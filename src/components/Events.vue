<template>
	<div>
		<ul v-for="item in items" :key="item.id" class="event">
			<li>{{ item.title }} {{ item.tstart }}</li>
			<h3>{{ item.content }}</h3>
			<h4>{{ item.tstart }} - {{ item.tend }}</h4>
		</ul>
	</div>
</template>

<script>
import axios from "@nextcloud/axios";

const calendarEvents = [];
let description = "";
const userName = document
	.querySelector("head")
	.getAttribute("data-user-displayname");
const currentDate = Date.now().toString().slice(0, -5);

export default {
	name: "Events",
	data() {
		return {
			items: calendarEvents,
		};
	},
	mounted() {
		axios
			.get(
				"/remote.php/dav/calendars/" +
					userName +
					"/personal?" +
					"&export&accept=jcal&componentType=VEVENT&start=" +
					currentDate +
					"&end=" +
					currentDate +
					600000
			)
			.then(function (response) {
				// handle success
				response.data[2].slice(1).forEach((element) => {
					if (Object.keys(element[1]).length > 9) {
						description = element[1][9][3];
					} else description = "";
					const startDate = new Date(element[1][5][3]);
					const endDate = new Date(element[1][6][3]);
					calendarEvents.unshift({
						id: element[1][4][3],
						title: element[1][8][3],
						content: description,
						tstart: startDate.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						tend: endDate.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					});
				});
			});
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
