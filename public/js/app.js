(function() {

  if(localStorage.pastSearches){
    console.log("I've got old searches");


    let pastSearches = JSON.parse(localStorage.pastSearches)

    if(pastSearches.indexOf(localStorage.address)== -1){
      pastSearches.unshift(localStorage.address);
      if(pastSearches.length > 4)
        pastSearches.pop();

      localStorage.pastSearches = JSON.stringify(pastSearches);
    }

    populatePastSearchesMenu();
  }else{
      var pastSearches = [];
      pastSearches.unshift(localStorage.address);
      localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  }


  //Remove current search value if input clicked and add back if click outside
  var searchInput = document.getElementById("navbar-search");
  searchInput.addEventListener("click", function() {
    this.value = "";
  }, true);
  searchInput.addEventListener("blur", function() {
    var currentSearch = JSON.parse(localStorage.address);
    this.value = currentSearch.address_title;
  }, true);


  // Click on picture to display background image
  document.getElementById('img-btn').addEventListener("click", function(){
    togglediv('landing-wrapper','img-location');
  });



  function togglediv(a,b) {
    for(let i =0; i<arguments.length; i++){
      var div = document.getElementById(arguments[i]);
        div.style.display = div.style.display == "none" ? "block" : "none";
    }
  }

  // Click on a close button to hide the current list item
  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;

      //remove dividers
      if(div.nextElementSibling){
        div.nextElementSibling.parentNode.removeChild(div.nextElementSibling);
      }
      else if (div.previousSibling) {
        div.previousSibling.parentNode.removeChild(div.previousSibling);
      }

      //remove the address
      div.parentNode.removeChild(div);

      //if no more addresses then remove the menu <ul>
      if(close.length == 0){
        var elem = document.getElementById("search-menu");
        elem.parentNode.removeChild(elem);
      }

    }
  }



  //dynamically add search locaiton from local storage to dropdown menu
  function populatePastSearchesMenu(){

    var pastSearches = JSON.parse(localStorage.pastSearches);
    var currentSearch = JSON.parse(localStorage.address);

    // var navbar = document.getElementById("navbar-search");
    // navbar.setAttribute("")

    //Create UL element and set id name
    var menu = document.createElement("UL");
    menu.setAttribute("id", "search-menu");
    menu.className = "dropdown-menu";

    document.getElementById("search-form").appendChild(menu);

    var options = document.getElementById("search-menu");
    var length = pastSearches.length;
    for (var i = 0; i < length; i++) {
      var address = JSON.parse(pastSearches[i])

      if(localStorage.address !== pastSearches[i]){
        var li = document.createElement("li");
        var link = document.createElement("a");
        var text = document.createTextNode(address.address_title);
        link.appendChild(text);
        link.href = `http://localhost:5000/forecast/${address.lat},${address.lng}/${address.address_title}`;
        li.appendChild(link);

        //add remove button
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);

        options.appendChild(li);

        if (i < length - 1) {
          var newDiv = document.createElement("div");
          newDiv.className = "dropdown-divider";
          options.appendChild(newDiv);
        }
      }

    }

    //prevent the menu from toggling when the user clicks on delete
    //TODO should close when user clicks on address.
    document.getElementById('search-menu').addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

})();
