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
		isDoneSwitch.classList.add("notDone");
	}
	/*switch from not done to all*/ 
	else if (presentSearchType == 1){
		presentSearchType = 2;
		isDoneSwitch.innerText = "All"
		isDoneSwitch.classList.remove("notDone");
		isDoneSwitch.classList.add("all");
	}

	/*switch from all to adone*/ 
	else if (presentSearchType == 2){
		presentSearchType = 0;
		isDoneSwitch.innerText = "Gemacht"
		isDoneSwitch.classList.remove("notDone");
		isDoneSwitch.classList.remove("all");
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
				let edit = document.createElement("a");
				edit.classList.add("editKidButton");
				edit.href = baseUrl + "/editKid/" + kid["id"];
				edit.innerText = "Edit";
				button.appendChild(edit);
			kidBox.appendChild(button);

		container.appendChild(kidBox);
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