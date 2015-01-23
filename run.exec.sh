#!/bin/sh
while true; do
	HUBOT_SLACK_TOKEN=INSERT-YOUR-SLACK-TOKEN-HERE \
	PORT=8080 \
	./bin/hubot --adapter slack 2> error.log 1> output.log
done
