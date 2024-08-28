let personnes = JSON.parse(sessionStorage.getItem('personnes')) || [];
const personForm = document.getElementById('personForm');
const personTable = document.getElementById('personTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');

personForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
        const personne = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            rue: document.getElementById('rue').value,
            codePostal: document.getElementById('codePostal').value,
            ville: document.getElementById('ville').value
        };
        personnes.push(personne);
        sessionStorage.setItem('personnes', JSON.stringify(personnes));
        afficherPersonnes();
        personForm.reset();
    }
});

function validateForm() {
    let isValid = true;
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    
    if (!document.getElementById('nom').value) {
        document.getElementById('nomError').textContent = "Le nom est requis.";
        isValid = false;
    }
    if (!document.getElementById('prenom').value) {
        document.getElementById('prenomError').textContent = "Le prénom est requis.";
        isValid = false;
    }
    if (!/^\d{5}$/.test(document.getElementById('codePostal').value)) {
        document.getElementById('codePostalError').textContent = "Le code postal doit être de 5 chiffres.";
        isValid = false;
    }
    if (!document.getElementById('email').value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('emailError').textContent = "L'email n'est pas valide.";
        isValid = false;
    }
    if (!document.getElementById('ville').value) {
        document.getElementById('villeError').textContent = "La ville est requise.";
        isValid = false;
    }
    return isValid;
}

function afficherPersonnes() {

    personTable.innerHTML = '';
    const filteredPersonnes = personnes.filter(personne => 
        personne.nom.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        personne.prenom.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    filteredPersonnes.forEach((personne, index) => {
        const row = personTable.insertRow();
        row.insertCell(0).textContent = personne.nom;
        row.insertCell(1).textContent = personne.prenom;
        row.insertCell(2).textContent = personne.email;
        row.insertCell(3).textContent = personne.rue;
        row.insertCell(4).textContent = personne.codePostal;
        row.insertCell(5).textContent = personne.ville;
        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = `<button onclick="modifierPersonne(${index})">Modifier</button>
                                 <button onclick="supprimerPersonne(${index})">Supprimer</button>`;
    });
}

function modifierPersonne(index) {
    const personne = personnes[index];
    document.getElementById('nom').value = personne.nom;
    document.getElementById('prenom').value = personne.prenom;
    document.getElementById('email').value = personne.email;
    document.getElementById('rue').value = personne.rue;
    document.getElementById('codePostal').value = personne.codePostal;
    document.getElementById('ville').value = personne.ville;
    supprimerPersonne(index);
}

function supprimerPersonne(index) {
    personnes.splice(index, 1);
    sessionStorage.setItem('personnes', JSON.stringify(personnes));
    afficherPersonnes();
}

let sortDirections = []; 

function sortTable(columnIndex) {
    sortDirections[columnIndex] = !sortDirections[columnIndex];

    const sorted = [...personnes].sort((a, b) => {
        const valueA = Object.values(a)[columnIndex].toLowerCase();
        const valueB = Object.values(b)[columnIndex].toLowerCase();
        if (valueA > valueB) return sortDirections[columnIndex] ? 1 : -1;
        if (valueA < valueB) return sortDirections[columnIndex] ? -1 : 1;
        return 0;
    });

    personnes = sorted;
    afficherPersonnes();
    updateSortIndicators(columnIndex);
}

function updateSortIndicators(columnIndex) {
    const headers = document.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.textContent = header.textContent.replace(/[\u25B2\u25BC]/g, ''); 
        if (index === columnIndex) {
            header.textContent += sortDirections[index] ? ' \u25B2' : ' \u25BC'; 
        }
    });
}

searchInput.addEventListener('input', afficherPersonnes);

// Affichage initial
afficherPersonnes();