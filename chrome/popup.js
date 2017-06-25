function sendMessage(active) {
  // changeButton();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active);
  });
}

// this.changeButton = this.changeButton.bind(this);

//Need a listener from page.js if something has been highlighted in green, then execute this function to change the button in popup
// function changeButton() {
//   const button = document.querySelector('.start');
//   button.textContent = 'Disable Plugin';
//   button.classList.add('end'); //key for ending
//   button.classList.remove('start');
//   button.addEventListener(
//   'click', () => sendMessage(false, button) );
//   button.removeEventListener {
//     'click,' () => sendMessage(true, button) );
//   }
// }

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.start');
  button.addEventListener(
    'click', () => sendMessage(true) );
  document.querySelector('.end').addEventListener(
    'click', () => sendMessage(false, button) );
});

//also we need to have a form to get the phone number
