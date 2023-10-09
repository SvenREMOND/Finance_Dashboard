let labels = document.querySelectorAll("section .label");

labels.forEach((label) => {
	label.addEventListener("click", (e) => {
		labels.forEach((label) => {
			label.parentElement.classList.remove("active");
		});

		e.target.parentElement.classList.add("active");
	});
});

let categories = await fetch("/get-categories");
categories = await categories.json();

let transactionCategories = document.querySelector(".transaction--categories");
let parentSelector = document.getElementById("parent");
for (const parentId in categories) {
	if (Object.hasOwnProperty.call(categories, parentId)) {
		const dataCategorie = categories[parentId];

		// Ajout des input radio pour le formulaire d'ajout de transaction
		let field = document.createElement("div");
		field.classList.add("field");
		let parentLabel = document.createElement("label");
		parentLabel.textContent = dataCategorie.nom;
		field.append(parentLabel);
		let ul = document.createElement("ul");
		ul.classList.add("options");
		if (dataCategorie.child) {
			dataCategorie.child.forEach((child) => {
				let li = document.createElement("li");
				li.classList.add("option");

				let input = document.createElement("input");
				input.classList.add("option-input");
				input.type = "radio";
				input.name = "categorie";
				input.id = child.nom;
				input.value = child.id;
				li.append(input);

				let label = document.createElement("label");
				label.classList.add("option-label");
				label.textContent = child.nom;
				label.setAttribute("for", child.nom);
				li.append(label);

				ul.append(li);
			});
		}
		field.append(ul);
		transactionCategories.append(field);

		// Ajout des option pour le formulaire d'ajout de categorie
		let option = document.createElement("option");
		option.value = parentId;
		option.text = dataCategorie.nom;

		parentSelector.append(option);
	}
}

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
