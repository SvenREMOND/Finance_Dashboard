// Dépliage des sections
let labels = document.querySelectorAll("section .label");

labels.forEach((label) => {
	label.addEventListener("click", (e) => {
		labels.forEach((label) => {
			label.parentElement.classList.remove("active");
		});

		e.target.parentElement.classList.add("active");
	});
});

// Récupération et ajout des categories dans les formulaires
let categories = await fetch("/get-categories");
categories = await categories.json();

let transactionCategories = document.querySelector(".transaction--categories");
let parentSelector = document.getElementById("categorie_parent");
for (const parentId in categories) {
	if (Object.hasOwnProperty.call(categories, parentId)) {
		const dataCategorie = categories[parentId];

		// Ajout des input radio pour le formulaire d'ajout de transaction
		if (parentId != 3) {
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
					input.name = "transaction_categorie";
					input.id = "transaction_ " + parentId + child.nom;
					input.value = child.id;
					li.append(input);

					let label = document.createElement("label");
					label.classList.add("option-label");
					label.textContent = child.nom;
					label.setAttribute("for", "transaction_ " + parentId + child.nom);
					li.append(label);

					ul.append(li);
				});
			}
			field.append(ul);
			transactionCategories.append(field);
		}

		// Ajout des option pour le formulaire d'ajout de categorie
		let option = document.createElement("option");
		option.value = parentId;
		option.text = dataCategorie.nom;

		parentSelector.append(option);
	}
}

// Récupération et ajout des comptes dans les formulaires
let comptes = await fetch("/get-comptes");
comptes = await comptes.json();

let ulCompte = document.querySelector(".compte--liste");
comptes.forEach((compte) => {
	let li = document.createElement("li");
	li.classList.add("option");

	let input = document.createElement("input");
	input.classList.add("option-input");
	input.type = "radio";
	input.name = "etat_compte";
	input.id = "etat_" + compte.nom;
	input.value = compte.id;
	li.append(input);

	let label = document.createElement("label");
	label.classList.add("option-label");
	label.textContent = compte.nom;
	label.setAttribute("for", "etat_" + compte.nom);
	li.append(label);

	ulCompte.append(li);
});

// Récupération et ajout des epargne dans les formulaires
let epargnes = await fetch("/get-epargnes");
epargnes = await epargnes.json();

let ulEpargne = document.querySelector(".epargne--liste");
epargnes.forEach((epargne) => {
	let li = document.createElement("li");
	li.classList.add("option");

	let input = document.createElement("input");
	input.classList.add("option-input");
	input.type = "radio";
	input.name = "invesstissement_compte";
	input.id = "invesstissement_" + epargne.nom;
	input.value = epargne.id;
	li.append(input);

	let label = document.createElement("label");
	label.classList.add("option-label");
	label.textContent = epargne.nom;
	label.setAttribute("for", "invesstissement_" + epargne.nom);
	li.append(label);

	ulEpargne.append(li);
});

// Focus des input
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
			el = document.querySelector(`[for="${el.id}"]`);
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
