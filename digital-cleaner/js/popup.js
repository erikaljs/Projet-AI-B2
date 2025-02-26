document.addEventListener('keydown', function(event) {
    if (event.key === 'p') {
        showPopup();
    }
});

// Liste de messages aléatoires
const messages = [
    "🎉 Vous avez gagné un iPhone !",
    "🎁 Félicitations ! Cliquez pour réclamer votre cadeau.",
    "🔥 Vous êtes le 1 000 000ème visiteur !",
    "📩 Un nouveau message important vous attend.",
    "⚠️ Votre ordinateur est infecté ! Cliquez ici pour réparer.",
    "💰 Vous avez débloqué un bonus secret !",
    "🔒 Votre compte a été compromis ! Vérifiez votre sécurité.",
    "🚀 Accédez à une offre exclusive, cliquez ici !",
    "💎 Félicitations, vous avez gagné une carte-cadeau !",
    "📢 Alerte ! Votre abonnement expire bientôt, renouvelez maintenant !",
    "🎶 Découvrez les secrets pour devenir riche rapidement !",
    "📞 Un inconnu veut vous contacter, cliquez ici pour voir qui c'est !",
    "💻 Votre PC tourne lentement ? Installez cet outil GRATUIT !",
    "🛒 Code promo exclusif : -90% sur tout !",
    "🤖 Une intelligence artificielle veut discuter avec vous !",
    "🛑 ATTENTION : vous avez été sélectionné pour une récompense !",
    "🚨 Alerte : votre forfait internet est sur le point d'expirer !",
    "🔔 Vous venez de recevoir une invitation secrète !",
    "🔮 Votre avenir est écrit, cliquez ici pour le découvrir !",
    "💥 Une nouvelle opportunité incroyable vous attend !"
];

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
    
    // Choisir un texte aléatoire
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Ajouter le texte et le bouton
    const heading = document.createElement('h3');
    heading.textContent = randomMessage;
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
