

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
					donePanel.classList.add("is_done");
				}
				doneBox.appendChild(donePanel);

			presentBox.appendChild(doneBox);



	container.appendChild(presentBox);
}