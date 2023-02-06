

const $lanes = document.querySelectorAll(".comment div");
const $buttons = document.querySelectorAll(".button-80");
const $question = document.getElementById("question");
const $itemImages = document.querySelectorAll(".image");
const $itemNames = document.querySelectorAll(".name");
let ansIndex = 1;

let itemData;

let currentQuestionNum  = 0;

let stopComment = false;






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
    console.log(itemData);
    console.log("fetch完了");
};





function setItemImageAndName() {
    $itemImages.forEach((image,index) => {
        image.src = itemData.items[index].image_path;
    });

    $itemNames.forEach((name,index) => {
        name.textContent = itemData.items[index].name;
    });
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




let commentSpeed = -5;

let defaultPostion = 2000;

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

          if(stopComment){
            commentSpeed = 0;
            position = defaultPostion;
          }
        }

        moveComment();
      });
}



function showDialog(id) {
    document.getElementById(id).style.display = "block";
    setTimeout(async function(){
        id === "correct" ? window.alert("正解！次に進みます") : window.alert(`残念！正解は${itemData.items[ansIndex].name}！ 次に進みます`)
        document.getElementById(id).style.display = "none";
        await setItemData();
        stopComment = false;
        commentSpeed = -5;
    },1000);
}







setItemData();


runComment();



for(let bntIndex=0; bntIndex < $buttons.length; bntIndex++) {

    $buttons[bntIndex].addEventListener('click',(e) => {
        if(stopComment)return;
        stopComment = true;
        if(bntIndex === ansIndex){
            showDialog("correct");
        }else{
            showDialog("incorrect");
        }
    })
}