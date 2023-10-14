// const { Chart } = require("chart.js");
// const flatpickr = require("flatpickr");

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

let dates = await fetch("/get-dates");
dates = await dates.json();

let graphs = [];

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
	onClose: function (Dates, dateStr, instance) {
		let selectedDates = dateStr.split(" au ");

		graphs.forEach(async (graph) => {
			await refrechChart(graph, selectedDates[0], selectedDates[1]);
		});
	},
	onReady: async function (Dates, dateStr, instance) {
		let selectedDates = dateStr.split(" au ");

		graphs.push(await createChart("repartitionPatrimoine", "/data/graph1", selectedDates[0], selectedDates[1]));
	},
});

async function createChart(canvaId, fetchUrl, startDate, endDate) {
	Chart.defaults.color = "#ffffff";
	Chart.defaults.font.family = '"Titillium Web", sans-serif';
	Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
	Chart.defaults.plugins.tooltip.bodyColor = "#000000";
	Chart.defaults.plugins.tooltip.titleColor = "#000000";

	let data = await fetch(fetchUrl + "?startDate=" + startDate + "&endDate=" + endDate);
	data = await data.json();

	return {
		url: fetchUrl,
		chart: new Chart(document.getElementById(canvaId), {
			data,
			options: {
				responsive: false,
				interaction: {
					intersect: false,
					mode: "index",
				},
			},
		}),
	};
}

async function refrechChart(graph, startDate, endDate) {
	let url = graph.url;
	let chart = graph.chart;

	let data = await fetch(url + "?startDate=" + startDate + "&endDate=" + endDate);
	data = await data.json();

	chart.data = data;

	chart.update();
}
