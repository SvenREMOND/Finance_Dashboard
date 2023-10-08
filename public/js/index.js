let tabSynthese = document.querySelector("[data-tab=synthese]");
let tabDepenses = document.querySelector("[data-tab=depenses]");
let tabInvest = document.querySelector("[data-tab=invest]");

function activateTab(tab) {
	tabSynthese.classList.remove("active");
	tabDepenses.classList.remove("active");
	tabInvest.classList.remove("active");

	document.querySelectorAll(".tabs section").forEach((tab) => {
		tab.classList.remove("active");
	});

	tab.classList.add("active");
	document.getElementById(tab.dataset.tab).classList.add("active");
}

tabSynthese.addEventListener("click", (e) => activateTab(e.target));
tabDepenses.addEventListener("click", (e) => activateTab(e.target));
tabInvest.addEventListener("click", (e) => activateTab(e.target));

let startDate = document.getElementById("from");
let endDate = document.getElementById("to");

let dates = await fetch("/get-dates", { method: "GET" });
dates = dates.json();
