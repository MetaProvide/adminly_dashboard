<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="newsFeed">
		<div
			v-for="message in news"
			:key="message.activityId"
			class="message-box"
		>
			<a :href="message.link">
				<div class="message">
					<div class="subject">
						<div v-if="message.type == 'vaMessage'" class="vaBox">
							<img
								:src="message.icon"
								alt="Avatar"
								class="avatar"
							/>
							<p>{{ message.vaName }}</p>
						</div>
						<p>{{ message.title }}</p>
						<span>{{ message.subject }}</span>
					</div>
					<div class="time">
						{{ timeText(message.datetime) }}
					</div>
				</div>
			</a>
		</div>
	</div>
</template>

<script>
import { isDateSame, getDateYesterday } from "../utils";
import dayjs from "dayjs";

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
	methods: {
		openLink: (link) => {
			window.location.href = link;
		},
		timeText(dateTime) {
			const today = new Date();
			const yesterday = getDateYesterday();
			if (isDateSame(dateTime, today)) {
				return dayjs(dateTime).format("HH:mm A");
			} else if (isDateSame(dateTime, yesterday)) {
				return `Yesterday ${dayjs(dateTime).format("hh:mm A")}`;
			} else {
				return dayjs(dateTime).format("dddd hh:mm A");
			}
		},
	},
};
</script>

<style scoped>
.newsFeed {
	overflow-y: scroll;
	height: 100vh;
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
