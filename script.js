function showTime() {
	document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
	showTime();
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
	const modelTranslations = {
		'BEL': 'Béluga',
		'DUG': 'Dugong'
	};

	const partTranslations = {
		'SIE': 'Siège',
		'DOS': 'Dossier',
		'GAU': 'Accoudoir Gauche',
		'DRO': 'Accoudoir Droit',
		'CEN': 'Centre'
	};

	const colorTranslations = {
		'ROU': 'Rouge',
		'NOI': 'Noir',
		'BLA': 'Blanc',
		'BLE': 'Bleu',
		'VER': 'Vert',
		'JAU': 'Jaune',
		'MEN': 'Menthe',
		'PEC': 'Pêche'
	};

	function generateSKU() {
		const produit = document.getElementById("produit").value;
		const assise = document.getElementById("assise").value;
		const dossier = document.getElementById("dossier").value;
		const piedGauche = document.getElementById("piedGauche").value;
		const piedDroit = document.getElementById("piedDroit").value;

		const skuParts = [
			{ code: produit, part: "SIE", value: assise },
			{ code: produit, part: "DOS", value: dossier },
			{ code: produit, part: "GAU", value: piedGauche },
			{ code: produit, part: "DRO", value: piedDroit }
		];

		const finalSKU = skuParts.map(part => `${part.code}${part.part}${part.value}`).join("");

		const skuList = document.getElementById("skuList");
		const listItem = document.createElement("div");
		listItem.classList.add("sku-item");

		const skuText = document.createElement("span");
		skuText.textContent = finalSKU;
		listItem.appendChild(skuText);

		const quantityInput = document.createElement("input");
		quantityInput.type = "number";
		quantityInput.min = "1";
		quantityInput.value = "1";
		quantityInput.classList.add("sku-quantity");
		listItem.appendChild(quantityInput);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Supprimer";
		deleteButton.classList.add("button", "delete");
		deleteButton.addEventListener("click", () => {
			skuList.removeChild(listItem);
		});
		listItem.appendChild(deleteButton);

		skuList.appendChild(listItem);

		document.getElementById("copySKUButton").disabled = false;
		document.getElementById("requestQuoteButton").disabled = false;
	}

	function copySKU() {
		const skuListItems = document.querySelectorAll("#skuList .sku-item");
		let skuText = Array.from(skuListItems).map(item => {
			const sku = item.querySelector("span").textContent;
			const quantity = parseInt(item.querySelector(".sku-quantity").value, 10);
			return Array(quantity).fill(sku).join("\n");
		}).join("\n");
		navigator.clipboard.writeText(skuText).then(() => {
			alert("SKU(s) copié(s) :\n" + skuText);
		}).catch(err => {
			console.error("Échec de la copie du SKU :", err);
		});
	}

	function requestQuote() {
		const skuListItems = document.querySelectorAll("#skuList .sku-item");
		let skuDetails = Array.from(skuListItems).map(item => {
			const sku = item.querySelector("span").textContent;
			const quantity = item.querySelector(".sku-quantity").value;
			return `${sku} - Quantité: ${quantity}`;
		}).join("\n");

		const subject = encodeURIComponent("Demande de devis pour SKUs");
		const body = encodeURIComponent(`Bonjour Léo,

J'espère que vous allez bien. Je vous contacte pour vous demander un devis pour les produits suivants :

${skuDetails}

Je vous remercie par avance pour votre retour. N'hésitez pas à me contacter si vous avez besoin de plus d'informations.

Bien cordialement,
[Votre Nom]`);

		window.location.href = `mailto:leo.gaudenz@polimair.fr?subject=${subject}&body=${body}`;
	}

	function reverseSKU(skus) {
		const skuList = skus.match(/.{36}/g) || [];
		const pattern = /(...)(...)(...)/g;
		let output = "";

		output += `<h2>Nombre total de produits : ${skuList.filter(sku => sku.length === 36).length}</h2>`;

		skuList.forEach((sku, index) => {
			if (sku.length === 36) {
				output += `<h3>Produit ${index + 1} : SKU - ${sku}</h3>`;
				output += `<table><tr><th>Modèle</th><th>Partie</th><th>Couleur</th></tr>`;
				let match;
				while ((match = pattern.exec(sku)) !== null) {
					let model = modelTranslations[match[1]] || match[1];
					let part = partTranslations[match[2]] || match[2];
					let color = colorTranslations[match[3]] || match[3];
					output += `<tr><td>${model}</td><td>${part}</td><td>${color}</td></tr>`;
				}
				output += `</table>`;
			}
		});

		document.getElementById("outputArea").innerHTML = output;
	}

	document.getElementById("generateSKUButton").addEventListener("click", generateSKU);
	document.getElementById("copySKUButton").addEventListener("click", copySKU);
	document.getElementById("reverseSKUButton").addEventListener("click", () => {
		reverseSKU(document.getElementById('skuInput').value);
	});
	document.getElementById("requestQuoteButton").addEventListener("click", requestQuote);

	// Désactiver le bouton de copie par défaut
	document.getElementById("copySKUButton").disabled = true;
	document.getElementById("requestQuoteButton").disabled = true;
});