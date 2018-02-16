module.exports = {
  section: function(name, options) {
    if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  toCelcius: function(temp){
    return Math.round(((temp-32)*5)/9);
  },
  toTime: function(time){
    const date = new Date(time*1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  },
  toPercent: num=> num*100,
  toHour: time => {
    const date = new Date(time*1000);
    return date.toLocaleString('en-GB', { hour: 'numeric', hour12: true });
  },
  format: hour => `hourly.data.${hour}.time`
}
