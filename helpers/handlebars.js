module.exports = {
  section: function(name, options) {
    if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
   },
  toCelcius: temp => {
    return Math.round(((temp-32)*5)/9);
  },
  toTime: timestamp => {
    const date = new Date(timestamp*1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  },
  toPercent: num => Math.round(num*100),
  toHour: timestamp => {
    const date = new Date(timestamp*1000);
    return date.toLocaleString('en-GB', { hour: 'numeric', hour12: true });
  },
  toDay: timestamp => {
    const date = new Date(timestamp*1000);
    const weekday = new Array(7);
    weekday[0] =  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    if(date.getDay() == new Date().getDay())
      return "Today";
    else {
      return weekday[date.getDay()];
    }
  }
}
