let currentLocation = window.location.pathname;
const gnbMenus = document.querySelectorAll("header .gnb li");

gnbMenus.forEach((item,index) => {
    let gnbLocation = item.querySelector("a").getAttribute("href");
    if(currentLocation == gnbLocation){
        item.classList.add("on");
    }
});

