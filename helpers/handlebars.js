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
    const t = new Date(time);
    const h = t.getHours();
    const m = t.getMinutes();
    return `${h}:${m}`;
  }
}
