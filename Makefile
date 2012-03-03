SRC = lib/events.js lib/model.js
TEST = test/*.js
REPORTER = list

all: model.js

site : docs/index.md 
	@./node_modules/.bin/markx --lang javascript docs/index.md | cat site/layout/head.html - site/layout/foot.html > site/index.html

preview-docs:
	@./node_modules/.bin/markx --lang javascript --preview 8001 docs/index.md 

preview-readme:
	@./node_modules/.bin/markx --preview 8001 README.md 

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha -R list

model.js: $(SRC)
	@./node_modules/.bin/clientside > dist/model.js

.PHONY: test preview-docs preview-readme
