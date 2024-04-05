(function () {
  // I'm only here so you can reference an unminified copy of the code. 
  function extractActivities() {
    let titleSpans = document.querySelectorAll('.activity-title.visually-hidden');
    let activities = [];
    titleSpans.forEach(span => {
      let text = span.textContent.trim();
      if (!text.includes('No activity') && !text.includes('Blocked')) {
        let timesElement = span.nextSibling.nextSibling.nextSibling;
        let times;
        console.log(timesElement.nodeName)
        if (timesElement.nodeName != 'span') {
          times = `(${text.split(' ')[2]}:${text.split(' ')[3]} ${text.split(' ')[4]} - ${text.split(' ')[2]}:${(text.split(' ')[3] + 15)} ${text.split(' ')[4]})`
        } else {
          times = timesElement.textContent.trim();
        }
        console.log('a times',times)

        activities.push(text + ' times' + times);
      }
    });

    return activities.map(parseActivity);
}

  function parseActivity(activity) {
    console.log(activity);
    let dateSpan = document.querySelector('eem-date-navigator #input-mask').textContent.split('| ')[1]
    let openMonth = dateSpan.split(' – ')[0].split('-')[0];
    let closeMonth = dateSpan.split(' – ')[1].split('-')[0];
    let monthsEnd = openMonth != closeMonth;
    let [text, times] = activity.split(' times');
    let [date, day, ...titleParts] = text.split(' ');
    let title = titleParts.join(' ').split('M ')[1];

    let [startTime, endTime] = times.split(' - ');
    console.log('starttime endtime', startTime, endTime);

    let [startHour, startMinute] = parseTime(startTime);
    console.log('startHour, startMinute', startHour, startMinute);
    let [endHour, endMinute] = parseTime(endTime);
    console.log('endHour, endMinute', endHour, endMinute);

    let year = new Date().getFullYear();
    let eMonth = monthsEnd && date < 7 ? closeMonth : openMonth;
    let month = getMonthNumber(eMonth);
    console.log('monthsEnd, eMonth, month', monthsEnd, eMonth, month)
    console.log('year, month, date, startHour, startMinute', year, month, date, startHour, startMinute);
    let startDate = new Date(year, month, date, startHour, startMinute);
    let endDate = new Date(year, month, date, endHour, endMinute);

    return {
      'summary': title,
      'start': {
        'dateTime': startDate.toISOString(),
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': endDate.toISOString(),
        'timeZone': 'America/Los_Angeles'
      }
    };
  }

  function parseTime(time) {
    let [hour, minute] = time.replace('AM', '').replace('PM', '').replace('(', '').replace(')', '').trim().split(':');
    if (time.includes('PM') && hour !== '12') hour = parseInt(hour) + 12;
    if (time.includes('AM') && hour === '12') hour = '00';
    return [hour, minute];
  }

  function getMonthNumber(monthName) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.indexOf(monthName);
  }

  function convertToICS(events) {
    let now = new Date();
    let day = now.getDay();
    let diff = now.getDate() - day + (day == 0 ? -6 : 0);
    let timestamp = new Date(now.setDate(diff));

    timestamp.setHours(0, 0, 0, 0);
    let uid = 0;
    let icsEvents = events.map(event => {
      let edate = new Date(event.start.dateTime);
      let eday = edate.getUTCDate();
      let eMonth = edate.getUTCMonth();
      let eYear = edate.getFullYear();
      uid = uid+eYear+eMonth+eday+1;
      console.log(uid);
      return 'BEGIN:VEVENT\r\n' +
        'DTSTART:' + event.start.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'DTEND:' + event.end.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'SUMMARY:' + event.summary + '\r\n' +
        'DTSTAMP:' + timestamp.toISOString().replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'UID:' + 'nicescraper' + uid + '\r\n' +
        'END:VEVENT';
    }).join('\r\n');

    return 'BEGIN:VCALENDAR\r\n' +
      'VERSION:2.0\r\n' +
      'PRODID:-//Shopify//Event scraper//EN\r\n' +
      icsEvents + '\r\n' +
      'END:VCALENDAR';
  }


  function downloadICS(ics) {
    let blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = 'events.ics';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function keepAlive() {
    let keepAliveLink = document.querySelector('.btn-refresh');
    keepAliveLink.click();
  }

  function oktaWatch() {
    const oktaTarget = document.getElementById('okta-plugin-message-channel-available');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
        } else if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    };
    
    const observer = new MutationObserver(callback);
    
    observer.observe(oktaTarget, config);
    
  }

  try {
    let events = extractActivities();
    let ics = convertToICS(events);
    downloadICS(ics);
    oktaWatch();

    setInterval(() => {
      events = extractActivities();
      ics = convertToICS(events);
      downloadICS(ics);
    }, 600000);

    setInterval(keepAlive, 60000);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();