const getNewDeck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
const initDeck = document.querySelector('#newDeck');
const meshow = document.querySelector('#showme');
const shuffle = document.querySelector('#shuffleDeck');
const gotCha = document.querySelector('.card-flip');
const allCards = document.querySelector('#targetParent');
let deckID = '';
let cardHolder = [];
let cardHolderFlipBack = [];
let counter = 0;
let match = false;
let time = 0;
let matched = [];
let storeMatched = []
let score = 0;
let turn = true;
let win = false;

// let the games begin
window.addEventListener('load', init)
// loaded
function init(){
initDeck.addEventListener('click',myFunc);
shuffle.addEventListener('click', shuffleDeck);
allCards.addEventListener('click', handleClick);
}

//api call for new deck on start of game only, and show shuffle btn 
const myFunc = async () => {
    timer()
    try {
        const res = await fetch(getNewDeck, {
    mode: 'cors'
    })
    const resParse = await res.json() ;
    const deck = resParse.deck_id;
    deckID = deck;
    showCards(deckID);
    let hideNewDeck = deckID.length > 2 ? initDeck.style="display:none" : shuffle.style="display:block";
    let addShuffle = deckID.length > 2 ? shuffle.style="display:block" : shuffle.style="display:none";
    return deckID
  } catch (error) {
      console.log(' something went wrong :(  ', error);
  }
}

// hit api to shuffle deck - no need to waste it. reset all data...
const shuffleDeck = async ()=>{
    //reset grid
     if(win === true){
         let html = 
        `
        <div style="margin-bottom: 50px;" width="100%" height="100vh" id="targetParent" class="container">
            <div class="row justify-content-center">
                <div style="display: flex;" class=" playing-field-row1"></div>
            </div>
            <div class="row justify-content-center">
                <div style="display: flex;" class=" playing-field-row2"></div>
            </div>
            <div class="row justify-content-center">
                <div style="display: flex;" class=" playing-field-row3"></div>
            </div>
            <div class="row justify-content-center">
                <div style="display: flex;" class=" playing-field-row4"></div>
            </div>
        </div>
        `;
         document.querySelector('#targetParent').innerHTML = html;
    }

    try {
        const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`);
        const resParse = await res.json() ;
        const deck = resParse.deck_id;
        deckID = deck;
        console.log('from shuffle ', deckID);
        showCards(deckID);
        reset()
        return deckID
    } catch (error) {
        console.error('Huston we got a problem...', error.stack);
    }
}

//Makes a row of 13 cards
function makeGrid(e){
    let output='';
    e.forEach((item) => {
         output += `
        <div class="col flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img data-value="${item.value}" data-code="${item.code}" data-suit="${item.suit}" width="78px" height="100px" src="./images/ui/bicycle1.jpg" alt="  "/>
                </div>
                <div class="flip-card-back">
                    <img width="78px" height="100px" data-code="${item.code}" data-value="${item.value}" data-suit="${item.suit}"  src="${item.image}" alt="">
                </div>
            </div>
        </div>`;
      })
      return output
}

// make api call to show cards 
const showCards = async (deckID)=>{
  try {
    const deck2 = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`);
    const resDeck2 = await deck2.json();
    const res = resDeck2.cards;
    const row1 = res.slice(0,13)
    const row2 = res.slice(13,26)
    const row3 = res.slice(26,39)
    const row4 = res.slice(39,53)
    let output1 = makeGrid(row1);
    let output2 = makeGrid(row2);
    let output3 = makeGrid(row3);
    let output4 = makeGrid(row4);
    document.querySelector('.playing-field-row1').innerHTML = output1;
    document.querySelector('.playing-field-row2').innerHTML = output2;
    document.querySelector('.playing-field-row3').innerHTML = output3;
    document.querySelector('.playing-field-row4').innerHTML = output4;
  } catch (error) {
    console.log('ohh boy...', error);
  }
}

//game logic  :)

//card flipper
const justFlipIt = (e) => {
let flipper = e.target.parentElement.parentElement.classList.toggle('flippyFlip');
}

// turn counter
const handelCounter = () => {
    let html=''
    counter = counter + 1
    html = document.querySelector('#counter-html');
    html.innerText =`${counter}`
}

// not my function- taken from animate.css docs page
function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName, 'slow')
    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

// score keeper
const handelScore = () => {
    let html='';
    animateCSS('.score-target', 'heartBeat', function() {
    handleAnimationEnd()
})
    score =  (storeMatched.length / 2) * 10
    console.log(score);
    if(score == 260){
        win = true
    }else{
        win = false
    }
    html = document.querySelector('#score-html');
    html.innerText =`${score}`;
    winner();
}

//is winner?
const winner = () =>{
     if(win === true){
        animateCSS('#targetParent', 'hinge', function() {
        handleAnimationEnd()
        })
         let html = 
        `<div class="row justify-content-center">
            <iframe src="https://giphy.com/embed/4IbDRnr24qrcY" width="480" height="240" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>`;
        setTimeout(() => {
            document.querySelector('#targetParent').innerHTML = html;
        }, 2000); 
    }else{
        return
    }
}

//timer
const timer = ()=>{
    setInterval(() => {
    time= time + 1
    html2 = document.querySelector('#counter-timer');
    html2.innerText =`${time}`
    }, 1000);
}

//reset on shuffle btn
const reset = () => {
    cardHolder = [];
    cardHolderFlipBack = []
    counter = 0;
    time = 0;
    match = false;
    matched = [];
    storeMatched = [];
    score = 0;
    turn = true;
    win = false;
    html = document.querySelector('#counter-html');
    html.innerText =`${counter}`
    html = document.querySelector('#score-html');
    html.innerText =`${score}`
}

//match maker
const isMatch = ()=>{
    if(cardHolder[0] === cardHolder[1] &&  !storeMatched.some((item) => matched.indexOf(item) >= 0) && matched[0] != matched[1] ){
        for(var e of matched){
            storeMatched.push(e)
        }
        console.log('your stored matches : ',storeMatched);
        return match = true
    }else{
        return match = false
    }
}
const clear = () =>{
    cardHolderFlipBack = []
    cardHolder = []
    matched = []
    turn = true
}

//handles onclick of card
const handleClick = (e) => {
    if(turn === true && win === false){
        turn = false;
        handelCounter();
        justFlipIt(e)
        let cardValue = e.target.dataset.value;// card value
        let code = e.target.dataset.code; // card code 
        let parentFlip = e.target.parentElement.parentElement
        cardHolder.push(cardValue); // arr holding card values
        cardHolderFlipBack.push(parentFlip) ;
        matched.push(code)
        if(cardHolder.length >= 2){
            isMatch();
        }
        if(cardHolderFlipBack.length >= 2 && match === false){
            setTimeout(() => {
                for(var item of cardHolderFlipBack){
                item.classList.toggle('flippyFlip')
            }
            }, 900)
            setTimeout(() => {
                clear();
            }, 1000);
        } else if(cardHolderFlipBack.length >= 2 && match === true){
            handelScore();
            clear() ;
            return match = false
        }else{
            turn =true
        }
    }else{
        turn = true
        return;
    }
}