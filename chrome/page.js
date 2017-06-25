chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

this.respond = this.respond.bind(this);
this.hover = this.hover.bind(this);
this.chosenTarget = "";
this.hovering = "";
var sending = false;

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
    $('#dialog').hide();
    if (this.hovering != "") this.hovering.style = "outline:0px";
    if (this.chosenTarget != "") this.chosenTarget.style = "outline:0px";
  }
}

function hover(event) {
  event.preventDefault();
  if (this.hovering !== "" && this.hovering !== this.chosenTarget && this.hovering !== document.querySelector('body')) {
    this.hovering.style = "outline: 0px";
  }
  if (event.target.textContent !== "") {
    this.hovering = event.target;
    if (this.hovering !== document.querySelector('body') && this.hovering !== this.chosenTarget) {
      this.hovering.style = "outline: 2.5px solid red";
    }
  }
}

var getUniquePath = function(node) {
    var parts = [ ];

    $(node).parents().each(function(index, element) {
				if(index >= $(node).parents().length - 2) {
					return
				} else {
					parts.push(' :nth-child(' + ($(element).index() + 1) + ')');
				}
    });

		var select = 'html > body > ' + parts.join(' > ', parts.reverse()) + '> :nth-child(' + ($(node).index() + 1) + ')';

    return select;
}

var selector = '';

var sendWatcher = function(selector, pn, url) {
  var that = this;
  sending = true;
	$.ajax({
		url: 'http://localhost:8080/watch',
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			nodeAddress: selector,
			phoneNumber: pn,
			url: url
		})
	}).done(function(message) {
		$('#dialog').remove();
    var dialog = '<div style="position: fixed;" id="dialog" title="Basic dialog"><div class = "flex"><h2 class = "Title">Sentinel</h2><p id = "popUpValue" class = "instr">Watching content with value: </p><input placeholder="Phone Number" type="text" id="pn"></input><button id="watchsubmit">Watch!</button></div></div>';
		$('html').append(dialog);
    document.body.style = "opacity: 1";
    document.querySelector('body').removeEventListener('click', that.respond);
    document.querySelector('body').removeEventListener('mouseover', that.hover);
    $('#dialog').hide();
    that.hovering.style = "outline:0px";
    that.chosenTarget.style = "outline:0px";
    that.respond = that.respond.bind(that);
    that.hover = that.hover.bind(that);
    sending = false;
	}).fail(function() {
		$('#dialog').remove();
    var dialog = '<div style="position: fixed;" id="dialog" title="Basic dialog"><div class = "flex"><h2 class = "Title">Sentinel</h2><p id = "popUpValue" class = "instr">Watching content with value: </p><input placeholder="Phone Number" type="text" id="pn"></input><button id="watchsubmit">Watch!</button></div></div>';
		$('html').append(dialog);
    document.body.style = "opacity: 1";
    document.querySelector('body').removeEventListener('click', that.respond);
    document.querySelector('body').removeEventListener('mouseover', that.hover);
    $('#dialog').hide();
    that.hovering.style = "outline:0px";
    that.chosenTarget.style = "outline:0px";
    that.respond = that.respond.bind(that);
    that.hover = that.hover.bind(that);
    sending = false;
	});

	sending = false;
}

var dialog = '<div style="position: fixed;" id="dialog" title="Basic dialog"><div class = "flex"><h2 class = "Title">Sentinel</h2><p id = "popUpValue" class = "instr">Watching content with value: </p><input placeholder="Phone Number" type="text" id="pn"></input><button id="watchsubmit">Watch!</button></div></div>';
$('html').append(dialog);


var toggleModal = function(content) {
  document.querySelector('#popUpValue').textContent = "Watching content with value: " + content;
	$('#watchsubmit').click(function() {
		sendWatcher(selector, $('#pn').val(), window.location.href);
	})

	$('#dialog').show();
	$('#dialog').draggable();
}

function respond(event) {
  event.preventDefault();
  if (this.chosenTarget !== ""  && this.hovering !== document.querySelector('body')) {
		this.chosenTarget.style = "outline: 0px";
  }
  if (event.target.textContent !== "" && this.hovering !== document.querySelector('body')) {
    this.chosenTarget = event.target;
    const content = this.chosenTarget.textContent;
		selector = getUniquePath(this.chosenTarget);
    console.log(this.chosenTarget);
		toggleModal(content);
    this.chosenTarget.style = "outline: 5px solid green";
  }
}
