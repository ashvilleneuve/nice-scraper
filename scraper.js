javascript:(function(){
  function extractActivities() {
      let titleSpans = document.querySelectorAll('.activity-title.visually-hidden');
      let activities = [];
      titleSpans.forEach(span => {
          let text = span.textContent.trim();
          if (!text.includes('No activity') && !text.includes('Blocked')) {
            let times = span.nextSibling.nextSibling.nextSibling.textContent.trim();
              activities.push(text+' times'+times);
          }
      });

      let events = [];
      let year = new Date().getFullYear();
      let month = new Date().getMonth();

      activities.forEach(activity => {
        console.log(activity);
          let text = activity.split(' times')[0];
          let [date, day, ...titleParts] = text.split(' ');
          let times = activity.split(' times')[1];
          let title = titleParts.join(' ').split('M ')[1];
          
          let startTime = times.split('(')[1].split(' - ')[0].replace('AM', '').replace('PM', '').trim();
          let endTime = times.split(' - ')[1].split(')')[0].replace('AM', '').replace('PM', '').trim();
          let startAmPm = times.split('(')[1].split(' - ')[0].includes('AM') ? 'AM' : 'PM';
          let endAmPm = times.split(' - ')[1].split(')')[0].includes('AM') ? 'AM' : 'PM'
          // Convert to 24 hour format
          let [startHour, startMinute] = startTime.split(':');
          let [endHour, endMinute] = endTime.split(':');
          if (startAmPm === 'PM' && startHour !== '12') startHour = parseInt(startHour) + 12;
          if (endAmPm === 'PM' && endHour !== '12') endHour = parseInt(endHour) + 12;
          if (startAmPm === 'AM' && startHour === '12') startHour = '00';
          if (endAmPm === 'AM' && endHour === '12') endHour = '00';
          let startDate = new Date(year, month, date, startHour, startMinute);
          let endDate = new Date(year, month, date, endHour, endMinute);

          events.push({
              'summary': title,
              'start': {
                  'dateTime': startDate.toISOString(),
                  'timeZone': 'America/Los_Angeles'
              },
              'end': {
                  'dateTime': endDate.toISOString(),
                  'timeZone': 'America/Los_Angeles'
              }
          });
      });

      return events;
  }


function convertToICS(events) {
  let timestamp = new Date().toISOString();
  let uid = 0;
  let icsEvents = events.map(event => {
    uid = uid + 1;
    return 'BEGIN:VEVENT\r\n' +
      'DTSTART:' + event.start.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
      'DTEND:' + event.end.dateTime.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
      'SUMMARY:' + event.summary + '\r\n' + 
      'DTSTAMP:' + timestamp.replace(/[-:]|\.\d{3}/g, '') + '\r\n' +
      'UID:' + 'nice' + uid + '\r\n' +
      'END:VEVENT';
    }).join('\r\n');

    return 'BEGIN:VCALENDAR\r\n' +
    'VERSION:2.0\r\n' +
    'PRODID:-//Shopify//Event scraper//EN\r\n' +
    icsEvents + '\r\n' +
    'END:VCALENDAR';
}

    let events = extractActivities();
    setInterval(() => {
      events = extractActivities();
      let ics = convertToICS(events);
      let blob = new Blob([ics], {type: "text/calendar;charset=utf-8"});
      let url = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.download = 'events.ics';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600000); // Time in ms to wait before running again. Change this to check schedule more or less often! 
})();