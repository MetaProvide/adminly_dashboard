<template>
	<div style="height: 500px">
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
				:slot="evt.dateStart"
				class="event-indicator"
			></div>
		</SlotCalendar>
	</div>
</template>

<script>
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
			width: "440px",
			firstDayOfWeek: 1,
			errored: false,
			loading: true,
		};
	},
	methods: {
		redirectToCalendar(e) {
			window.location.href = "/apps/calendar/dayGridMonth/now";
		},
	},
};
</script>

<style lang="scss">
.widget-title {
	margin: 16px 4px;
}

.event-calendar {
	.datepicker-inner {
		width: 440px;
	}
	.datepicker-body {
		span {
			width: 60px;
			height: 60px;
			vertical-align: top;
		}

		span div {
			cursor: pointer;
		}

		.event-indicator {
			background-color: rgb(206, 182, 117);
			position: relative;
			top: 5px;
			margin: 0 auto;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			cursor: pointer;
		}

		.datepicker-monthRange span {
			width: 100px;
			height: 100px;
			vertical-align: middle;
			line-height: 100px;
			// font-weight: 600;
		}
	}
}
</style>
