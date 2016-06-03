REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) \
        --ui tdd

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) \
        --growl \
        --ui tdd \
        --watch

coverage:
	@NODE_ENV=test ./node_modules/.bin/istanbul \
	cover ./node_modules/.bin/_mocha \
	-- \
        --reporter $(REPORTER) \
        --ui tdd

.PHONY: test test-w coverage
