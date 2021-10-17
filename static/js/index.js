/*sets what type of presents should be searched for
0: is_done = true
1: is_done = false
2: both
*/
let presentSearchType = 2;

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	setDates();
	loadKids();
	search();
	setupButton();
}, false)

/*sets DatePicker dates to standart values*/
function setDates(){
	let startDateField = document.getElementById('presentsFrom');
	let endDateField = document.getElementById('presentsTo');
	let startDate = new Date();
	startDate.setMonth(startDate.getMonth() - 1);
	let endDate = new Date();
	endDate.setMonth(endDate.getMonth() + 2);
	startDateField.value = startDate.toISOString().slice(0,10);
	endDateField.value = endDate.toISOString().slice(0,10);
}

function setupButton(){
	let isDoneSwitch = document.getElementById('isDone');
	isDoneSwitch.addEventListener("click", function(){
		switchButton(isDoneSwitch);
	}, false)

	let searchButton = document.getElementById("search");
	searchButton.addEventListener("click", function(){
		search();
	}, false);
}

/*to switch the Button for type of Presents loaded*/
function switchButton(isDoneSwitch){
	/*switch form done to not done*/
	if (presentSearchType == 0){
		presentSearchType = 1;
		isDoneSwitch.innerText = "Nicht Gemacht"
		isDoneSwitch.classList.remove("all");
		isDoneSwitch.classList.remove("done");
		isDoneSwitch.classList.add("notDone");
	}
	/*switch from not done to all*/ 
	else if (presentSearchType == 1){
		presentSearchType = 2;
		isDoneSwitch.innerText = "All"
		isDoneSwitch.classList.remove("notDone");
		isDoneSwitch.classList.remove("done");
		isDoneSwitch.classList.add("all");
	}

	/*switch from all to adone*/ 
	else if (presentSearchType == 2){
		presentSearchType = 0;
		isDoneSwitch.innerText = "Gemacht"
		isDoneSwitch.classList.remove("notDone");
		isDoneSwitch.classList.remove("all");
		isDoneSwitch.classList.add("done");
	}
}




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



/*loads specific types of presents*/
function search(){
	let container = document.getElementById("allPresents");
	container.innerText = "";
	let startDate = document.getElementById("presentsFrom").value
	let endDate = document.getElementById("presentsTo").value
	let fullUrl = baseUrl + "/presents"
	fetch(fullUrl,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"start_date": startDate,
			"end_date": endDate,
							})
	})
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	})
	.then(body => gotPresentBody(body));
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

/*iterates through all presents in recieved payload and checks,
whether it should be displayed or not, based on the presentSearchType*/
function gotPresentBody(body){
	for (let i in body){
		if (presentSearchType == 2){
			displayPresent(body[i]);
		} else if (presentSearchType == 0 && body[i]["is_done"]){
			displayPresent(body[i]);
		} else if (presentSearchType == 1 && !body[i]["is_done"]){
			displayPresent(body[i]);
		}
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
			kidBirthday.innerText = present["year"] + "-" + present["kid_birthday"].slice(5);
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
				donePanel.addEventListener("click", function(){
					updatePresent(present);
				})
				if (present["is_done"]){
					donePanel.classList.add("isDone");
				}
				doneBox.appendChild(donePanel);

			presentBox.appendChild(doneBox);



	container.appendChild(presentBox);
}

function updatePresent(present){
	console.log(present);
	console.log(!present["is_done"]);
	let fullUrl = baseUrl + "/present/" + present["id"];
	fetch(fullUrl,{
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"is_done": !present["is_done"]
							})
	})
	.then(response => {
		console.log(response);
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	}).then(body => search());
}