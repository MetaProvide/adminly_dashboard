<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="event">
		<h2 class="row title" :class="{ primary: isPrimary }">
			<span>{{ mainTitle }}</span> <span>{{ timeText }}</span>
		</h2>
		<div class="row">
			<div
				v-for="participant in cleanedParticipants"
				:key="participant"
				class="avatar-container"
			>
				<Avatar :username="participant" :size="24" />
			</div>
			<span class="text">{{ participantsText }}</span>
		</div>
		<div v-if="Math.random() > 0.5" class="row">
			<svg
				width="24"
				height="24"
				viewBox="0 0 23 23"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="11.5" cy="11.5" r="11.5" fill="#6295E2" />
				<path
					d="M16.2453 6.13281L10.0894 14.2489L6.44987 10.612L4.77051 12.2914L10.3675 17.8884L18.2054 7.81218L16.2453 6.13281Z"
					fill="white"
				/>
			</svg>

			<span class="text">Payment Done</span>
		</div>
		<div v-else class="row">
			<svg
				width="23"
				height="23"
				viewBox="0 0 23 23"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="11.5"
					cy="11.5"
					r="10.5"
					stroke="#6295E2"
					stroke-width="2"
				/>
			</svg>
			<span class="text">Not Paid Yet</span>
		</div>
		<div v-if="isPrimary" class="column title">
			<h4>Description</h4>
			<p
				v-linkified
				class="text description-text"
				v-html="safeDescription"
			></p>
		</div>
		<p v-if="mainLink" class="row">
			<svg
				width="21"
				height="14"
				viewBox="0 0 21 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0 2.625C0 1.92881 0.276562 1.26113 0.768845 0.768845C1.26113 0.276562 1.92881 1.81797e-08 2.625 1.81797e-08H12.4688C13.1054 -7.48755e-05 13.7204 0.231253 14.1993 0.650905C14.6781 1.07056 14.988 1.64993 15.0714 2.28112L19.1533 0.46725C19.3531 0.378225 19.572 0.340546 19.7901 0.357637C20.0081 0.374728 20.2185 0.446048 20.4019 0.565113C20.5854 0.684179 20.7363 0.847214 20.8407 1.0394C20.9451 1.23159 20.9999 1.44683 21 1.66556V11.4594C20.9998 11.678 20.945 11.8931 20.8407 12.0851C20.7363 12.2771 20.5856 12.44 20.4023 12.5591C20.219 12.6781 20.0089 12.7495 19.791 12.7667C19.5731 12.7839 19.3544 12.7465 19.1546 12.6578L15.0714 10.8439C14.988 11.4751 14.6781 12.0544 14.1993 12.4741C13.7204 12.8937 13.1054 13.1251 12.4688 13.125H2.625C1.92881 13.125 1.26113 12.8484 0.768845 12.3562C0.276562 11.8639 0 11.1962 0 10.5V2.625Z"
					fill="#6295E2"
				/>
			</svg>
			<span v-if="mainLink" class="text"
				>Link:
				<a
					:href="mainLink"
					class="link"
					:class="{ primary: isPrimary }"
					>{{
						mainLink.length > 32
							? mainLink.slice(0, 32) + "..."
							: mainLink
					}}</a
				></span
			>
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
		hasPaid: {
			type: Boolean,
			default() {
				return false;
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
	computed: {
		mainLink() {
			// Find last link in description or location
			const links = [
				...(this.linkify(this.location || "") || []),
				...(this.linkify(this.description || "") || []),
			].filter(Boolean);

			return links.pop();
		},
		safeDescription() {
			return sanitizeHtml(this.talkUrlPruned(this.description));
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
			const today = new Date();
			const tomorrow = getDateTomorrow();
			if (isDateSame(this.dateTimeStart, today)) {
				return dayjs(this.dateTimeStart).format("HH:mm");
			} else if (isDateSame(this.dateTimeStart, tomorrow)) {
				return "Tomorrow";
			} else {
				return dayjs(this.dateTimeStart).format("YYYY-MM-DD");
			}
		},
	},
	methods: {
		talkUrlPruned(str) {
			// remove any text that is part of `/call\/[a-z0-9]+/`
			return str.replace(/https:\/\/.*\/call\/[a-z0-9]+/g, "");
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
	max-width: 345px;
	padding: 22px;
	background: #ffffff;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	border-radius: 16px;
	margin-bottom: 16px;

	svg {
		width: 24px;
		height: 24px;
	}

	.avatar-container:not(:first-child) {
		margin-left: -8px;
	}

	.row {
		display: flex;
		align-items: center;
		margin-bottom: 8px;

		span {
			margin-left: 8px;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
	}

	.primary {
		color: #6295e2;
	}

	.text {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 0.9rem;
	}

	.title {
		font-size: 1.2rem;
		font-weight: 500;
		width: 100%;
		justify-content: space-between;
		span {
			margin: 0;
		}
	}

	.link {
		text-decoration: underline;
	}

	.description-text {
		color: #595959;
		line-height: 15px;
	}

	.vue-avatar--wrapper span {
		margin-left: 0;
	}
}
</style>