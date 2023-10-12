// const { Chart } = require("chart.js");

createChart("repartitionPatrimoine", {
	labels: ["January", "February", "March", "April"],
	datasets: [
		{
			type: "bar",
			label: "Bar Dataset",
			data: [10, 20, 30, 40],
		},
		{
			type: "line",
			label: "Line Dataset",
			data: [25, 30, 15, 25],
		},
	],
});

function createChart(canvaId, data) {
	Chart.defaults.color = "#ffffff";
	Chart.defaults.font.family = '"Titillium Web", sans-serif';
	new Chart(document.getElementById(canvaId), {
		data,
		options: {
			responsive: false,
			interaction: {
				intersect: false,
				mode: "index",
			},
		},
	});
}
