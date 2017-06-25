chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

this.respond = this.respond.bind(this);
this.hover = this.hover.bind(this);
this.chosenTarget = "";
this.hovering = "";

function onMessage(active) {
  if (active) {
    document.body.style = "opacity: 0.5";
    document.querySelector('body').addEventListener('click', this.respond);
    document.querySelector('body').addEventListener('mouseover', this.hover);
  }
  else {
    document.body.style = "opacity: 1";
    document.querySelector('body').removeEventListener('click', this.respond);
    document.querySelector('body').removeEventListener('mouseover', this.hover);
  }
}

function hover(event) {
  event.preventDefault();
  if (this.hovering != "" && this.hovering != this.chosenTarget && this.hovering != document.querySelector('body')) this.hovering.style = "outline: 0px";
  if (event.target.textContent != "") {
    this.hovering = event.target;
    if (this.hovering != document.querySelector('body') && this.hovering != this.chosenTarget) {
      this.hovering.style = "outline: 2.5px solid red";
    }
  }
}

function respond(event) {
  event.preventDefault();
  if (this.chosenTarget != ""  && this.hovering != document.querySelector('body')) this.chosenTarget.style = "outline: 0px";
  if (event.target.textContent != "" && this.hovering != document.querySelector('body')) {
    this.chosenTarget = event.target;
    this.chosenTarget.style = "outline: 5px solid green";
    document.dispatchEvent(new CustomEvent('chosenElement')); //not dispatching, but I want to to change the text content of the ext button
    //Need to create a way to communicate to the pop up that you have clicked something, so run the function in popup.js
  }
}
