var goodAnswersindexes= [];
var score = 0;
var names= [];
var capitales = [];
var flags = [];
var status = 0;
var counterValue = 1;
var region;


window.onload = function() {

  $('#QuizCarousel').carousel({
    interval: false,
    wrap: false });
  }

  var menu = document.getElementById("menu");

  /*StartFlagQuiz.onclick = function() {
    fetchFlagCountryData();
    menu.style.display="none";
  }*/

  

function showParameters(quizParametersDiv){

  quizParameters=document.getElementsByClassName('quizParameters');
  for(var i= 0;i<quizParameters.length;i++){
    quizParameters[i].style.display ="none";
  }
  quizParametersDiv.style.display ="block";
}

  
  
  /*var prevButton = document.getElementById("prev");
  var nextButton = document.getElementById("next");*/

 //--------------------------Fetch Data for flag->Country Quiz--------------------------//
async function fetchFlagCountryData(nbOfQuestion,Region){

  region=Region;

  switch(Region) {
    case "All":
      var countryIndexes = [...Array(250).keys()];
      break;
    case "Africa":
      var countryIndexes = [...Array(60).keys()];
      break;
    case "Americas":
      var countryIndexes = [...Array(57).keys()];
      break;
    case "Asia":
      var countryIndexes = [...Array(50).keys()];
    break;
    case "Europe":
      var countryIndexes = [...Array(53).keys()];
    break;
    case "Oceania":
      var countryIndexes = [...Array(27).keys()];
    break;
    default:
      console.log("continent non valide");
  }

  var excludecountryIndexes = [];

  console.log("fetching "+nbOfQuestion+" Flag->Country from "+ Region +" continent");

  if (Region=="All"){
    var URL = 'https://restcountries.eu/rest/v2/all';
  }else{
    URL = 'https://restcountries.eu/rest/v2/region/'+Region;
  }

  console.log(URL);

  await fetch(URL)
  .then((resp) => resp.json())
  .then(function(data) {

    //Storing flags and names of country
    for (let i = 0; i < nbOfQuestion ; i++) {

      var randNb = randomNumber(countryIndexes,excludecountryIndexes);
      names.push(data[randNb].name);
      flags.push(data[randNb].alpha2Code);
    
    }
    //storing 90 more coutry name to reach 100
    /*for (let i = 0; i < 90; i++) {

      var randNb = randomNumber(countryIndexes,excludecountryIndexes);
      names.push(data[randNb].name);

    }*/
    console.log(data.length);
  })
    .catch(function(error) {
      console.log("error on fetching data");
    });

    createFlagCountryQuiz();
    
  }

  //--------------------------Create Slides for flag->Country Quiz--------------------------//
  function createFlagCountryQuiz(){

    var menu = document.getElementById("menu");
    menu.style.display="none";

    console.log("creation of the Flag->Country Carousel");
    var carousel = document.getElementById("QuizCarousel");

    var counter = document.createElement("h1");
    
    counter.setAttribute("style","position: absolute ;top: 0%;right:2%;z-index:999;color:white");
    counter.id="counter";
    counter.innerText = counterValue+"/"+flags.length;
    carousel.appendChild(counter);

    for (let i = 0; i < flags.length; i++)  {

      var slide = document.createElement("div");
      slide.setAttribute("class","carousel-item");
      if (i==0){
        slide.classList.add("active"); 
      }
      slide.id ="slide"+i;

      var card = document.createElement("div");
      card.classList.add("card","d-block","w-75","h-100","mx-auto","bg-dark");
      card.setAttribute("style","border:none");
      slide.appendChild(card);

      var flag = document.createElement("img");
      flag.classList.add("card-img-top","h-50");
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

      var answerIndex = [...Array(names.length).keys()];
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

    var restartWithSameFlagsButton = document.createElement("button");
    restartWithSameFlagsButton.classList.add("btn","btn-success");
    restartWithSameFlagsButton.innerText = "Restart with same flags";
    scoreSlide.appendChild(restartWithSameFlagsButton);

    restartWithSameFlagsButton.onclick = function() {
      score=0;
      counterValue=1;
      goodAnswersindexes=[];
      carousel.innerHTML="";
      createFlagCountryQuiz();
    }

    var restartWithDifferentFlagsButton = document.createElement("button");
    restartWithDifferentFlagsButton.classList.add("btn","btn-success");
    restartWithDifferentFlagsButton.innerText = "Restart with new flags";
    scoreSlide.appendChild(restartWithDifferentFlagsButton);

    restartWithDifferentFlagsButton.onclick= function (){
      nbOfQuestion=flags.length;
      carousel.innerHTML="";
      flags=[];
      names=[];
      goodAnswersindexes=[];
      counterValue=1;
      score=0;
      fetchFlagCountryData(nbOfQuestion,region);
    }

    var backToMenuButton = document.createElement("button");
    backToMenuButton.classList.add("btn","btn-success");
    backToMenuButton.innerText = "Menu";
    scoreSlide.appendChild(backToMenuButton);

    backToMenuButton.onclick= function (){
      flags=[];
      names=[];
      goodAnswersindexes=[];
      score=0;
      carousel.innerHTML="";
      menu.style.display="block";
    }

    carousel.appendChild(scoreSlide);
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

  var counter=document.getElementById("counter");
  counter.innerText = counterValue+"/"+flags.length;
  setTimeout(() => {
    $("#QuizCarousel").carousel("next");
    counterValue++;
    if (counterValue > flags.length){
      counter.style.display="none";
    }
    counter.innerText = counterValue+"/"+flags.length;}, time);
  
}

function checkAnswer(QuestionIndex,AnswerIndex){

  var answerButtons = document.getElementsByClassName('answerButton');

  if(AnswerIndex==goodAnswersindexes[QuestionIndex]){
    answerButtons[QuestionIndex*4+AnswerIndex].style.backgroundColor="green";
    score ++;
    
  }else {
    
    answerButtons[QuestionIndex*4+AnswerIndex].style.backgroundColor="red";
    answerButtons[QuestionIndex*4+goodAnswersindexes[QuestionIndex]].style.backgroundColor="green";
    
    }
    for (i = QuestionIndex*4 ; i < QuestionIndex*4+4 ; i++){
      answerButtons[i].disabled =true;
    }
    carouselNext(2000);
    document.getElementById('score').innerHTML = "Votre score : "+score + "/"+flags.length;
}
