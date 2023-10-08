let labels = document.querySelectorAll("section .label");

labels.forEach((label) => {
	label.addEventListener("click", (e) => {
		labels.forEach((label) => {
			label.parentElement.classList.remove("active");
		});

		e.target.parentElement.classList.add("active");
	});
});
