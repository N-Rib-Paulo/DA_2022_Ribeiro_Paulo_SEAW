const handOptions = {
    "rock": "/Rock-Paper-Scissors/assets/Rock.png",
    "paper": "/Rock-Paper-Scissors/assets/Paper.png",
    "scissors": "/Rock-Paper-Scissors/assets/Scissors.png"
}

let SCORE = 0;

const pickUserHand = (hand) => {
    // Check in Console what I click
    console.log(hand);

    // Hide the current page
    let hands = document.querySelector(".hands");
    hands.style.display ="none"

    // Show the next page with the hand I picked
    let contest = document.querySelector(".contest");
    contest.style.display = "flex";

    // Set the user pick
        document.getElementById("userPickImage").src = handOptions[hand];

    let cpHand = pickComputerHand();

    referee(hand, cpHand);

}

const pickComputerHand = () => {
    // Computer hands options
    let hands = ["rock", "paper", "scissors"]
    
    // Math.floor = goes downwards to the full number, example: 5.55 goes to 5
    let cpHand = hands[Math.floor(Math.random() * 3)]

    // Set the computer pick (picking random)
    document.getElementById("computerPickImage").src = handOptions[cpHand];

    return cpHand;
}

const referee = (userHand, cpHand) => {
    if(userHand == "paper" && cpHand == "scissors") {
        setDecision("YOU LOSE!")
    }
    if(userHand == "paper" && cpHand == "rock") {
        setDecision("YOU WIN!")
        setScore(SCORE + 1)
    }
    if(userHand == "scissors" && cpHand == "rock"){
        setDecision("YOU LOSE!")
    }
    if(userHand == "scissors" && cpHand == "paper"){
        setDecision("YOU WIN!")
        setScore(SCORE + 1)
    }
    if(userHand == "rock" && cpHand == "paper"){
        setDecision("YOU LOSE!")
    }
    if(userHand == "rock" && cpHand == "scissors"){
        setDecision("YOU WIN!")
        setScore(SCORE + 1)
    }
    if(userHand == "paper" && cpHand == "paper"){
        setDecision("IT'S A TIE!")
    }
    if(userHand == "rock" && cpHand == "rock"){
        setDecision("IT'S A TIE!")
    }
    if(userHand == "scissors" && cpHand == "scissors"){
        setDecision("IT'S A TIE!")
    }
}

const restartGame = () => {
    // Hide the current page -- Same as above but now reversing it
    let hands = document.querySelector(".hands");
    hands.style.display ="flex"

    // Show the next page with the hand I picked -- Same as above but now reversing it
    let contest = document.querySelector(".contest");
    contest.style.display = "none";
}

const setDecision = (decision) => {
    document.querySelector(".decision h1").innerText = decision;
}

const setScore = (score) => {
    SCORE = score;
    document.querySelector(".score h1").innerText = score;
}

