.PHONY: all clean zip sign

all: zip

clean:
	rm -rf dist *.{zip,xpi}

dist:
	mkdir -p dist
	cp -r src icons manifest.json dist/

zip: clean dist
	cd dist && zip -r ../void-tab.zip * && zip -r ../void-tab-firefox.xpi * 

sign: zip
	web-ext sign --source-dir dist \
		--api-key=$${AMO_JWT_ISSUER} \
		--api-secret=$${AMO_JWT_SECRET} \
		--channel=unlisted 