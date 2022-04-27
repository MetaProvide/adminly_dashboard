<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="newsFeed">
		<div
			v-for="message in news"
			:key="message.activityId"
			class="message-box"
		>
			<div class="message">
				<div class="subject">
					<div v-if="message.type == 'vaMessage'" class="vaBox">
						<img :src="message.icon" alt="Avatar" class="avatar" />
						<p>{{ message.vaName }}</p>
					</div>
					<p>{{ message.title }}</p>
					<span>{{ message.subject }}</span>
				</div>
				<div class="time">{{ message.time }}</div>
			</div>
		</div>
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
.newsFeed {
	width: 100%;
}

.message-box {
	border-bottom: 1px solid lightgray;
	width: 70%;
	margin: auto;
}

.message {
	display: flex;
	margin: auto;
	margin-top: 1.5em;
	margin-bottom: 1.5em;
}

.subject {
	margin-right: auto;
}

.time {
	margin-left: auto;
	color: blue;
}

.avatar {
	vertical-align: middle;
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.vaBox {
	display: flex;
}
</style>
