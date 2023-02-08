

const $resultRank = document.getElementById("result-rank");
const $resultScore = document.getElementById("result-score");

const rankColor = 
{
    "Rank S":"blueviolet",
    "Rank A":"red",
    "Rank B":"orange",
    "Rank C":"greenyellow",
    "Rank D":"cyan"
}


$resultRank.style.color = rankColor[$resultRank.textContent];
$resultScore.style.color = rankColor[$resultRank.textContent];



