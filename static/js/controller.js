

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	loadKids();
	loadPresents();
}, false)


/*Load Kids*/
function loadKids(){
	let fullUrl = baseUrl + "/kids"
	fetch(fullUrl)
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	})
	.then(body => gotKidBody(body));
}

function gotKidBody(body){
	let container = document.getElementById('allKids');
	container.innerText = "";
	for (let i in body){
		let key = Object.keys(body[i])
		displayKid(body[i][key]);
	}
}

function displayKid(kid){
	let container = document.getElementById('allKids');
		let kidBox = document.createElement("div");
		kidBox.classList.add("kidBox");
			let kidName = document.createElement("div");
			kidName.classList.add("kidName");
			kidName.innerText = kid["name"];
			kidBox.appendChild(kidName);

			let kidBirthday = document.createElement("div");
			kidBirthday.classList.add("kidBirthday");
			kidBirthday.innerText = kid["birthday"];
			kidBox.appendChild(kidBirthday);

			let button = document.createElement("div");
			button.classList.add("kidButton");
				let edit = document.createElement("div");
				edit.classList.add("editKidButton");
				edit.innerText = "Edit";
				button.addEventListener("click", function(){
					openEditKid(kid, kidBox, button);
				}, false)
				button.appendChild(edit);
			kidBox.appendChild(button);

		container.appendChild(kidBox);
}

/*adds fields to the kidBox to edit the kid itself*/
function openEditKid(kid, kidBox, editButton){
	editButton.style.display = "none";
	let inputName = document.createElement("input");
	inputName.classList.add("kidInputName");
	inputName.type = "text";
	inputName.value = kid["name"];
	kidBox.appendChild(inputName);

	let inputBirthday = document.createElement("input");
	inputBirthday.classList.add("kidInputBirthday");
	inputBirthday.type = "date";
	inputBirthday.value = kid["birthday"];
	kidBox.appendChild(inputBirthday);

	let updateButton = document.createElement("div");
	updateButton.classList.add("kidButton");
		let update = document.createElement("div");
		update.classList.add("editKidButton");
		update.innerText = "Update";
		updateButton.appendChild(update);
	kidBox.appendChild(updateButton);

	let resetButton = document.createElement("div");
	resetButton.classList.add("kidButton");
		let reset = document.createElement("div");
		reset.classList.add("editKidButton");
		reset.innerText = "Reset";
		resetButton.appendChild(reset);
	kidBox.appendChild(resetButton);

	/*resets a open Kid that is editable to its normal display*/
	resetButton.addEventListener("click", function(){
			editButton.style.display = "block";
			kidBox.removeChild(inputName);
			kidBox.removeChild(inputBirthday);
			kidBox.removeChild(updateButton);
			kidBox.removeChild(resetButton);
	}, false)
	/*updates the Kid*/
	updateButton.addEventListener("click", function(){
			updateKid(kid,
				inputBirthday.value,
				inputName.value,
				editButton,
				kidBox,
				[inputName, inputBirthday, resetButton, updateButton]);
			}, false)
}

/*Sends a PUT-Method to the API to change name and Birthday of given kid*/
function updateKid(kid, birthday, name, editButton, kidBox, removeList){
	let fullUrl = baseUrl + "/kid/" + kid["id"]
	fetch(fullUrl,{
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"name": name,
			"birthday": birthday,
							})
	})
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	})
	.then(body => gotEditKidBody(body, editButton, kidBox, removeList));
}

function gotEditKidBody(body, editButton, kidBox, removeList){
	alert(body["message"]);
	editButton.style.display = "block";
	for (let i in removeList){
		kidBox.removeChild(removeList[i]);
	}
	loadKids();
}

/*Load all presents*/
function loadPresents(){
	let fullUrl = baseUrl + "/presents"
	fetch(fullUrl)
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	})
	.then(body => gotPresentBody(body));
}

function gotPresentBody(body){
	for (let i in body){
		displayPresent(body[i]);
	}
}

function displayPresent(present){
	let container = document.getElementById('allPresents');
	let presentBox = document.createElement("div");
	presentBox.classList.add("presentBox");
			let kidName = document.createElement("div");
			kidName.classList.add("kidName");
			kidName.innerText = present["kid_name"];
			presentBox.appendChild(kidName);

			let kidBirthday = document.createElement("div");
			kidBirthday.classList.add("kidBirthday");
			kidBirthday.innerText = present["year"] + "-" + present["kid_birthday"].slice(6);
			presentBox.appendChild(kidBirthday);

			let typeBox = document.createElement("div");
			typeBox.classList.add("typeBox");
				let typeLabel = document.createElement("span");
				typeLabel.classList.add("label");
				typeLabel.innerText = "Geschenk-Nummer: ";
				typeBox.appendChild(typeLabel);

				let typeNumber = document.createElement("span");
				typeNumber.classList.add("presentType");
				typeNumber.innerText = present["present_type"];
				typeBox.appendChild(typeNumber);

			presentBox.appendChild(typeBox);

			let doneBox = document.createElement("div");
			doneBox.classList.add("doneBox");
				let doneLabel = document.createElement("span");
				doneLabel.classList.add("label");
				doneLabel.innerText = "Gemacht: "
				doneBox.appendChild(doneLabel);

				let donePanel = document.createElement("div");
				donePanel.classList.add("donePanel");
				if (present["is_done"]){
					donePanel.classList.add("isDone");
				}
				doneBox.appendChild(donePanel);

			presentBox.appendChild(doneBox);



	container.appendChild(presentBox);
}