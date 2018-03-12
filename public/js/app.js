(function() {

  //If previous searches exist then create search dropdown menu
  //else add the current search to localStorage
  if(localStorage.pastSearches){

    let pastSearches = JSON.parse(localStorage.pastSearches)

    if(pastSearches.indexOf(localStorage.address)== -1){
      pastSearches.unshift(localStorage.address);
      if(pastSearches.length > 4)
        pastSearches.pop();

      localStorage.pastSearches = JSON.stringify(pastSearches);
    }
    if(pastSearches.length>1){
      populatePastSearchesMenu();

      //prevent the menu from toggling when the user clicks on delete
      //TODO should close when user clicks on address.
      const pastSearchesList = document.getElementById("search-menu");
      pastSearchesList.addEventListener('mousedown', function (ev) {
        if (ev.target.tagName === 'A') {
          searchInput.value = ev.target.textContent;
          searchInput.style.borderBottom = "";
        }
      });

      pastSearchesList.addEventListener('click', function (ev) {
        ev.stopPropagation();
      })
    }

  }else{
      var pastSearches = [];
      pastSearches.unshift(localStorage.address);
      localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  }




  const searchInput = document.getElementById("navbar-search");
  const searchBtn = document.getElementById("navbar-btn");

  let searchReq_submitted = true;

  //Set input box to empty if input clicked after a search
  searchInput.addEventListener("click", function() {
    if(searchReq_submitted){
        this.value = "";
        searchInput.style.borderBottom = "1.5px red solid";
    }
  }, true);
  searchInput.addEventListener("input", function(){
    searchReq_submitted = false;
  }, true)


  searchBtn.addEventListener("click", function() {
      searchReq_submitted = true;
      searchInput.style.borderBottom = "";
    }, true);




  //If input is left blank on click outside search bar, set input value to current search
  searchInput.addEventListener("blur", function() {
    if(!searchInput.value){
      var currentSearch = JSON.parse(localStorage.address);
      this.value = currentSearch.address_title;
      searchInput.style.borderBottom = "";
    }
  }, false);

  // Click on picture to display background image
  document.getElementById('img-btn').addEventListener("click", function(){
    togglediv('landing-wrapper','img-location');
  });


  //Scroll to warning details
  document.getElementById('warning-details').addEventListener("click", function(){
    var warnings = document.getElementsByClassName('warning-container');
    zenscroll.intoView(warnings);
  });

  //Back to top link click
  document.getElementById('toTop').addEventListener("click", function(){
    zenscroll.toY(0);
  });


  function togglediv(a,b) {
    for(let i =0; i<arguments.length; i++){
      let div = document.getElementById(arguments[i]);
        div.style.display = div.style.display == "none" ? "block" : "none";
    }
  }

  // Click on a close button to remove the location from pastSearches
  const close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      let div = this.parentElement;

      //remove dividers
      if(div.nextElementSibling){
        div.nextElementSibling.parentNode.removeChild(div.nextElementSibling);
      }
      else if (div.previousSibling) {
        div.previousSibling.parentNode.removeChild(div.previousSibling);
      }

      //remove the address
      let deletedLocation = div.childNodes[0].textContent;
      removeFromLocalStorage(deletedLocation);
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
        link.href = `https://redcloudweather.herokuapp.com/${address.lat},${address.lng}/${address.address_title}`;
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

  }

  function removeFromLocalStorage(location){
    pastSearches = JSON.parse(localStorage.pastSearches);
    let locationArr = [];

    pastSearches.forEach(function (element){
      let obj = JSON.parse(element)
      locationArr.push(obj.address_title);
    });

    const index = locationArr.indexOf(location);
    pastSearches.splice(index,1);

    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  }

})();
