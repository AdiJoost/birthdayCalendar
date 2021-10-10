

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
	console.log(body);
}