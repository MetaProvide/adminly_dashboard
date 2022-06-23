<template>
	<div>
		<h3 class="today-text">{{ todayText }}</h3>
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
		},
	},
	updated() {},
	methods: {
		redirectToCalendar(e) {
			window.location.href = "/apps/calendar/dayGridMonth/now";
		},
		mod(a, n) {
			return a - n * Math.floor(a / n);
		},
		applyDateStyling() {
			const today = dayjs();
			const currentDayIndex = this.mod(today.day() - 1, 6); // because monday should be index 0

			document
				.querySelector(".datepicker-weekRange")
				.childNodes.forEach((daySpan, idx) => {
					daySpan.style.fontWeight =
						currentDayIndex === idx ? 900 : 500;
				});

			document.querySelectorAll(".day-cell").forEach((day) => {
				if (
					this.events.some(
						(evt) =>
							dayjs(evt.dtstart).date() === Number(day.innerText)
					)
				) {
					day.style.color = "#F68500";
					day.style.fontWeight = 600;
				}
			});
		},
	},
};
</script>

<style lang="scss">
.today-text {
	text-align: center;
	font-size: 1.3rem;
	line-height: 1.8rem;
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
			border: 3px solid white;
			outline: thin solid #3276b1;
			line-height: 24px;
		}

		span {
			width: 42px;
			height: 42px;
			border-radius: 14px;
			margin: 2px;
			line-height: 28px;
		}

		span div {
			transform: translate(0, 25%);
		}

		span div div {
			height: 0;
		}
	}

	.datepicker-item-gray {
		color: unset;
		opacity: 0.5;
	}
}
</style>
