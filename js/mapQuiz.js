var countries = document.getElementsByTagName("path");

var alphaCodeMapList = ["AF","AL","DZ","AD","AO","AI","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BR","VG","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CO","KM","CG","CR","HR","CU","CW","CY","CZ","CD","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","GA","GM","GE","DE","GH","GR","GL","GD","GP","GT","GN","GW","GY","HT","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","CI","JM","JP","JO","KZ","KE","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MK","MG","MW","MY","MV", "ML","MT","MQ","MR","MU","YT","MX","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI","NE","NG","KP","NO","OM","PK","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","KN","LC","VC","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","KR","SS","ES","LK","SD","SR", "SZ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TO","TT", "TN","TR","TM","TC","UG","UA","AE","GB","US","VI","UY","UZ","VU","VA","VE","VN","EH","YE","ZM","ZW"]
var count = 0;
var score = 0;
var clickcount = 0;

function setupMap(nbOfQuestion,Region){
 
    $('#QuizMap').load('map.html', function(){
        console.log("finished loading map");
        loading.style.display="none";
        QuizMap.appendChild(scoreDiv);
        count = 0;
        score = 0;
        document.getElementById("askedCountry").innerText = names[count];
        counterMap.innerText = count+1+"/"+nbofquestion;
        //preventing the svg map to create tooltips
        /*
        var tooltips = document.getElementsByClassName("svgMap-tooltip");
        for (var i = 0; i < tooltips.length; i++){
            tooltips[i].remove();
        }*/
    })
}


async function fetchMapData(nbOfQuestion,Region){

    loading.style.display="block";
    menu.style.display="none";
    carousel.style.display="none";
    console.log("fetching "+nbOfQuestion+" "+ "countries from "+ Region +" continent");
        

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
         
            for (let i = 0; i < nbOfQuestion ; i++) {
                var randNb = randomNumber(countryIndexes,excludecountryIndexes);
                if(alphaCodeMapList.includes(data[randNb].alpha2Code)){ 
                    names.push(data[randNb].name);
                    flags.push(data[randNb].alpha2Code);}
                else {i--;}   
            }
            setupMap();
        })
        .catch(function(error) {
            console.log("error on fetching data");
        });
}

function checkMapAnswer(element){

    var clickedCountryID = element.getAttribute("data-id");
    var goodCountry = document.querySelector("[data-id='"+flags[count]+"']");
    
    if (clickcount < 2) {

        if(clickedCountryID==flags[count]){

            for (var i = 0; i < countries.length; i++){
                countries[i].setAttribute('style', 'fill: grey');
            }
            
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

        for (var i = 0; i < countries.length; i++){
            if (countries[i].getAttribute('style')!="fill: red"){
                countries[i].setAttribute('style', 'fill: grey');
            } 
        }

        goodCountry.setAttribute('style', 'fill: green');

        
        
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
        fetchMapData(nbofquestion,region);
    }

    document.getElementById('backToMenu').onclick = function(){
        document.getElementById('QuizMap').innerHTML="";
        document.getElementById('menu').style.display="block";
    }

};


