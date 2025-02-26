document.addEventListener('keydown', function(event) {
    if (event.key === 'p') {
        showPopup();
    }
});

function showPopup() {
    const popupContainer = document.getElementById('popup-container');
    console.log(popupContainer); // Vérifie si le conteneur est bien trouvé
    
    if (!popupContainer) {
        console.error('popup-container introuvable');
        return;
    }

    // Créer la pop-up
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
    popup.style.left = `${Math.random() * (window.innerWidth - 300)}px`;

    // Ajouter le texte et le bouton
    const heading = document.createElement('h3');
    heading.textContent = "Vous avez gagné un iPhone!";

    const button = document.createElement('button');
    button.textContent = "Cliquez pour gagner encore plus!";
    
    // Ajouter l'événement au bouton
    button.addEventListener('click', function() {
        showPopup(); // Appeler à nouveau la fonction pour créer une nouvelle pop-up
    });

    // Ajouter tout à la pop-up
    popup.appendChild(heading);
    popup.appendChild(button);

    // Ajouter la pop-up au conteneur
    popupContainer.appendChild(popup);

    // Afficher la pop-up
    popup.style.display = 'block';

    // Faire disparaître la pop-up après 5 secondes
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}

