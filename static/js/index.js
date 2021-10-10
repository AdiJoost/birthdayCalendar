

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	loadKids()
	
}, false)

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
	.then(body => gotBody(body));
}

function gotBody(body){
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