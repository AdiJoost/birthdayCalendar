window.addEventListener("load", function(){
	setupButton();
}, false);

function setupButton(){
	let addButton = document.getElementById('addKidButton');
	addButton.addEventListener("click", function(){
		addKid();
	}, false);
}

function addKid(){
	let name = document.getElementById('addKidInputName').value;
	let birthday = document.getElementById('addKidInputBirthday').value;

	let fullUrl = baseUrl + "/kid/" + 1
	fetch(fullUrl,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"name": name,
			"birthday": birthday,
							})
	})
	.then(response => {
		return response.json();
	})
	.then(body => gotAddBody(body));
}

function gotAddBody(body){
	alert(body["message"]);
}





