(function () {
  // I'm only here so you can reference an unminified copy of the code. 
  function extractActivities() {
    let titleSpans = document.querySelectorAll('.activity-title.visually-hidden');
    let activities = [];
    titleSpans.forEach(span => {
      let text = span.textContent.trim();
      if (!text.includes('No activity') && !text.includes('Blocked')) {
        let times = span.nextSibling.nextSibling.nextSibling.textContent.trim();
        activities.push(text + ' times' + times);
      }
    });

    return activities.map(parseActivity);
}

  function parseActivity(activity) {
    console.log(activity);
    let [text, times] = activity.split(' times');
    let [date, day, ...titleParts] = text.split(' ');
    let title = titleParts.join(' ').split('M ')[1];

    let [startTime, endTime] = times.split(' - ');
    let [startHour, startMinute] = parseTime(startTime);
    let [endHour, endMinute] = parseTime(endTime);

    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    console.log(year, month, date, startHour, startMinute);
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

  function convertToICS(events) {
    let now = new Date();
    let day = now.getDay();
    let diff = now.getDate() - day + (day == 0 ? -6 : 0);
    let timestamp = new Date(now.setDate(diff));

    timestamp.setHours(0, 0, 0, 0);
    console.log(timestamp.toISOString());
    let uid = 0;
    let icsEvents = events.map(event => {
      uid = uid + 1;
      return 'BEGIN:VEVENT\r\n' +
        'DTSTART:' + event.start.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'DTEND:' + event.end.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'SUMMARY:' + event.summary + '\r\n' +
        'DTSTAMP:' + timestamp.toISOString().replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
        'UID:' + 'nice' + uid + '\r\n' +
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

  try {
    let events = extractActivities();
    let ics = convertToICS(events);
    downloadICS(ics);

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