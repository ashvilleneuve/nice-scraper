This is a javascript bookmarklet and shell script that will let you pulls Nice scheduling data into an .ics file and add it to your Google calendar. It's an ugly solution, but might be the best one we have for now. :D 

To use it, you must:

1. Add your Google calendar account to the [mac Calendar app on your laptop](https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DDesktop).
2. Set the refrsh interval to some automatic interval (not manual) and make your Google calendar the default.
3. Keep the [Nice Employee Engagement schedule screen](https://portal.shopify-eem.nicecloudsvc.com/agent/dashboard) open in a browser tab.
4. Keep a terminal instance running and minified.
5. Keep a couple of .ics files in your Downloads folder.

Once that's set up, you can copy the javascript from the scraper.min.js file here. Create a new bookmark in your Bookmark Bar. Edit the bookmark and replace the URL with the javascript you copied, then save the change.

Switch to the Nice schedule tab and click the new bookmark. This starts the scraper running; unless you manually refresh the page, it will keep running every ten minutes as long as your computer is awake. I've tested for a few hours and it also seems to make Nice think there is activity in the tab because it doesn't log you out.

Save the updater.sh file to your computer. It's best to tuck it away where it won't be accidentally deleted. 

In terminal, `cd` to the same directory as the updater.sh file. Run `chmod u+x updater.sh`. Then run `updater.sh`. This will start the updater. If the scraper already added an ics file to your downloads folder, the Calendar app should open and ask you to import it. Click okay. 

If everything goes as expected, Calendar should sync all these new events to your Google calendar. Meanwhile, our two scripts should be checking for changes in the background, and, if there are any, asking you to import the updated .ics file. 

And voila! That was...hardly any trouble at all. 😅
