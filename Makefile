# This file is licensed under the Affero General Public License version 3 or
# later. See the LICENSE file.

app_name=adminly_dashboard
build_directory=$(CURDIR)/build
temp_build_directory=$(build_directory)/temp
build_tools_directory=$(CURDIR)/build/tools

all: dev-setup lint build-js-production test

release: npm-init build-js-production build-tarball
# Dev env management
dev-setup: clean clean-dev composer npm-init

lint: eslint stylelint prettier

lint-fix: eslint-fix stylelint-fix prettier-fix

# Dependencies
composer:
	composer install --prefer-dist
	composer update --prefer-dist

npm-init:
	npm ci

npm-update:
	npm update

# Building
build-js:
	npm run dev

build-js-production:
	npm run build

watch-js:
	npm run watch

serve-js:
	npm run serve

# Linting
eslint:
	npm run eslint

eslint-fix:
	npm run eslint:fix

# Style linting
stylelint:
	npm run stylelint

stylelint-fix:
	npm run stylelint:fix

# Prettier
prettier:
	npm run prettier

prettier-fix:
	npm run prettier:fix

# Cleaning
clean:
	rm -rf js/*

clean-dev:
	rm -rf node_modules

# Tests
test:
	npm run test
	./vendor/phpunit/phpunit/phpunit -c phpunit.xml
