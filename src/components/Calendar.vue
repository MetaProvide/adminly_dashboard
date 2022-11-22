<template>
	<div class="calendar">
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
				:class="colorCodes[evt.dtstart.slice(0, 10)]"
			></div>
		</SlotCalendar>
	</div>
</template>

<script>
import dayjs from "dayjs";
/* eslint-disable */
import SlotCalendar from "./vue2-slot-calendar";

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
		slots: {
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
			width: "383px",
			firstDayOfWeek: 1,
			errored: false,
			loading: true,
			colorCodes: {},
		};
	},
	computed: {
		todayText() {
			const today = dayjs();
			return `Today, ${today.format("D MMMM YYYY")}`;
		},
	},
	watch: {
		slots(_new, _old) {
			// Accumulate slots by date
			const slotsObj = {};
			for (const slotEvent of this.slots) {
				const dateStr = slotEvent.dtstart.slice(0, 10);
				slotsObj[dateStr] = slotsObj[dateStr]
					? [...slotsObj[dateStr], slotEvent.isBooked]
					: [slotEvent.isBooked];
			}

			// calculate ratios for each date
			for (const dateStr in slotsObj) {
				if (Object.hasOwnProperty.call(slotsObj, dateStr)) {
					const busyRatio =
						slotsObj[dateStr].filter(Boolean).length /
						slotsObj[dateStr].length;

					if (busyRatio >= 0.99) {
						this.colorCodes[dateStr] = "#F40000";
					} else if (busyRatio >= 0.3) {
						this.colorCodes[dateStr] = "#F68500";
					} else {
						this.colorCodes[dateStr] = "#6295E2";
					}
				}
			}

			this.applyDateStyling();
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
			document.querySelectorAll(".day-cell").forEach((day) => {
				day.style.color = this.colorCodes[day.dataset.date] || "black";
			});
		},
	},
};
</script>
<style scoped>
.calendar {
	background-color: white;
	width: 389px;
	box-shadow: 4px 4px 10px rgba(145, 149, 234, 0.3);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	align-items: center;
}
</style>
<style lang="scss">
.app-adminly_dashboard .today-text {
	text-align: center;
	font-size: 1rem;
	font-weight: 500;
	color: #010564;
	margin-bottom: 0.5rem;
	margin-top: 1rem;
}

.app-adminly_dashboard .event-calendar {
	font-family: var(--font-face);

	.datepicker-popup {
		box-shadow: none;
		border-radius: 10px;
	}

	.datepicker-inner {
		width: 387px;
	}

	.datepicker-body {
		.datepicker-dateRange-item-active {
			border: 2px solid white;
			outline: 2px solid #6295e2;
			background: #090fa4 !important;
			font-size: 1rem;
			font-weight: 700;
			height: 39px;
			width: 39px;

			div {
				line-height: 35px;
			}
		}

		span {
			width: 42px;
			height: 42px;
			border-radius: 21px;
			margin: 2px 5px;
		}

		span div {
			line-height: 42px;
		}

		p {
			color: var(--color-main-text);
			font-weight: 500;
			font-size: 1.125rem;
			line-height: 1rem;
			margin: 0 0 1.5rem;
		}

		.datepicker-weekRange {
			display: flex;
			justify-content: space-between;
		}

		.datepicker-weekRange span {
			font-weight: 500;
			color: #255280;
			height: unset;
		}
	}

	.datepicker-item-gray {
		color: unset;
		opacity: 0.5;
	}

	.datepicker-ctrl span {
		width: 80px;
		color: #090fa4;
		font-weight: 900;
	}

	.datepicker-ctrl .datepicker-preBtn.calendaricon-angle-left::before,
	.datepicker-ctrl .datepicker-nextBtn.calendaricon-angle-right::before {
		background-image: url("../../img/rightarrow.svg");
		background-position: center;
		background-repeat: no-repeat;
		background-size: 12px;
		content: "";
		display: inline-block;
		width: 28px;
		height: 28px;
	}

	.datepicker-ctrl .datepicker-preBtn.calendaricon-angle-left::before {
		transform: rotate(180deg);
	}
}
</style>
