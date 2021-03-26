<?php 
    //-----Connection à la BDD -------//
    require_once("config.php");        
    try { 
        $bdd = new PDO('mysql:host='.BDDSERVEUR.';dbname='.BDDBASE.';charset=utf8', BDDLOGIN, BDDPASSWD); 
    } 
    catch (Exception $e) { 
        die('Erreur : ' . $e->getMessage()); 
    } 

    //-----Récupération de la liste des modules -------//
    $query1 = $bdd->query("SELECT name , capital , iso2 FROM countries ORDER BY rand() Limit 200"); 
    $countries = array(); 
    while ($country = $query1->fetch()) 
    array_push($countries, array("Name" => $country["name"], 
                            "Capital" => $country["capital"], 
                            "Flag" => $country["iso2"])); 

?>


<html>
    
    <head>
        <title>Country Game</title>
        <link rel="stylesheet" href="boostrap/css/bootstrap.min.css">
    </head>

    <body class="bg-dark">
    
        <div id="CountryCarousel" class="carousel slide">

            <div class="carousel-inner">

                <div class="carousel-item active ">
                    <div class='card text-white bg-dark d-block w-75 h-100 text-center mx-auto' style='border: none;'>
                        <div class='card-body m-auto'>
                            <button class='btn btn-success w-100' onclick="timer(3)">START</button>
                        </div>
                    </div>  
                </div>

                <?php 
                    
                    function getRandomNumber($exclude) {
                        do {
                            $n = mt_rand(0,199);
                        } while(in_array($n, $exclude));
                        return $n;
                    }

                    $goodandswerArray = [];

                    for($i=0;$i<10;$i++){
                        echo "
                            <div class='carousel-item '>
                                <div class='card text-white bg-dark d-block w-75 h-100 text-center mx-auto' style='border: none;'>
                                    <img class='card-img-top  h-75' src='images/flags/",$countries[$i]["Flag"],".svg'>
                                    <div class='card-body m-auto'>
                                        <h5 class='card-title mb-3'>",$countries[$i]["Name"],"</h5>

                                        <div class='container text-center'>
                                            <div class='row g-3 text-light'>";

                                            $answerIndex = rand(0,3);
                                            $excludeAnswerArray = [$i];

                                            for($j=0;$j<4;$j++){

                                                if ($j==$answerIndex){

                                                    echo "
                                                        <div class='col-6'>
                                                        <button class='btn btn-outline-light w-100 answerbutton'  onclick='checkAnswer(",$i,",",$j,")'>",$countries[$i]["Capital"],"</button>
                                                        </div>";
                                                        array_push($goodandswerArray,$answerIndex);

                                                }else{
                                                        $randomCapital = getRandomNumber($excludeAnswerArray);
                                                        echo "<div class='col-6'>
                                                                    <button class='btn btn-outline-light w-100 answerbutton'  onclick='checkAnswer(",$i,",",$j,")'>",$countries[$randomCapital]["Capital"],"</button>
                                                                </div>";
                                                        array_push($excludeAnswerArray,$randomCapital);
                                                    }
                                                }
                                          
                                            echo "</div>
                                            </div>
                                    </div>
                                </div>
                            </div>";};

                            $goodandswerArray = json_encode($goodandswerArray);
                ?>

                <div class="carousel-item">
                    <div class='card text-white bg-dark d-block w-75 h-100 text-center mx-auto' style='border: none;'>
                        <div class='card-body m-auto'>
                            <h1>Votre score</h1>
                            <h2 id='score'></h2>
                        </div>
                    </div>  
                </div>

                
            <!--       
            </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#CountryCarousel"  data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#CountryCarousel"  data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            
            </div> 
            -->

            
                                                
        </div>

        <h1 class="text-light" id="timer" style="position: absolute;top:45%;right:50%;font-size : 5em"></h1>

        <script src="jquery\jquery.min.js"></script>
        <script src="boostrap\js\bootstrap.min.js"></script>

        <script>

            window.onload = function() {

                $('#CountryCarousel').carousel({
                interval: false,
                wrap: false });  

            }

            var goodandswerArray =  '<?=$goodandswerArray?>' ;
            var answerbuttons = document.getElementsByClassName('answerbutton');
            var score = 0 ;
            var timePassed = 0;
            var time = document.getElementById('timer');
            var resetCount = 0;
      
            function carouselNext(time){
                setTimeout(() => {$("#CountryCarousel").carousel("next")}, time);
            }

            function checkAnswer(QuestionIndex,AnswerIndex){

                var goodAnswerIndex=parseInt(goodandswerArray[QuestionIndex*2+1]);

                if(AnswerIndex==goodAnswerIndex){
                    //console.log("bonne reponse");
                    answerbuttons[QuestionIndex*4+AnswerIndex].style.backgroundColor="green";
                    //console.log(QuestionIndex*4+AnswerIndex);
                    score++;
                    for (i = QuestionIndex*4 ; i < QuestionIndex*4+4 ; i++){
                        answerbuttons[i].disabled =true;
                    }
                }else {
                    //console.log("mauvaise reponse");
                    answerbuttons[QuestionIndex*4+AnswerIndex].style.backgroundColor="red";
                    answerbuttons[QuestionIndex*4+goodAnswerIndex].style.backgroundColor="green";
                    //console.log(QuestionIndex*4+goodAnswerIndex);
                    for (i = QuestionIndex*4 ; i < QuestionIndex*4+4 ; i++){
                        answerbuttons[i].disabled =true;
                    }
                }
                document.getElementById('score').innerHTML = score + "/10";
                carouselNext(2000);
                resetTimer(2000);
            }

            function timer(second) {
    
                time.innerHTML =  second;
                timerInterval = setInterval(() => {

                    timePassed = timePassed += 1;
                    timeLeft = second - timePassed;
                    
                    time.innerHTML = timeLeft;
                    if(timeLeft==0){
                        resetTimer(1000);
                        carouselNext(1000);
                        document.getElementById('score').innerHTML = score + "/10";
                    }
                }, 1000);
            }

            function resetTimer(time){

                clearInterval(timerInterval);
                timePassed = 0;
                setTimeout(() => {timer(5)}, time);
                resetCount ++;
                if(resetCount==1){
                    translateTimer();
                }
                if(resetCount==11){
                    stopTimer();
                }
            }

            function stopTimer(){
                clearInterval(timerInterval);
                setTimeout(() => {time.style="display:none"}, 0)       
            }

            function translateTimer(){
                setTimeout(() => { time.style.top = "25px";
                                    time.style.right = "40px";
                                    time.style.fontSize="2em";}, 1000) 
            }

        </script>

    </body>

</html>

