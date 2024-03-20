#!/bin/sh

# Initial setup
last_file=""
current_file=""

while true
do
    # Find the two most recent files
    newest_file=$(ls -t /Users/ashleyshopify/Downloads/events*.ics | head -n 1)
    second_newest_file=$(ls -t /Users/ashleyshopify/Downloads/events*.ics | head -n 2 | tail -n 1)

    # If there are two files and they are different from the last two files
    if [ -n "$newest_file" ] && [ -n "$second_newest_file" ] && [ "$newest_file" != "$current_file" ] && [ "$second_newest_file" != "$last_file" ]
    then
        # Open the newest file
        open "$newest_file"

        # If there was a last file, delete it
        if [ -n "$last_file" ]
        then
            rm "$last_file"
        fi

        # Update the last and current files
        last_file=$current_file
        current_file=$newest_file
    fi

    sleep 60
done