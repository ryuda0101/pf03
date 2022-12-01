const name_check = document.querySelector(".reservation .center .line #name");
const name_result = document.querySelector(".reservation .center .line .name_show");
let name_last_check;

const birth_check = document.querySelector(".reservation .center .line #birth");
const birth_result = document.querySelector(".reservation .center .line .birth_show");
let birth_last_check;

const phone_check = document.querySelector(".reservation .center .line #phone");
const phone_result = document.querySelector(".reservation .center .line .phone_show");
let phone_last_check;

const symptom_check = document.querySelector(".reservation .center .line #symptom");
let symptom_last_check;

const info_check = document.querySelector(".reservation .center .line #check_info_btn");
let info_last_check;

const send_btn = document.querySelector(".reservation .center .line button")

name_check.addEventListener("keyup", () => {
    let name_value = name_check.value;
    let name_test = /^[ㄱ-힣]{2,6}$/
    let final_check = name_test.test(name_value);

    if(final_check){
        name_result.innerHTML = "이름을 형식에 맞게 입력하셨습니다."
        name_last_check = true;
    }
    else {
        name_result.innerHTML = "이름을 다시한번 확인해 주세요."
        name_last_check = false;
    }
});

birth_check.addEventListener("keyup", () => {
    let birth_value = birth_check.value;
    let birth_test = /^\d{8}$/
    let final_check = birth_test.test(birth_value);

    if(final_check){
        birth_result.innerHTML = "생년월일을 형식에 맞게 입력하셨습니다."
        birth_last_check = true;
    }
    else {
        birth_result.innerHTML = "생년월일은 8글자의 숫자로만 적어주세요."
        birth_last_check = false;
    }
});

phone_check.addEventListener("keyup", () => {
    let phone_value = phone_check.value;
    let phone_test = /^\d{11}$/
    let final_check = phone_test.test(phone_value);

    if(final_check){
        phone_result.innerHTML = "전화번호를 형식에 맞게 입력하셨습니다."
        phone_last_check = true;
    }
    else {
        phone_result.innerHTML = "전화번호는 특수문자를 제외한 11글자의 숫자로만 적어주세요."
        phone_last_check = false;
    }
});

info_check.addEventListener("click",() => {
    info_last_check = info_check.checked;
});

symptom_check.addEventListener("keyup",() => {
    if(symptom_check.value.length > 1) {
        symptom_last_check = true;
    }
    else {
        symptom_last_check = false;
    }
});
 

send_btn.addEventListener("click", (event) => {
    console.log(name_last_check);
    console.log(birth_last_check);
    console.log(phone_last_check);
    console.log(info_last_check);
    console.log(symptom_last_check);
    
    if(name_last_check && birth_last_check && phone_last_check && info_last_check && symptom_last_check) {
        let final_confirm = confirm("상담을 예약하시겠습니까?");
        if (!final_confirm) {
            event.preventDefault();
        }
        else {
            alert("상담 예약 감사합니다. 곧 연락드리겠습니다.");
        }
    }
    else {
        event.preventDefault();
        alert("예약 내용을 올바르게 전부 기입했는지 다시한번 확인해 주세요.");
    }
})