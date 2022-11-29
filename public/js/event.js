// 메인페이지에서 보여줄 화면
let show = document.querySelector(".event_wrap .box_show");
// 전체 이벤트 박스 개수
let boxes = show.querySelectorAll(".boxs .box").length;
// 더보기 버튼
let more_btn = document.querySelector(".event_wrap .more_btn");

// 줄 갯수가 상품 갯수에 맞춰서 변경되게 처리
let deskTopMax = Math.ceil(boxes / 3);
let tabletMax = Math.ceil(boxes / 2);
let mobileMax = boxes / 1;

// 화면 크기에 따른 카운트 숫자
let dummyCount = {
    deskTopCount:1,
    tabletCount:1,
    mobileCount:1
}

// 반응형 화면사이즈 체크 중복 구문 정리
let deskTopCheck = window.matchMedia("screen and (max-width:1920px) and (min-width:1461px)");
let tabletCheck = window.matchMedia("screen and (max-width:1460px) and (min-width:980px)");
let mobileCheck = window.matchMedia("screen and (max-width:979px) and (min-width:100px)");

//리사이즈,로드이벤트 세팅 //제이쿼리는 가능 $(window).on("resize,load"()=>{})
window.addEventListener("resize",()=>{webSizeCheck()});

window.addEventListener("load",()=>{webSizeCheck()});


//show 높이값 변경 -> dummyCount안에 있는 프로퍼티 숫자값에 따른 높이값 변경
function setHeight(count){
    show.style.height = (644 * count) + "px";
}

//카운트 된 숫자값 체크 (데스크탑 / 테블릿 각각 따로)
function deskTopSizeCheck(){
    // 조건문으로 현재 등장한 이벤트 박스 갯수와 존재하는 전체 이벤트 박스 갯수 비교
    if (dummyCount.deskTopCount == deskTopMax) {
        // 이벤트 박스가 전체 등장했다면 더보기 버튼 사라지게 처리
        more_btn.style.display = "none";
    }
    // 등장 이벤트 박스에 따라 높이값 조절
    setHeight(dummyCount.deskTopCount); 
}
function tabletSizeCheck(){
    if (dummyCount.tabletCount == tabletMax) {
        more_btn.style.display = "none";
    }
    setHeight(dummyCount.tabletCount); 
}
function mobileSizeCheck(){
    if (dummyCount.mobileCount == mobileMax) {
        more_btn.style.display = "none";
    }
    setHeight(dummyCount.mobileCount);
}


// 리사이즈 이벤트 / 로드이벤트에 중복되는 조건문 리팩토링
function webSizeCheck(){
    // 일단 창 사이즈가 바뀌면, 화면이 로드가 되면 더보기 버튼은 보이게 처리
    more_btn.style.display = "block";
    // 이후 보고있는 화면 사이즈 체크해서   →   등장한 이벤트 박스 갯수와 존재하는 전체 이벤트 박스 갯수 비교   →   이벤트 박스가 전체 등장했다면 더보기 버튼 사라지게 처리
    if(deskTopCheck.matches){
        deskTopSizeCheck();
    }
    else if(tabletCheck.matches){
        tabletSizeCheck();
    }
    else if(mobileCheck.matches){
        mobileSizeCheck();
    }
}

// 더보기 클릭시 화면사이즈에 따라 카운트 숫자값 각각 다르게 올라가게 처리
more_btn.addEventListener("click", (event) => {
    event.preventDefault();

    if(deskTopCheck.matches) {
        dummyCount.deskTopCount += 1;
        deskTopSizeCheck();
    }
    else if(tabletCheck.matches) {
        dummyCount.tabletCount += 1;
        tabletSizeCheck();
    }
    else if(mobileCheck.matches){
        dummyCount.mobileCount += 1;
        mobileSizeCheck();
    }
});





