var names= [];
var capitales = [];
var flags = [];
var countryIndexes = [...Array(250).keys()];
var excludecountryIndexes = [];



window.onload = function() {

  $('#QuizCarousel').carousel({
    interval: false,
    wrap: false });

  var startButton = document.getElementById("start");
  var prevButton = document.getElementById("prev");
  var nextButton = document.getElementById("next");
  var carousel = document.getElementById("QuizCarousel");


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
      card.setAttribute("class","card");
      slide.appendChild(card);

      var flag = document.createElement("img");
      flag.setAttribute("class","card-img-top");
      flag.setAttribute("src","images/flags/"+flags[i]+".svg");
      card.appendChild(flag);

      var cardBody = document.createElement("div");
      cardBody.setAttribute("class","card-body","bg-dark");
      card.appendChild(cardBody);

      var countryName = document.createElement("h5");
      countryName.innerHTML= "<h5 class='card-title'>"+names[i]+"</h5>"
      cardBody.appendChild(countryName);

      var answerGrid = document.createElement("div");
      answerGrid.classList.add("container","text-center");
      var row = document.createElement("div");
      row.classList.add("row","g-3");
      answerGrid.appendChild(row);

      var answerIndex = [...Array(flags.length).keys()];
      var excludeAnswerIndexes = [];
      excludeAnswerIndexes.push(i);
      var correctAnswerIndex = Math.floor((Math.random() * 4) );

      for (let j=0 ; j<4; j++) {

        var col = document.createElement("div");
        col.classList.add("col-6");
        
        var answer = document.createElement("button");
        answer.classList.add("btn","btn-outline-dark","w-100");
        answer.id ="answer"+j;

        
        randNb = randomNumber(answerIndex,excludeAnswerIndexes);

        if(j===correctAnswerIndex){
          answer.innerText = capitales[i];
        }
        else{
          answer.innerText = capitales[randNb];
        }
        col.appendChild(answer);
        row.appendChild(col);
      }
      cardBody.appendChild(answerGrid);
      carousel.appendChild(slide);
    }

    var scoreSlide = document.createElement("div");
    scoreSlide.setAttribute("class","carousel-item");
    scoreSlide.innerText ="Score : ";

    
     
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



