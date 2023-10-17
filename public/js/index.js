// const { Chart } = require("chart.js");

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
		kpis.push(await createKpi("patrimoine", "/data/kpi/patrimoine", dateStr, "currency"));
		kpis.push(await createKpi("revenuMoy", "/data/kpi/revenu-moyen", dateStr, "currency"));
		kpis.push(await createKpi("depenseMoy", "/data/kpi/depense-moyen", dateStr, "currency"));

		graphs.push(await createGraph("repartitionPatrimoine", "/data/graph/1", dateStr));
	},
	onClose: function (Dates, dateStr, instance) {
		graphs.forEach(async (graph) => {
			await refrechGraph(graph, dateStr);
		});
		kpis.forEach(async (kpi) => {
			await refrechKpi(kpi, dateStr);
		});
	},
});

async function createGraph(canvaId, fetchUrl, dates, type = "") {
	Chart.defaults.color = "#ffffff";
	Chart.defaults.font.family = '"Titillium Web", sans-serif';
	Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
	Chart.defaults.plugins.tooltip.bodyColor = "#000000";
	Chart.defaults.plugins.tooltip.titleColor = "#000000";
	Chart.defaults.scale.grid.color = "rgba(255, 255, 255, 0.1)";

	let data = await getData(fetchUrl, dates);

	let ctx = document.getElementById(canvaId);
	ctx.width = ctx.parentElement.offsetWidth;
	ctx.height = ctx.parentElement.offsetHeight;

	let param = {};
	param.options = {
		responsive: false,
		interaction: {
			intersect: false,
			mode: "index",
		},
	};
	if (type != "") param.type = type;
	param.data = data;

	let graph = new Chart(ctx, param);

	graph.update();

	return {
		url: fetchUrl,
		chart: graph,
	};
}

async function refrechGraph(graph, dates) {
	let url = graph.url;
	let chart = graph.chart;

	let data = await getData(url, dates);

	chart.data = data;

	chart.update();
}

async function createKpi(elementId, fetchUrl, dates, type) {
	let data = await getData(fetchUrl, dates);

	if (!data) data = "No data";

	let element = document.getElementById("kpi_" + elementId).querySelector(".kpi--value");
	switch (type) {
		case "currency":
			element.textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data);
			break;

		case "percent":
			element.textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data);
			break;

		default:
			break;
	}

	return {
		url: fetchUrl,
		element,
		type,
	};
}

async function refrechKpi(kpi, dates) {
	let url = kpi.url;
	let element = kpi.element;

	let data = await getData(url, dates);

	if (!data) data = "No data";

	switch (kpi.type) {
		case "currency":
			element.textContent = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data);
			break;

		case "percent":
			element.textContent = new Intl.NumberFormat("fr-FR", { style: "percent" }).format(data);
			break;

		default:
			break;
	}
}

async function getData(url, dates) {
	let selectedDates = [];
	if (dates.includes("au")) {
		selectedDates = dates.split(" au ");
	} else {
		selectedDates.push(dates);
		selectedDates.push(dates);
	}

	let data = await fetch(url + "?startDate=" + selectedDates[0] + "&endDate=" + selectedDates[1]);
	data = await data.json();
	return data;
}
