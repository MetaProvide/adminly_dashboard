<template>
	<div>
		<iframe
			v-if="bookingFormUrl"
			id="bookingForm"
			:src="bookingFormUrl"
			frameborder="0"
		></iframe>
		<div v-else>Please setup a public form in appointments app</div>
	</div>
</template>

<script>
export default {
	name: "Booking",
	props: {
		bookingFormUrl: {
			type: String,
			default() {
				return "";
			},
		},
	},
	mounted() {
		const bookingFormEl = document.querySelector("#bookingForm");
		bookingFormEl.addEventListener("load", (evt) => {
			const headerTextEl = this.getConfirmationHeaderElement(evt.target);
			const confirmationTextEl = this.getConfirmationTextElement(
				evt.target
			);
			const thanksTextEl = this.getThankYouTextElement(evt.target);

			if (headerTextEl && confirmationTextEl && thanksTextEl) {
				// Update header text
				headerTextEl.innerText = "Confirmation e-mail sent";

				// Update confirmation text
				const email = this.extractEmail(confirmationTextEl.innerText);
				confirmationTextEl.innerHTML = `We have sent an email to <b>${email}</b> with a confirmation link.`;

				// Additional explaination
				confirmationTextEl.insertAdjacentHTML(
					"afterend",
					"<p>Event will be marked from ⌛ to ✔ once confirmed</p>"
				);

				// Replace thank you with redirect button
				thanksTextEl.innerHTML = `
					<button class="primary"><a style="color: var(--color-primary-text);"href="${this.bookingFormUrl}">Back</a></button>
				`;
			}
		});
	},
	methods: {
		extractEmail(str) {
			const matches = str.match(
				/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z0-9_-]+)/gi
			);
			if (matches.length < 1) {
				console.error("No email found in string");
				return;
			}
			return matches[0];
		},
		getConfirmationHeaderElement(target) {
			return target.contentDocument.querySelector(
				".srgdev-appt-info-cont h1"
			);
		},
		getConfirmationTextElement(target) {
			return target.contentDocument.querySelectorAll(
				".srgdev-appt-info-cont p"
			)[0];
		},
		getThankYouTextElement(target) {
			return target.contentDocument.querySelectorAll(
				".srgdev-appt-info-cont p"
			)[1];
		},
	},
};
</script>

<style scoped>
iframe {
	box-shadow: 4px 4px 10px rgba(145, 149, 234, 0.3);
	border-radius: 10px;
	width: 387px;
	height: 520px;
}
</style>
