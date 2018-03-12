//check if previous search value in local storage
//if yes then load data for that location else show index page

(function() {
  const ls = localStorage.getItem('address');

  if(ls){
    const ls_obj = JSON.parse(ls);

    window.location=`/forecast/${ls_obj.lat},${ls_obj.lng}/${ls_obj.address_title}`;
  }

})();
