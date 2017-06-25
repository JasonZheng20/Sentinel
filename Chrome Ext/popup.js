function sendMessage(active) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active);
    // port.onMessage.addEventListener(this.changeButton);
  });
}

this.changeButton = this.changeButton.bind(this);

function changeButton() {
  const button = document.querySelector('.start');
  button.textContent = 'Start Watching';
  button.classList.add('end');
  button.classList.remove('start');
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.start').addEventListener(
    'click', () => sendMessage(true) );
  document.querySelector('.end').addEventListener(
    'click', () => sendMessage(false) );
});
