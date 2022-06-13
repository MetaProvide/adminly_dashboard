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
						<p class="title">{{ message.title }}</p>
						<p v-if="message.type == 'clients'">
							{{ message.subject }}
							<span>
								{{ message.clientName }}
							</span>
						</p>
						<p v-if="message.type == 'appointment'">
							<span>
								{{ message.booking }}
							</span>
							{{ message.subject }}
							<span>
								{{ message.dtStart }}
							</span>
						</p>
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
import { isDateSame, getDateYesterday, isMoreThanAweekAgo } from "../utils";
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
				return dayjs(dateTime).format("hh:mm A");
			} else if (isDateSame(dateTime, yesterday)) {
				return `Yesterday ${dayjs(dateTime).format("hh:mm A")}`;
			} else if (isMoreThanAweekAgo(dateTime)) {
				return dayjs(dateTime).format("MMMM D");
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

p span {
	color: #6295e2;
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
	text-align: end;
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

.title {
	margin-block: 0.5rem;
	font-weight: bold;
}
</style>
