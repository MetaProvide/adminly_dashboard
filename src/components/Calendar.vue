<template>
		<div>
		<h3 class="today-text">{{todayText}}</h3>
		<SlotCalendar
			v-model="value"
			:disabled-days-of-week="disabled"
			:format="format"
			:pane="1"
			:has-input="false"
			:clear-button="clear"
			:placeholder="placeholder"
			:on-day-click="handleDayClick"
			:width="width"
			:first-day-of-week="firstDayOfWeek"
			:change-pane="changePane"
			class="event-calendar"
		>
			<div
				v-for="(evt, idx) in events"
				:key="idx"
				:slot="evt.dtstart.slice(0, 10)"
				class="event-indicator"
			></div>
		</SlotCalendar>
		</div>
</template>

<script>
import dayjs from "dayjs";
import SlotCalendar from "vue2-slot-calendar";
// import dayjs from "dayjs";

export default {
	name: "Calendar",
	components: { SlotCalendar },
	props: {
		events: {
			type: Array,
			default() {
				return [];
			},
		},
		changePane: {
			type: Function,
			default() {
				return () => true;
			},
		},
	},
	data() {
		return {
			handleDayClick: this.redirectToCalendar,
			disabled: [],
			value: new Date(),
			format: "yyyy-MM-dd",
			clear: true,
			placeholder: "Start Date",
			width: "345px",
			firstDayOfWeek: 1,
			errored: false,
			loading: true,
		};
	},
	computed: {
		todayText() {
			const today = dayjs();
			return `Today, ${today.format("D MMMM YYYY")}`;
		}
	},
	methods: {
		redirectToCalendar(e) {
			window.location.href = "/apps/calendar/dayGridMonth/now";
		},
	},
};
</script>

<style lang="scss">
.today-text {
	text-align: center;
	font-size: 20px;
	line-height: 30px;
}

.event-calendar {

	.datepicker-popup {
		box-shadow: none;
	}

	.datepicker-inner {
		width: 345px;
	}

	.datepicker-body {
		.datepicker-dateRange-item-active {
			border-radius: 8px;
		}

		span {
			width: 45px;
			height: 45px;
			// display: flex;
			// justify-content: center;
			// align-items: center;
		}

		span div {
			transform: translate(0, 25%);
		}

		span div div {
			height: 0;
		}
		// .event-indicator {
		// 	background-color: rgb(206, 182, 117);
		// 	position: relative;
		// 	top: 5px;
		// 	margin: 0 auto;
		// 	width: 10px;
		// 	height: 10px;
		// 	border-radius: 50%;
		// 	cursor: pointer;
		// }

		// .datepicker-monthRange span {
		// 	width: 100px;
		// 	height: 100px;
		// 	vertical-align: middle;
		// 	line-height: 100px;
		// 	// font-weight: 600;
		// }
	}
}
</style>
