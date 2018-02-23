(function() {

  document.getElementById("navbar-search").addEventListener("click", formatSearch);

  function formatSearch() {
    document.getElementById("navbar-search").style.borderBottom = "white solid 2px";
    console.log("I work");
}

})();
