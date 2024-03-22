This is a javascript bookmarklet and shell script that will (theoretically) let you pull Nice scheduling data into your Google calendar automatically. It's an ugly solution, but might be the only one we have for now. 

To use it, you'll need to:

1. Add your Google calendar account to the [mac Calendar app on your laptop](https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DDesktop). (If you get a warning that the Calendar app is not approved, you will need to [login to your managed apple id](https://vault.shopify.io/page/Managed-Apple-ID-Setup~14471.md) first.)
2. Set the refrsh interval to some automatic interval (not manual) and make your Google calendar the default.
3. Pin the [Nice Employee Engagement schedule screen](https://portal.shopify-eem.nicecloudsvc.com/agent/dashboard) open in a browser tab.
4. Be willing to keep a terminal instance running and minified.
5. Be willing to keep a couple of .ics files in your Downloads folder.

Once you've done steps 1 - 3, you can copy the javascript from the scraper.min.js file here. Create a new bookmark in your Bookmark Bar. Edit the bookmark and replace the URL with the javascript you copied, then save the change.

Switch to the Nice schedule tab and click the new bookmark. This starts the scraper running; unless you manually refresh the page, it should keep running every ten minutes as long as your computer is awake. 

Save the updater.sh file to your computer. It's best to tuck it away where it won't be accidentally deleted. 

In terminal, `cd` to the same directory as the updater.sh file. Run `chmod u+x updater.sh`. Then run `./updater.sh`. This will start the updater. If the scraper already added an ics file to your downloads folder, the Calendar app should open and ask you to import it. Click okay. 

If everything goes as expected, Calendar should sync all these new events to your Google calendar. Meanwhile, our two scripts should be checking for changes in the background, and, if there are any, asking you to import the updated .ics file. 

And voila! That was...hardly any trouble at all. 😅

(Note: if your schedule doesn't change much, you can also just use the bookmarklet to download an ics file once a week and import it manually. Skip all the instructions after "click the new bookmark" and be sure to close the Nice tab once the file is downloaded.)
