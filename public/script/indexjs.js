
var modal = document.getElementById("myModal");

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal){
    modal.style.display = "none";   
    }
}

document.querySelector('#menu-bar').onclick = () => {   
    document.querySelector('#menu-bar').classList.toggle('fa-times');
    document.querySelector('.navbar').classList.toggle('active');
}


window.onscroll = function() {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}