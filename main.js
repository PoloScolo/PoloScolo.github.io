var goodAnswersindexes= [];
var answerButtons = document.getElementsByClassName('answerButton');
var score = 0;
var names= [];
  var capitales = [];
  var flags = [];

window.onload = function() {

  $('#QuizCarousel').carousel({
    interval: false,
    wrap: false });

  var startButton = document.getElementById("start");
  var prevButton = document.getElementById("prev");
  var nextButton = document.getElementById("next");
  var carousel = document.getElementById("QuizCarousel");
  

  
  var countryIndexes = [...Array(250).keys()];
  var excludecountryIndexes = [];
  
 

  //---------------Fetching Data of 10 random countries------------------------
  for (let i = 0; i < 10; i++) {

    fetch('https://restcountries.eu/rest/v2/all')
    .then((resp) => resp.json())
    .then(function(data) {

        var randNb = randomNumber(countryIndexes,excludecountryIndexes);
        names.push(data[randNb].name);
        capitales.push(data[randNb].capital);
        flags.push(data[randNb].alpha2Code);

      })
      .catch(function(error) {
        console.log("error on fetching data");
      });}

      /*console.log(names);
      console.log(capitales);
      console.log(flags);*/


  //-------------------construction of the quiz carousel---------------------------
  startButton.onclick = function() {

    console.log("creation du carousel");
    startButton.style.display ="none";

    for (let i = 0; i < flags.length; i++)  {

      var slide = document.createElement("div");
      slide.setAttribute("class","carousel-item");
      if (i==0){
        slide.classList.add("active"); 
      }
      slide.id ="slide"+i;

      var card = document.createElement("div");
      card.classList.add("card","d-block","w-75","h-100","mx-auto","bg-dark");
      slide.appendChild(card);

      var flag = document.createElement("img");
      flag.classList.add("card-img-top","h-75");
      flag.setAttribute("src","images/flags/"+flags[i]+".svg");
      card.appendChild(flag);

      var cardBody = document.createElement("div");
      cardBody.setAttribute("class","card-body","bg-dark");
      card.appendChild(cardBody);

      var answerGrid = document.createElement("div");
      answerGrid.classList.add("container","text-center");
      var row = document.createElement("div");
      row.classList.add("row","g-3","text-light");
      answerGrid.appendChild(row);

      var answerIndex = [...Array(flags.length).keys()];
      var excludeAnswerIndexes = [];
      excludeAnswerIndexes.push(i);
      var correctAnswerIndex = Math.floor((Math.random() * 4) );

      for (let j=0 ; j<4; j++) {

        var col = document.createElement("div");
        col.classList.add("col-6");
        
        var answer = document.createElement("button");
        answer.classList.add("btn","btn-outline-light","w-100", "answerButton");
        answer.setAttribute("onclick","checkAnswer("+i+","+j+")");
        randNb = randomNumber(answerIndex,excludeAnswerIndexes);

        if(j===correctAnswerIndex){
          answer.innerText = names[i];
          goodAnswersindexes.push(j);
        }
        else{
          answer.innerText = names[randNb];
        }
        col.appendChild(answer);
        row.appendChild(col);
      }
      cardBody.appendChild(answerGrid);
      carousel.appendChild(slide);
    }

    var scoreSlide = document.createElement("div");
    scoreSlide.setAttribute("class","carousel-item");
    scoreSlide.innerHTML ="<h1 class='text-light' id='score'></h1>";
    carousel.appendChild(scoreSlide);
  }

  prevButton.onclick = function(){
    $("#QuizCarousel").carousel('prev')
  }  
  nextButton.onclick = function(){
    $("#QuizCarousel").carousel('next')
  }

}

function randomNumber(indexes,excludeIndexes){

  var randNb = null
  while(randNb===null || excludeIndexes.includes(randNb)){
    randNb = Math.round(Math.random()*(indexes.length-1))
  }
  excludeIndexes.push(randNb);
  return randNb
}

function carouselNext(time){
  setTimeout(() => {$("#QuizCarousel").carousel("next")}, time);
}

function checkAnswer(QuestionIndex,AnswerIndex){

  if(AnswerIndex==goodAnswersindexes[QuestionIndex]){
    console.log("bonne rep");
    answerButtons[QuestionIndex*4+AnswerIndex].style.backgroundColor="green";
    score ++;
    
  }else {
    
    answerButtons[QuestionIndex*4+AnswerIndex].style.backgroundColor="red";
    answerButtons[QuestionIndex*4+goodAnswersindexes[QuestionIndex]].style.backgroundColor="green";
    carouselNext(2000);
    }
    for (i = QuestionIndex*4 ; i < QuestionIndex*4+4 ; i++){
      answerButtons[i].disabled =true;
    }
    carouselNext(2000);
    document.getElementById('score').innerHTML = "Votre score : "+score + "/"+flags.length;
}
