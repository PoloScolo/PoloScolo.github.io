//=============== Contain 3 functions : fetchCountryData(), createCarouselQuiz(), checkAnswer() and carouselNext() =================//

//-----------Fecthing the Data from the API---------------//
async function fetchCountryData(nbOfQuestion,Region,QuizType){

    menu.style.display="none";
    QuizMap.innerHTML="";
    loading.style.display="block";
    console.log("fetching "+nbOfQuestion+" "+ QuizType+" from "+ Region +" continent");
  
    //Reset of all variables
    names = [];
    flags = []; 
    capitales = [];
    countryIndexes = [];
    excludecountryIndexes = [];
    goodAnswersindexes = [];
    
    nbofquestion = nbOfQuestion;
    region = Region;
    quizType = QuizType;
    
    //Definition of the range of available indexes depending number of country in the chosen region
    switch(Region) {
      case "All": countryIndexes = [...Array(250).keys()]; break;
      case "Africa": countryIndexes = [...Array(60).keys()];break;
      case "Americas":countryIndexes = [...Array(57).keys()];break;
      case "Asia":countryIndexes = [...Array(50).keys()];break;
      case "Europe":countryIndexes = [...Array(53).keys()];break;
      case "Oceania":countryIndexes = [...Array(27).keys()];break;
      default: console.log("continent non valide");
    }

    //definition of the fetching URL
    if (Region=="All"){URL = 'https://restcountries.eu/rest/v2/all'}
    else {URL = 'https://restcountries.eu/rest/v2/region/'+Region;}
    
    //fetching  data
    await fetch(URL)
    .then((resp) => resp.json())
    .then(function(data) {
  
      if(QuizType=="flag"){
        for (let i = 0; i < nbOfQuestion ; i++) {
          var randNb = randomNumber(countryIndexes,excludecountryIndexes);
          names.push(data[randNb].name);
          flags.push(data[randNb].alpha2Code);
        }
  
      }else if(QuizType=="capital"){
        for (let i = 0; i < nbOfQuestion ; i++) {
          var randNb = randomNumber(countryIndexes,excludecountryIndexes);
          names.push(data[randNb].name);
          capitales.push(data[randNb].capital);
        }
      }
      else if(QuizType=="map"){
        for (let i = 0; i < nbOfQuestion ; i++) {
          var randNb = randomNumber(countryIndexes,excludecountryIndexes);
          names.push(data[randNb].name);
        }
      }
      // fecthing more country name so the possible answer are not only the good answers
      for (let i = 0; i < countryIndexes.length - nbOfQuestion ; i++) {
        var randNb = randomNumber(countryIndexes,excludecountryIndexes);
        names.push(data[randNb].name);
      }
      console.log(names);
    })
    .catch(function(error) {
        console.log("error on fetching data");
    });

    //emptying the carousel
    carousel.innerHTML="";
    carousel.style.display="none";
  
    //call of the quizz creation function
    createCarouselQuiz(QuizType,nbOfQuestion);
    
}

//----------------------Creating the Carousel-------------------------//
function createCarouselQuiz(QuizType,nbOfQuestion){

        console.log("creation of the "+QuizType+" Carousel");
        counterValue = 1;
        score = 0;
    
        var counter = document.createElement("h2");
        counter.id="counter";
        counter.innerText = counterValue+"/"+nbOfQuestion;
        carousel.appendChild(counter);
    
        for (let i = 0; i < nbOfQuestion; i++)  {
    
          var slide = document.createElement("div");
          slide.classList.add("carousel-item");
          if (i==0){
            slide.classList.add("active"); 
          }
          slide.id ="slide"+i;
    
          var card = document.createElement("div");
          card.classList.add("card");
          slide.appendChild(card);
    
          if(quizType=="flag"){
            var flag = document.createElement("img");
            flag.classList.add("card-img-top");
            flag.setAttribute("src","images/flags/"+flags[i]+".svg");
            card.appendChild(flag);
          }
    
          if(quizType=="capital"){
            var capital = document.createElement("h1");
            capital.classList.add("card-title");
            capital.innerText = capitales[i];
            card.appendChild(capital);
          }
    
          var cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          card.appendChild(cardBody);
    
          var answerGrid = document.createElement("div");
          answerGrid.classList.add("answer-grid");

          var row = document.createElement("div");
          row.classList.add("row","g-3");
          answerGrid.appendChild(row);
    
          var answerIndex = [...Array(names.length).keys()];
          var excludeAnswerIndexes = [];
          excludeAnswerIndexes.push(i);
          var correctAnswerIndex = Math.floor((Math.random() * 4) );
    
          for (let j=0 ; j<4; j++) {
    
            var col = document.createElement("div");
            col.classList.add("col-6");
            
            var answer = document.createElement("button");
            answer.classList.add("btn","btn-outline-light","answer-button");
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
        scoreSlide.classList.add("carousel-item");
    
        var scoreDiv = document.createElement("div");
        scoreDiv.classList.add("carousel-score");
    
        var scoreText = document.createElement("p");
        scoreText.classList.add("text-center","text-light");
        scoreText.id = "score";
        scoreDiv.appendChild(scoreText);
    
        var restartWithSameDataButton = document.createElement("button");
        restartWithSameDataButton.classList.add("btn","btn-light","menu-button");
        restartWithSameDataButton.innerHTML = "↺ same "+quizType+"s";
        scoreDiv.appendChild(restartWithSameDataButton);
    
        restartWithSameDataButton.onclick = function() {
          carousel.innerHTML="";
          goodAnswersindexes=[];
          loading.style.display="block";
          createCarouselQuiz(QuizType,nbOfQuestion);
        }
    
        var restartWithDifferentDataButton = document.createElement("button");
        restartWithDifferentDataButton.classList.add("btn","btn-light","menu-button");
        restartWithDifferentDataButton.innerText = "↺ new "+QuizType+"s";
        scoreDiv.appendChild(restartWithDifferentDataButton);
    
        restartWithDifferentDataButton.onclick= function (){
          score = 0;
          loading.style.display="block";
          fetchCountryData(nbOfQuestion,region,QuizType);
        }
    
        var backToMenuButton = document.createElement("button");
        backToMenuButton.classList.add("btn","btn-light","menu-button");
        backToMenuButton.innerText = "Menu";
        scoreDiv.appendChild(backToMenuButton);
    
        backToMenuButton.onclick= function (){
          flags=[];
          names=[];
          goodAnswersindexes=[];
          carousel.innerHTML="";
          menu.style.display="block";
        }

        scoreSlide.appendChild(scoreDiv);
        carousel.appendChild(scoreSlide);
    
        loading.style.display="none";
        carousel.style.display="block";
}

//---------------Checking if the answer is correct or not--------------//
function checkAnswer(QuestionIndex,AnswerIndex){

  console.log("checking the answer");

        var answerButtons = document.getElementsByClassName('answer-button');
      
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
          carouselNext(1500);
          document.getElementById('score').innerHTML = "Score : "+score + "/"+nbofquestion;
}

//---------------Function for sliding and couting the slide position of the carousel-----------------//
function carouselNext(time){

        var counter=document.getElementById("counter");
        counter.innerText = counterValue+"/"+nbofquestion;
        setTimeout(() => {
          $("#QuizCarousel").carousel("next");
          counterValue++;
          if (counterValue > nbofquestion){
            counter.style.display="none";
          }
          counter.innerText = counterValue+"/"+nbofquestion;}, time);
}