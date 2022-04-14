<!-- eslint-disable vue/no-v-html -->
<template>
	<div>
		<h2>Newsfeed</h2>
		<ul v-for="entry in news" :key="entry.key" class="news">
			<li>{{ entry.subject }} {{ entry.timeSince }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Newsfeed",
	props: {
		news: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style scoped>
.news {
	background-color: rgb(238, 233, 144);
	padding: 10px;
	margin: 10px;
	border-radius: 25px;
}
</style>
