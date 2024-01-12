class windowManager {
    constructor() {
        this.windowState = -1;  //-1 is the about page.
        this.currentWindowDOMid = "pageBody__about";

        this.transitionBox = document.getElementById("transitionBox");
        this.projectButtons = document.getElementsByClassName("project-menu-button");
        this.homeButton = document.getElementById("navMenu__home");

        this.transformDuration = "1.5s";
        this.fadeDuration = "0.75s";
    }

    //switch window.
    async changeWindow(button_id) {
        //disable buttons.
        for (let i = 0; i < this.projectButtons.length; i++) {
            this.projectButtons[i].disabled = true;
        }
        this.homeButton.disabled = true;

        let nextWindowIndex;
        //case 1: home button
        if (button_id == "navMenu__home") {
            nextWindowIndex = -1;

            //Remove last window
            await this.windowFadeOut(this.currentWindowDOMid);

            //Enabling buttons here for better responsitivity.
            //enable buttons.
            for (let i = 0; i < this.projectButtons.length; i++) {
                this.projectButtons[i].disabled = false;
            }
            this.homeButton.disabled = false;

            //Show new window
            this.windowFadeIn("pageBody__about");

            this.currentWindowDOMid = "pageBody__about";
            //case 2: project buttons
        } else {
            nextWindowIndex = button_id.slice(-1);

            //Remove last window
            await this.windowFadeOut(this.currentWindowDOMid);

            //Enabling buttons here for better responsitivity.
            //enable buttons.
            for (let i = 0; i < this.projectButtons.length; i++) {
                this.projectButtons[i].disabled = false;
            }
            this.homeButton.disabled = false;

            //Show new window
            this.windowFadeIn(`pageBody__projects__${nextWindowIndex}`);

            this.currentWindowDOMid = `pageBody__projects__${nextWindowIndex}`;
        }

        this.windowState = nextWindowIndex;
    }

    async windowFadeOut(id) {
        //transition this to slide over the screen, then hide the previous page.
        this.transitionBox.style.transitionDuration = this.transformDuration;
        flushCSS(this.transitionBox);
        //not sure why i need 2 await sleeps here.
        await sleep(1);
        this.transitionBox.style.transform += `translateX(-101vw)`;
        await sleep(2000);

        //Hide the last window
        document.getElementById(id).style.display = "none";
        //Move transition box back.
        this.transitionBox.style.transitionDuration = "0s";
        flushCSS(this.transitionBox);
        this.transitionBox.style.transform = `translateX(0)`;
    }

    async windowFadeIn(id) {
        let element;
        //Toggle display.
        if (id == "pageBody__about") {
            element = document.getElementById("pageBody__about");
            element.style.transitionDuration = "0s";
            flushCSS(element);
            element.style.opacity = "0.0";
            element.style.display = "inline";
        } else {
            element = document.getElementById(id);
            element.style.transitionDuration = "0s";
            flushCSS(element);
            element.style.opacity = "0.0";
            element.style.display = "flex";
        }
        //Fade in.
        element.style.transitionDuration = this.fadeDuration;
        flushCSS(element);
        element.style.opacity = "1.0";
        await sleep(1000);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function flushCSS(element) { //flushes css to no transition.
    element.offsetHeight;
}


function setFunction(){
    updateWindowSize();
    setREM();
}
//SET functions
function setREM(){
    let newREM = 1.5*Math.log(window.innerWidth);
    document.documentElement.style.fontSize = `${newREM}px`;
}
function updateWindowSize(){
    document.getElementById("windowStats").innerHTML = `Current window size: ${window.innerWidth}px x ${window.innerHeight}px <br>
    Current window aspect ratio: ${(window.innerWidth/window.innerHeight).toFixed(2)} <br>
    Current REM: ${document.documentElement.style.fontSize}`;
}

function onload() {
    const handler = new windowManager();

    //initialize project buttons.
    let projectButtons = document.getElementsByClassName("project-menu-button");
    for (let i = 0; i < projectButtons.length; i++) {
        projectButtons[i].addEventListener("click", () => { handler.changeWindow(projectButtons[i].id) })
    }
    document.getElementById("navMenu__home").addEventListener("click", () => { handler.changeWindow("navMenu__home") });

    setInterval(setFunction, 10);
}

/*
function initializeDots(){
    var dots = document.getElementsByClassName("dot");
    for(let i = 0; i < dots.length; i++){
        //Check which way I want the lines to go. Draw a line to the edge of the screen.
        if(dots.item(i).classList.contains("right")){
            drawLine()
        }
        if(dots.item(i).classList.contains("left")){

        }
    }

    function drawLine(dotPos){
        
    }
}

//https://stackoverflow.com/questions/44109314/javascript-calculate-with-viewport-width-height
function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
*/