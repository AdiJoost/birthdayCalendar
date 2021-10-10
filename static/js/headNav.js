let baseUrl = "";

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	navSetup();
}, false)

function navSetup(){
	let container = document.getElementById('headNav');
	let navItems = [["Startseite", "/"],
					["Kind hinzufügen", "/addKid"],
					["Kind bearbeiten", "/editKid"],
					["Controller", "/controller"]]
	for (let i in navItems){
		addItem(navItems[i], container);
	}
}

function addItem(item, container){
	let navItem = document.createElement("a");
	navItem.href = baseUrl + item[1];
	navItem.innerText = item[0];
	navItem.classList.add("navItem");
	container.appendChild(navItem);
}