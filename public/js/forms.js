let labels = document.querySelectorAll("section .label");

labels.forEach((label) => {
	label.addEventListener("click", (e) => {
		labels.forEach((label) => {
			label.parentElement.classList.remove("active");
		});

		e.target.parentElement.classList.add("active");
	});
});

class magicFocus {
	reset;
	focus;

	constructor(form) {
		this.focus = document.createElement("div");
		this.focus.classList.add("magic-focus");
		form.append(this.focus);

		form.querySelectorAll("input, textarea, select").forEach((input) => {
			input.addEventListener("focus", (e) => {
				this.show(e.target);
			});
			input.addEventListener("blur", (e) => {
				this.hide(e.target);
			});
		});
	}

	show(el) {
		clearTimeout(this.reset);

		if (el.type == "radio") {
			el = document.querySelector(`[for=${el.id}]`);
		}

		this.focus.style.top = (el.offsetTop || 0) + "px";
		this.focus.style.left = (el.offsetLeft || 0) + "px";
		this.focus.style.width = (el.offsetWidth || 0) + "px";
		this.focus.style.height = (el.offsetHeight || 0) + "px";
	}

	hide(el) {
		this.reset = setTimeout(() => {
			this.focus.removeAttribute("style");
		});
	}
}

document.querySelectorAll("form").forEach((form) => {
	new magicFocus(form);
});
