//check if previous search value in local storage
//if yes then load data for that location else show index page

(function() {
  const ls = localStorage.getItem('address');

  if(ls){
    const ls_obj = JSON.parse(ls);
    //let str = Object.entries(ls_obj).map(([key, val]) => `${key}=${val}`).join('&');
    window.location=`/weather/${ls_obj.lat},${ls_obj.lng}/${ls_obj.address_title}`;
  }

})();
