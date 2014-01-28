window.onload = function(){

	var data = [{
		label: "Thing A",
		percent: 24,
	}, {
		label: "Thing B",
		percent: 16,
	}, {
		label: "Thing C",
		percent: 12,
	}, {
		label: "Thing D",
		percent: 10,
	}, {
		label: "Thing E",
		percent: 10,
	}, {
		label: "Thing F",
		percent: 8,
	}, {
		label: "Thing G",
		percent: 5,
	}, {
		label: "Thing H",
		percent: 5,
	}, {
		label: "Thing I",
		percent: 5,
	}, {
		label: "Thing J",
		percent: 5,
	}];

	window.TestPieCanvas = new PieCanvas(300, 300, 30, 35, data, 75);
};