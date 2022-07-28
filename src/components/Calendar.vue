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
import SlotCalendar from "vue2-slot-calendar";

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
	width: 387px;
	box-shadow: 4px 4px 10px rgba(145, 149, 234, 0.3);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	align-items: center;
}
</style>
<style lang="scss">
.today-text {
	text-align: center;
	font-size: 1.3rem;
	line-height: 1.8rem;
	font-weight: 500;
	color: #010564;
	margin-bottom: 1.5rem;
}

.event-calendar {
	.datepicker-popup {
		box-shadow: none;
		border-radius: 10px;
	}

	.datepicker-inner {
		width: 387px;
	}

	.datepicker-wrapper {
		width: 383px !important;
	}

	.datepicker-body {
		.datepicker-dateRange-item-active {
			border: 3px solid white;
			outline: thin solid #090fa4;
			background: #090fa4 !important;
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

		p {
			color: #000000;
			font-weight: 500;
			font-size: 1.5rem;
			line-height: 1rem;
			margin: 0 0 1.5rem;
		}

		.datepicker-weekRange {
			display: flex;
			justify-content: space-between;
			padding-inline: inherit;
		}

		.datepicker-weekRange span {
			font-weight: 500;
			color: #255280;
			height: unset;
		}

		.datepicker-dateRange span {
			margin: 2px 5px;
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
}
</style>
