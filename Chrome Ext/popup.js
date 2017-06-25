function sendMessage(active) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active);
  });
}

this.changeButton = this.changeButton.bind(this);


//Need a listener from page.js if something has been highlighted in green, then execute this function to change the button in popup
function changeButton() {
  const button = document.querySelector('.start');
  button.textContent = 'Start Watching';
  button.classList.add('end'); //key for ending
  button.classList.remove('start');
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.start').addEventListener(
    'click', () => sendMessage(true) );
  document.querySelector('.end').addEventListener(
    'click', () => sendMessage(false) );
});

//also we need to have a form to get the phone number
//also we need to be able to let the popup not dissapear if we click off of it
