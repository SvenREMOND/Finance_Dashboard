// const { Chart } = require("chart.js");
// const flatpickr = require("flatpickr");

let tabs = document.querySelector(".tabs");
let tabSynthese = document.querySelector("[data-tab=synthese]");
let tabRevenus = document.querySelector("[data-tab=revenus]");
let tabDepenses = document.querySelector("[data-tab=depenses]");
let tabInvest = document.querySelector("[data-tab=invests]");

function activateTab(tab) {
	tabSynthese.classList.remove("active");
	tabRevenus.classList.remove("active");
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
tabRevenus.addEventListener("click", (e) => activateTab(e.target));
tabDepenses.addEventListener("click", (e) => activateTab(e.target));
tabInvest.addEventListener("click", (e) => activateTab(e.target));

let dates = await fetch("/get-dates");
dates = await dates.json();

let graphs = [];
let kpis = [];

let datePicker = flatpickr("#selector", {
	mode: "range",
	altInput: true,
	altFormat: "M Y",
	locale: "fr",
	dateFormat: "Y-m-d",
	defaultDate: [dates[0].date, dates[dates.length - 1].date],
	minDate: dates[0].date,
	maxDate: dates[dates.length - 1].date,
	plugins: [
		new monthSelectPlugin({
			altFormat: "M Y",
			dateFormat: "Y-m-d",
			theme: "dark",
		}),
	],
	onReady: async function (Dates, dateStr, instance) {
		let selectedDates = dateStr.split(" au ");

		kpis.push(await createKpi("patrimoine", "/data/kpi1", selectedDates[0], selectedDates[1]));

		graphs.push(await createGraph("repartitionPatrimoine", "/data/graph1", selectedDates[0], selectedDates[1]));
	},
	onClose: function (Dates, dateStr, instance) {
		let selectedDates = dateStr.split(" au ");

		graphs.forEach(async (graph) => {
			await refrechGraph(graph, selectedDates[0], selectedDates[1]);
		});
		kpis.forEach(async (kpi) => {
			await refrechKpi(kpi, selectedDates[0], selectedDates[1]);
		});
	},
});

async function createGraph(canvaId, fetchUrl, startDate, endDate) {
	Chart.defaults.color = "#ffffff";
	Chart.defaults.font.family = '"Titillium Web", sans-serif';
	Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
	Chart.defaults.plugins.tooltip.bodyColor = "#000000";
	Chart.defaults.plugins.tooltip.titleColor = "#000000";

	let data = await getData(fetchUrl, startDate, endDate);
	let graph = new Chart(document.getElementById(canvaId), {
		data,
		options: {
			responsive: false,
			interaction: {
				intersect: false,
				mode: "index",
			},
		},
	});

	graph.update();

	return {
		url: fetchUrl,
		chart: graph,
	};
}

async function refrechGraph(graph, startDate, endDate) {
	let url = graph.url;
	let chart = graph.chart;

	let data = await getData(url, startDate, endDate);

	chart.data = data;

	chart.update();
}

async function createKpi(elementId, fetchUrl, startDate, endDate) {
	let data = await getData(fetchUrl, startDate, endDate);

	if (!data) data = "No data";

	let element = document.getElementById("kpi_" + elementId).querySelector(".kpi--value");
	element.textContent = data;

	return {
		url: fetchUrl,
		element,
	};
}

async function refrechKpi(kpi, startDate, endDate) {
	let url = kpi.url;
	let element = kpi.element;

	let data = await getData(url, startDate, endDate);
}

async function getData(url, startDate, endDate) {
	let data = await fetch(url + "?startDate=" + startDate + "&endDate=" + endDate);
	data = await data.json();
	return data;
}
