

const $lanes = document.querySelectorAll(".comment div");
const $buttons = document.querySelectorAll(".button-80");
const $question = document.getElementById("question");
const $itemImages = document.querySelectorAll(".image");
const $itemNames = document.querySelectorAll(".name");
const $time = document.getElementById("time");
const $correctAnsNum = document.getElementById("correct-count");

let ansIndex = 0;//正解番号

let itemData;//商品データ

let currentQuestionNum  = 0;//現在の問題番号

let isStoppingComment = false;//コメントが止まっているかどうか

let passedTime = 0;//経過時間

let correctAnsNum = 0;//合計正解数

let commentSpeed = -5;//コメントスピード

let defaultPostion = 2000;//コメントのデフォルトポジション

const correctAudio = new Audio("templates/static/correct.mp3");

const inCorrectAudio = new Audio("templates/static/incorrect.mp3");






function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




function setCommentOnLane(lane) {
    reviewList = itemData.items[ansIndex].reviews;
    lane.textContent = reviewList[getRandomInt(0,reviewList.length - 1)];
}



async function fetchItemData() {
    const res = await fetch("http://127.0.0.1:8000/quiz_data");
    itemData = await res.json();
};





function setItemImageAndName() {
    $itemImages.forEach((image,index) => {
        image.src = itemData.items[index].image_path;
    });

    $itemNames.forEach((name,index) => {
        name.textContent = itemData.items[index].name;
    });
}




function setCorrectAnsNum(){
    $correctAnsNum.textContent = `正解問題数 ${correctAnsNum}`;
}



function setTime(){
    $time.textContent = `経過時間 ${passedTime}s`;
}




function countPassedTime () {
    setInterval(function() {
        if(isStoppingComment)return;
        setTime();
        passedTime++;
      }, 1000);
}






async function setItemData() {
    currentQuestionNum++;

    await fetchItemData();

    setItemImageAndName();

    ansIndex = itemData.correct_ans_index;


    for(let i=0; i < $lanes.length; i++){
        //$lanes[i].textContent = itemData.items[ansIndex].reviews[i];
        setCommentOnLane($lanes[i]);
    }

    $question.textContent = `問題${currentQuestionNum}  流れているレビューはどの商品のレビューでしょうか？`;
}




function runComment() {
    $lanes.forEach((lane, index) => {
        let position = defaultPostion;

        function moveComment() {
          position += commentSpeed;
          lane.style.transform = `translateX(${position}px)`;
          requestAnimationFrame(moveComment);
          if(position + lane.offsetWidth < -100){
            position = defaultPostion;
            setCommentOnLane(lane);
          }

          if(isStoppingComment){
            commentSpeed = 0;
            position = defaultPostion;
          }
        }
        moveComment();
      });
}


function endGame(){
    url = `http://127.0.0.1:8000/result?time=${passedTime}&correctNum=${correctAnsNum}`
    window.location.replace(url);
}



function showDialog(id) {
    document.getElementById(id).style.display = "block";
    setTimeout(async function(){

        if(currentQuestionNum === 5){
            id === "correct" 
            ? window.alert("正解！ゲームを終了します。") 
            : window.alert(`残念！正解は${itemData.items[ansIndex].name}！ ゲームを終了します。`)
            endGame();
            return;
        }
        id === "correct" 
        ? window.alert("正解！次に進みます") 
        : window.alert(`残念！正解は${itemData.items[ansIndex].name}！ 次に進みます`)
        document.getElementById(id).style.display = "none";
        await setItemData();
        isStoppingComment = false;
        commentSpeed = -5;
    },1000);
}







setItemData();

setCorrectAnsNum();

setTime();


runComment();


countPassedTime();



for(let bntIndex=0; bntIndex < $buttons.length; bntIndex++) {

    $buttons[bntIndex].addEventListener('click',(e) => {
        if(isStoppingComment)return;
        isStoppingComment = true;
        if(bntIndex === ansIndex){
            correctAnsNum++;
            setCorrectAnsNum();
            correctAudio.play();
            showDialog("correct");
        }else{
            inCorrectAudio.play();
            showDialog("incorrect");
        }
    })
}

