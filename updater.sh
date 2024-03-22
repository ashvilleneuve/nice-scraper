#!/bin/sh

last_file=""
current_file=""

while true
  do
      newest_file=$(ls -t ~/Downloads/events*.ics | head -n 1)
      second_newest_file=$(ls -t ~/Downloads/events*.ics | head -n 2 | tail -n 1)
      file_count=$(ls ~/Downloads/events*.ics | wc -l | tr -d ' ')

      if [[ $file_count -gt 2 ]] 
      then
      find ~/Downloads -name "events*.ics" -print0 | xargs -0 ls -t | tail -n +3 | tr '\n' '\0' | xargs -0 rm --
      fi


      if [ -n "$newest_file" ] && [ -n "$second_newest_file" ] && [ "$newest_file" != "$current_file" ] && [ "$second_newest_file" != "$last_file" ]
      
      then
          diff "$newest_file" "$second_newest_file"
          cmp -l "$newest_file" "$second_newest_file"
          if ! cmp -s "$newest_file" "$second_newest_file"
          
          then
              echo "Schedule has changed, please import to calendar"
              open "$newest_file"

              if [ -n "$last_file" ]
              then
                  rm "$last_file"
              fi

              last_file=$current_file
              current_file=$newest_file
          fi
      fi
      sleep 60
  done