<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="event">
		<div class="row just-sb">
			<div class="column">
				<span class="title">{{ mainTitle }}</span>
				<div class="participant row">
					<div
						v-for="participant in cleanedParticipants"
						:key="participant"
						class="avatar-container"
					>
						<Avatar :username="participant" :size="24" />
					</div>
					<span class="text">{{ participantsText }}</span>
				</div>
			</div>
			<div class="datetime">
				<div class="day">{{ dayText }}</div>
				<div class="time">
					{{ timeText }}
				</div>
			</div>
		</div>

		<div class="column title">
			<h4>Description</h4>
			<p
				v-linkified
				class="text description-text"
				v-html="safeDescription"
			></p>
		</div>
		<p v-if="phone" class="text">
			<span class="icon phone-icon"></span>
			<a class="link" :href="`tel:${phone}`">{{ phone }}</a>
		</p>
		<p v-if="email" class="text">
			<span class="icon email-icon"></span>
			<a class="link" :href="`mailto:${email}`">{{ email }}</a>
		</p>
		<p v-if="location" class="text">
			<span class="icon location-icon"></span>
			<a class="link">{{ location }}</a>
		</p>
		<p v-if="mainLink" class="text">
			<span class="icon video-icon"></span>
			<span v-if="mainLink" class="talk-link"
				>Link:
				<a :href="mainLink">{{
					mainLink.length > 32
						? mainLink.slice(0, 32) + "..."
						: mainLink
				}}</a>
			</span>
		</p>
	</div>
</template>

<script>
import Avatar from "vue-avatar";
import sanitizeHtml from "sanitize-html";
import { isDateSame, getDateTomorrow } from "../utils";
import dayjs from "dayjs";

export default {
	name: "UpcomingEventCard",
	components: {
		Avatar,
	},
	props: {
		isPrimary: {
			type: Boolean,
			default() {
				return false;
			},
		},
		mainTitle: {
			type: String,
			default() {
				return "";
			},
		},
		participants: {
			type: Array,
			default() {
				return [];
			},
		},
		descriptionTitle: {
			type: String,
			default() {
				return "";
			},
		},
		description: {
			type: String,
			default() {
				return "";
			},
		},
		location: {
			type: String,
			default() {
				return "";
			},
		},
		dateTimeStart: {
			type: String,
			default() {
				return "";
			},
		},
		dateTimeEnd: {
			type: String,
			default() {
				return "";
			},
		},
	},
	data() {
		return {
			phoneRegex: /\+?[1-9][0-9]{7,14}/g,
			emailRegex: /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
		};
	},
	computed: {
		mainLink() {
			// Find last link in description or location
			const links = [
				...(this.linkify(this.location || "") || []),
				...(this.linkify(this.description || "") || []),
			].filter(Boolean);

			return links.pop();
		},
		email() {
			return this.description.match(this.emailRegex).pop();
		},
		phone() {
			return this.description.match(this.phoneRegex).pop();
		},
		safeDescription() {
			return sanitizeHtml(this.cleanDescription(this.description));
		},
		participantsText() {
			return this.participants
				.map((text) => text.replace(/\p{Emoji}/gu, "").trim())
				.join(", ");
		},
		cleanedParticipants() {
			return this.participants.map((text) => {
				const fullname = text.replace(/\p{Emoji}/gu, "").trim();
				const words = fullname.split(" ");
				const wordLimit = Math.max(words.length - 1, 2);
				return words.slice(0, wordLimit).join(" ");
			});
		},
		timeText() {
			return dayjs(this.dateTimeStart).format("hh:mm A");
		},
		dayText() {
			const today = new Date();
			const tomorrow = getDateTomorrow();
			if (isDateSame(this.dateTimeStart, today)) {
				return "Today";
			} else if (isDateSame(this.dateTimeStart, tomorrow)) {
				return "Tomorrow";
			} else {
				return (
					dayjs(this.dateTimeStart)
						.format("dddd DD")
						.replace(" ", ", ") + "th"
				);
			}
		},
	},
	methods: {
		cleanDescription(str) {
			str = this.talkUrlPruned(str);
			str = this.emailPruned(str);
			str = this.phonePruned(str);
			return str;
		},
		talkUrlPruned(str) {
			// remove any text that is part of `/call\/[a-z0-9]+/`
			return str.replace(/https?:\/\/.*\/call\/[a-z0-9]+/g, "");
		},
		emailPruned(str) {
			return str.replace(this.emailRegex, "");
		},
		phonePruned(str) {
			return str.replace(this.phoneRegex, "");
		},
		linkify(text) {
			const urlRegex =
				/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi; // eslint-disable-line
			return text.match(urlRegex);
		},
	},
};
</script>

<style lang="scss">
.event {
	width: 387px;
	padding: 0.6rem 1.25rem 0 1.25rem;
	padding: 1.5rem;
	background: #ffffff;
	margin-bottom: 1rem;
	box-shadow: 4px 4px 10px rgba(145, 149, 234, 0.3);
	border-radius: 10px;

	svg {
		width: 24px;
		height: 24px;
	}

	.avatar-container:not(:first-child) {
		margin-left: -0.5rem;
	}

	.row {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;

		span {
			margin-left: 0.5rem;
		}

		.title {
			font-size: 1.05rem;
			font-weight: 500;
			margin-left: 0;
			margin-bottom: auto;
		}

		.datetime {
			margin-left: auto;
			text-align: end;
			font-weight: 600;
		}

		.day {
			color: #010564;
		}

		.time {
			font-size: 0.85rem;
			font-weight: 600;
			margin-left: 0;
			color: #6c9ce3;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.5rem;
	}

	.primary {
		color: #6295e2;
	}

	.text {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.just-sb {
		justify-content: space-between;
	}

	.link {
		padding-left: 1.25rem;
	}

	.talk-link {
		padding-left: 1.25rem;
	}

	.talk-link a {
		color: #6295e2;
		text-decoration: underline;
	}

	.description-text {
		color: #010564;
		line-height: 1rem;
		margin-bottom: 0.75rem;
	}

	.vue-avatar--wrapper span {
		margin-left: 0;
	}

	h3 {
		margin-top: 0;
	}

	h4 {
		font-weight: 500;
		color: #010564;
		line-height: 2.5rem;
	}

	.participant {
		padding-top: 0.25rem;
	}

	.icon::before {
		content: "";
		background-repeat: no-repeat;
		background-position: left;
		padding: 0.5rem 0.8rem;
	}

	.email-icon::before {
		background-image: url("../../img/email.svg");
	}

	.phone-icon::before {
		background-image: url("../../img/phone.svg");
	}

	.location-icon::before {
		background-image: url("../../img/location.svg");
	}

	.video-icon::before {
		background-image: url("../../img/video.svg");
	}
}
</style>
