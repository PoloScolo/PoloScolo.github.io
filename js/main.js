//definition of the global variable
var goodAnswersindexes;
var countryIndexes;
var excludecountryIndexes;
var region;
var nbofquestion;
var quizType;
var names;
var capitales;
var flags ;
var status = 0;
var counterValue = 1;
var score;
var URL;
var menu = document.getElementById("menu");
var loading = document.getElementById("loading");
var carousel = document.getElementById("QuizCarousel");
var home = document.getElementById("home");
var githubLink = document.getElementById("githubLink");
var QuizMap = document.getElementById("QuizMap");

window.onload = function() {
  $('#QuizCarousel').carousel({
    interval: false,
    wrap: false });
}

//Creation of the brand hover effect
$(home).hover(function(){
  $(githubLink).css("left", "0px");
  $(githubLink).css("opacity", "1");
  }, function(){
  $(githubLink).css("left", "-100px");
  $(githubLink).css("opacity", "0");
});

//get a random number from an specific range 
function randomNumber(indexes,excludeIndexes){
  
  var randNb = null
  while(randNb===null || excludeIndexes.includes(randNb)){
    randNb = Math.round(Math.random()*(indexes.length-1))
  }
  excludeIndexes.push(randNb);
  return randNb
}




