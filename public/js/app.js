(function() {

  //save search address in local storage
  var pastSearches = [];
  localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  if(pastSearches.indexOf(localStorage.address)== -1){
    pastSearches.unshift(localStorage.address);
    if(pastSearches.length > 3)
      pastSearches.pop();

    localStorage.pastSearches = JSON.stringify(pastSearches);
  }

  var navbarSearch = document.getElementById("navbar-search");
  navbarSearch.addEventListener("focus", focusSearch, true);
  navbarSearch.addEventListener("blur", rmFormatSearch, true);

  function focusSearch() {
    document.getElementById("navbar-search").style.borderBottom = "white solid 1px";
    document.getElementById("navbar-btn").style.visibility = "visible";
  }

  function rmFormatSearch() {
    document.getElementById("navbar-btn").style.visibility = "hidden";
    document.getElementById("navbar-search").style.borderBottom = "";
  }

})();
