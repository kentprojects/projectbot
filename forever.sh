#!/bin/bash
# A simple script to invoke forever and handle log files.
TIMESTAMP=$(date +"%s")

startForever() {
	mkdir .forever -p
	forever start \
		-o ".forever/bot.out.log" \
		-e ".forever/bot.error.log" \
		-c "sh" bin/hubot
	echo "Hubot started"
	forever list
}

stopForever() {
	mkdir .forever/$TIMESTAMP -p
	mv .forever/*.log .forever/$TIMESTAMP/
	forever stop bin/hubot
	echo "Hubot stopped"
	forever list
}

case "$1" in
	"start") startForever ;;
	"stop") stopForever ;;
	*)
		printf "A simple utility to run forever!!\n"
		printf "Usage: ./forever.sh (start|stop)\n"
		;;
esac
