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
					<div class="datetime">
						<div class="day">{{ getDay(message.datetime) }}</div>
						<div class="time">
							{{ timeText(message.datetime) }}
						</div>
					</div>
				</div>
			</a>
		</div>
		<div v-if="isEmpty" class="message-box">
			<div class="message">
				<div class="subject">
					ℹ️ Your bookings and new clients will show up here
				</div>
			</div>
		</div>
		<div v-if="shouldLoadNews" class="loading"></div>
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
		isEmpty: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	computed: {
		shouldLoadNews() {
			return !this.isEmpty && !this.news.length;
		},
	},
	methods: {
		openLink: (link) => {
			window.location.href = link;
		},
		timeText(dateTime) {
			return dayjs(dateTime).format("hh:mm A");
		},
		getDay(dateTime) {
			const today = new Date();
			const yesterday = getDateYesterday();
			if (isDateSame(dateTime, today)) {
				return "Today";
			} else if (isDateSame(dateTime, yesterday)) {
				return "Yesterday";
			} else if (isMoreThanAweekAgo(dateTime)) {
				return dayjs(dateTime).format("MMMM D");
			} else {
				return dayjs(dateTime).format("dddd");
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
	font-weight: 500;
}

.message-box {
	border-bottom: 1px solid lightgray;
	width: 80%;
	margin: auto;
}

.message {
	display: flex;
	color: #010564;
	margin: auto;
	margin-top: 1.5em;
	margin-bottom: 1.5em;
}

.subject {
	margin-right: auto;
	font-weight: 400;
}

.datetime {
	margin-left: auto;
	text-align: end;
}

.day {
	color: #010564;
	font-weight: 600;
}

.time {
	font-weight: 600;
	color: #6c9ce3;
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
	font-weight: 600;
	color: #010564;
}

.loading {
	width: 70%;
	margin: auto;
	margin-top: 2rem;
}
</style>
