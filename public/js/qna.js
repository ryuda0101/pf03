let question = document.querySelectorAll(".qna_wrap .qna_brd_wrap .line .top_line p");
let answer = document.querySelectorAll(".qna_wrap .qna_brd_wrap .line .answer");

question.forEach((q_item,index) => {
    q_item.addEventListener("click",() => {
        answer[index].classList.add("on");
    });
});