//This is the code for the interactive accordion element.

/*
Tutorial/reference used: 
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_accordion
*/

document.addEventListener('DOMContentLoaded', function() {
    
    "use strict";

    console.log('JS is running!')

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling; 

            //the === in a JS for loop means "strict equality" - two values must be exactly the same AND same type
            if (panel.style.display === "block") {
                panel.style.display = "none";
                console.log('opened!')
            } else {
                panel.style.display = "block";
                console.log('closed!')
            }
        });
    }

});