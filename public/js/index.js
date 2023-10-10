let tabs = document.querySelector(".tabs");
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
	let section = document.getElementById(tab.dataset.tab);
	section.classList.add("active");
	tabs.scrollTo({ top: 0, left: section.offsetLeft - 16, behavior: "smooth" });
}

tabSynthese.addEventListener("click", (e) => activateTab(e.target));
tabDepenses.addEventListener("click", (e) => activateTab(e.target));
tabInvest.addEventListener("click", (e) => activateTab(e.target));

let startDateInput = document.getElementById("from");
let endDateInput = document.getElementById("to");

let dates = await fetch("/get-dates", { method: "GET" });
dates = await dates.json();

dates.forEach((date) => {
	let option = document.createElement("option");
	option.value = date.date;
	date = new Date(Date.UTC(date.date.split("-")[0], parseInt(date.date.split("-")[1], 10) - 1));
	option.text = new Intl.DateTimeFormat("fr-FR", {
		year: "numeric",
		month: "short",
	}).format(date);

	startDateInput.append(option.cloneNode(true));
	endDateInput.append(option.cloneNode(true));
});

startDateInput.querySelectorAll("option")[1].selected = true;
endDateInput.querySelectorAll("option")[endDateInput.querySelectorAll("option").length - 1].selected = true;

let startDate = startDateInput.querySelectorAll("option")[1].value;
let endDate = endDateInput.querySelectorAll("option")[endDateInput.querySelectorAll("option").length - 1].value;
