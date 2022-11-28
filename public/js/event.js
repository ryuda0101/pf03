let show = document.querySelector(".event_wrap .box_show");
let boxes = show.querySelectorAll(".boxs .box").length;
let more_btn = document.querySelector(".event_wrap .more_btn");

//줄 갯수가 상품 갯수에 맞춰서 변경되게 처리
let deskTopMax = Math.ceil(boxes / 3);
let tabletMax = Math.ceil(boxes / 2);

//화면에 따른 카운트 숫자
let dummyCount = {
    deskTopCount:1,
    tabletCount:1
}

//반응형 화면사이즈 체크 중복 구문 정리
let deskTopCheck = window.matchMedia("screen and (max-width:1920px) and (min-width:1461px)");
let tabletCheck = window.matchMedia("screen and (max-width:1460px) and (min-width:980px)");

//리사이즈,로드이벤트 세팅 //제이쿼리는 가능 $(window).on("resize,load"()=>{})
window.addEventListener("resize",()=>{
    // more_btn.style.display = "block";
    if(deskTopCheck.matches){
        setHeight(dummyCount.deskTopCount);
    }
    else if(tabletCheck.matches){
        setHeight(dummyCount.tabletCount);
    }
});

window.addEventListener("load",()=>{
    // more_btn.style.display = "block";
    if(deskTopCheck.matches){
        setHeight(dummyCount.deskTopCount);
    }
    else if(tabletCheck.matches){
        setHeight(dummyCount.tabletCount);
    }
});



//show 높이값 변경 -> dummyCount안에 있는 프로퍼티 숫자값에 따른 높이값 변경
function setHeight(count){
    show.style.height = (644 * count) + "px";
}

if(deskTopCheck.matches) {
    more_btn.addEventListener("click", (event) => {
        event.preventDefault();
        dummyCount.deskTopCount += 1;
        setHeight(dummyCount.deskTopCount);
        if (dummyCount.deskTopCount == deskTopMax) {
            more_btn.style.display = "none";
        }
    });
}
else if(tabletCheck.matches) {
    more_btn.addEventListener("click", (event) => {
        event.preventDefault();
        dummyCount.tabletCount += 1;
        setHeight(dummyCount.tabletCount);
        if (dummyCount.tabletCount == tabletMax) {
            more_btn.style.display = "none";
        }
    });
}