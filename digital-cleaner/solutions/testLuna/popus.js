document.addEventListener('keydown', function(event) {
    if (event.key === 'p') {
        showPopup();
    }
});

let popupCount = 0;

function showPopup() {
    const popupContainer = document.getElementById('popup-container');
    
    // Create the popup
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
    popup.style.left = `${Math.random() * (window.innerWidth - 300)}px`;

    popup.innerHTML = `
        <h3>Vous avez gagnÃ© un iPhone!</h3>
        <button onclick="showPopup()">Cliquez pour gagner encore plus!</button>
    `;

    // Append the popup to the container
    popupContainer.appendChild(popup);
    
    // Show the popup with a delay for a smooth appearance
    setTimeout(() => {
        popup.style.display = 'block';
    }, 50);
    
    popupCount++;
    
    // Optional: Hide popups after a delay (e.g., 5 seconds)
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}