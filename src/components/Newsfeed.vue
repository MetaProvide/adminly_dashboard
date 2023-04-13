<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="newsFeed">
		<div v-for="message in news" :key="message.activityId" class="message-box">
			<a :href="message.link">
				<div class="message">
					<div class="subject">
						<div v-if="message.type == 'vaMessage'" class="vaBox">
							<img :src="message.icon" alt="Avatar" class="avatar" />
							<p>{{ message.vaName }}</p>
						</div>
						<p class="title">{{ message.title }}</p>
						<p v-if="message.type == 'clients'">
							{{ message.subject }}
							<span>
								{{ message.clientName }}
							</span>
						</p>
						<p v-if="message.title == 'Booking updated'">
							<a>Booking for</a>
							<span>
								{{ message.booking }}
							</span>
							<a>at</a>
							<span>
								{{ message.dtStart }}
							</span>
							<a>has been modified</a>
						</p>
						<p v-else-if="message.type == 'appointment'">
							<span>
								{{ message.booking }}
							</span>
							{{ message.subject }}
							<span>
								{{ formattedDate(message.dtStart) }}
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
import { isDateSame, getDateYesterday, isMoreThanAweekAgo } from "../utils.js";
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
	// mounted() {
	// 	dayjs.extend(utc);
	// },
	methods: {
		openLink: (link) => {
			window.location.href = link;
		},
		formattedDate(dateTime) {
			// Split the string into date and time components
			const [dateStr, timeStr, tzStr] = dateTime.split(' ');

			// Parse the date and time components
			const [year, month, day] = dateStr.split('-').map(str => parseInt(str));
			const [hours, minutes] = timeStr.split(':').map(str => parseInt(str));

			// Determine the timezone offset in minutes
			const tzOffset = getTimezoneOffset(tzStr);

			// Create the Date object with the adjusted timezone
			const dateObj = new Date(Date.UTC(year, month - 1, day, hours - tzOffset / 60, minutes));
			// const datetime = dayjs(dateTime);
			console.log('new', Date(dateTime));
			// const datetimeWithOffset = datetime.utcOffset(60);
			// console.log('datetimeWithOffset', datetimeWithOffset);
			return dayjs(dateObj).format("MMMM D, YYYY hh:mm A Z");
			// return datetimeWithOffset.format('MMMM D, YYYY hh:mm A');
			// return dateTime
			// return datetimeWithOffset.format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]');
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

<style lang="scss" scoped>
.newsFeed {
	overflow-y: scroll;
	height: 100vh;
}

p span {
	font-weight: 500;
}

.message-box {
	border-bottom: 1px solid #e4e4e4;
	width: 80%;
	margin: auto;
}

.message {
	display: flex;
	margin-top: 0.5rem;
	margin-bottom: 1.5em;

	.title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
}

.subject {
	margin-right: auto;
	font-weight: 400;
}

.datetime {
	text-align: end;
	font-weight: 600;
}

.time {
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

.loading {
	width: 70%;
	margin: auto;
	margin-top: 2rem;
}
</style>
