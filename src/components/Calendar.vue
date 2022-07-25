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
			width: "345px",
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
						this.colorCodes[dateStr] = "red";
					} else if (busyRatio >= 0.3) {
						this.colorCodes[dateStr] = "#E1AD01";
					} else {
						this.colorCodes[dateStr] = "blue";
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
	width: 100%;
	box-shadow: 4px 4px 4px rgba(145, 149, 234, 0.3);
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
	align-items: center;
}
</style>
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
