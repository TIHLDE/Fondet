.PHONY: install dev build start lint typecheck test test-watch e2e check

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

test:
	npm run test

test-watch:
	npm run test:watch

e2e:
	npm run test:e2e

check: lint typecheck test build
