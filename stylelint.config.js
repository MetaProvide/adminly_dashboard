const stylelintConfig = require("@nextcloud/stylelint-config");

module.exports = {
	extends: ["@nextcloud/stylelint-config", "stylelint-config-prettier"],
	rules: {
		"string-quotes": "double",
	},
};
