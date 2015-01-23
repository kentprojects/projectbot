#!/bin/sh
while true; do
	HUBOT_SLACK_TOKEN=ADD-YOUR-TOKEN-HERE \
	PORT=8080 \
	./bin/hubot \
	--adapter slack
done
