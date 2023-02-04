


const $comments = document.querySelectorAll(".comment div");
const $buttons = document.querySelectorAll(".button-80");
const $question = document.getElementById("question");
let ansIndex = 1;

let currentQuestionNum  = 0;



async function fetchItemData(){
    const res = await fetch("http://127.0.0.1:8000/quiz_data");
    const data = await res.json();
    console.log(data);
    return data;
};


async function setItemData(){
    currentQuestionNum++;

    const data = await fetchItemData();
    ansIndex = data.correct_ans_index;

    for(let i=0; i < $comments.length; i++){
        $comments[i].textContent = data.items[ansIndex].reviews[i];
    }


    $question.textContent = "問題"+currentQuestionNum + "このレビューはどの商品のレビューでしょうか？";
}




setItemData();





for(let bntIndex=0; bntIndex < $buttons.length; bntIndex++){
    $buttons[bntIndex].addEventListener('click',(e) => {
        if(bntIndex === ansIndex){
            window.alert("正解");
            setItemData();
        }else{
            window.alert("不正解！　正解は" + $buttons[ansIndex].textContent);
        }
    })
}


