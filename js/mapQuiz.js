var countries = document.getElementsByTagName("path");
var askedCountry = document.getElementById("askedCountry");

var alphaCodeMapList = [];
var count = 0;
var score = 0;
var clickcount = 0;



for (var i = 0; i < countries.length; i++){
    //link each country with an onclick function
    countries[i].onclick = function() {checkMapAnswer(this)};
    //retrieve the alpha code of countries on the map
    alphaCodeMapList.push(countries[i].getAttribute("data-id"));
}

function startMapQuiz(nbOfQuestion,Region){

    menu.style.display="none";
    carousel.style.display="none";
    console.log("disparition du carousel");
    loading.style.display="block";
    
    

    $('#QuizMap').load('map.html', function(){
        fetchMapData(nbOfQuestion,Region);
        $.getScript('js/mapQuiz.js');
        loading.style.display="none";
        
       
        QuizMap.appendChild(scoreDiv);
        count = 0;
        score = 0;
        counterMap.innerText = count+1+"/"+nbofquestion;

        //preventing the svg map to create tooltips
        var tooltips = document.getElementsByClassName("svgMap-tooltip");
        for (var i = 0; i < tooltips.length; i++){
            tooltips[i].remove();
        }
    });
}


async function fetchMapData(nbOfQuestion,Region){

        console.log("fetching "+nbOfQuestion+" "+ "coutries from "+ Region +" continent");

        nbofquestion = nbOfQuestion;
        region=Region;
        //Reset of all variables
        names = [];
        flags = []; 
        countryIndexes = [...Array(53).keys()];
        excludecountryIndexes = [];

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
         {
            for (let i = 0; i < nbOfQuestion ; i++) {

                var randNb = randomNumber(countryIndexes,excludecountryIndexes);
                if(alphaCodeMapList.includes(data[randNb].alpha2Code)){ 
                    names.push(data[randNb].name);
                    flags.push(data[randNb].alpha2Code);}
                else {i--;}       
            }
        }
          // fecthing more country name so the possible answer are not only the good answers
        })
        .catch(function(error) {
            console.log("error on fetching data");
        });
    
       askedCountry.innerText= names[count];
}

function checkMapAnswer(element){

    var clickedCountryID = element.getAttribute("data-id");
    var goodCountry = document.querySelector("[data-id='"+flags[count]+"']");
    
    if (clickcount < 2) {

        if(clickedCountryID==flags[count]){
            element.setAttribute('style', 'fill: green');
            score++;
            
            setTimeout(function(){ 
                
                count++;
                console.log("count = "+count);
                if(count == nbofquestion){
                    showScore();
                }
                counterMap.innerText = count+1+"/"+nbofquestion;
                askedCountry.innerText = names[count];
                clickcount=0; 
                for (var i = 0; i < countries.length; i++)
                    countries[i].removeAttribute('style');
            }, 1500);
            
        }  
        else {element.setAttribute('style', 'fill: red');}
    }
    else{  
        element.setAttribute('style', 'fill: red');
        goodCountry.setAttribute('style', 'fill: green');
        for (var i = 0; i < countries.length; i++){
            countries[i].setAttribute("onclick","return false;");
        }
        
        setTimeout(function(){ 
            count++;
            console.log("count = "+count);
            if(count == nbofquestion){
                showScore();
            }
            counterMap.innerText = count+1+"/"+nbofquestion;
            askedCountry.innerText = names[count];
            clickcount=0; 
            for (var i = 0; i < countries.length; i++){
                countries[i].removeAttribute('style');
                countries[i].removeAttribute('onclick');
                countries[i].onclick = function() {checkMapAnswer(this)};}
        }, 1500);
    }
    

    
    clickcount++;
    console.log(score);
    
}

function showScore(){

    document.getElementById('svgMap').style.display="none";
    document.getElementById('mapQuizInfoDiv').style.display="none";
    document.getElementById('scoreDiv').style.display="flex";
    document.getElementById('score').innerText = "Score : "+score;

    document.getElementById('restartMapSameData').onclick = function(){

        count = 0;
        score = 0;
        document.getElementById('scoreDiv').style.display="none";
        document.getElementById('svgMap').style.display="block";
        document.getElementById('mapQuizInfoDiv').style.display="block";
        askedCountry.innerText= names[count];
        counterMap.innerText = count+1+"/"+nbofquestion;
    }

    document.getElementById('restartMapDifferentData').onclick = function(){
        startMapQuiz(nbofquestion,region);
    }

    document.getElementById('backToMenu').onclick = function(){
        document.getElementById('QuizMap').innerHTML="";
        document.getElementById('menu').style.display="block";
    }

};


