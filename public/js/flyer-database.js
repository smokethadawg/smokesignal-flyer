// Flyer Database page
document.addEventListener('DOMContentLoaded', async function() {
    const flyersGrid = document.getElementById('flyers-grid');

    try {
        const response = await fetch('/api/flyers');
        const flyers = await response.json();

        flyersGrid.innerHTML = '';

        if (flyers.length === 0) {
            flyersGrid.innerHTML = '<div class="no-results">No flyers in the database yet. Be the first to report a missing pet!</div>';
            return;
        }

        flyers.forEach(flyer => {
            const card = createFlyerCard(flyer);
            flyersGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading flyers:', error);
        flyersGrid.innerHTML = '<div class="no-results">Failed to load flyers. Please refresh the page.</div>';
    }
});

function createFlyerCard(flyer) {
    const card = document.createElement('div');
    card.className = 'flyer-card';

    const photoHtml = flyer.photoPath 
        ? `<img src="${flyer.photoPath}" alt="${flyer.petName}" class="flyer-photo" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2240%22%3E📷%3C/text%3E%3C/svg%3E'">`
        : `<div class="flyer-photo" style="display:flex;align-items:center;justify-content:center;font-size:3rem;">📷</div>`;

    card.innerHTML = `
        ${photoHtml}
        <div class="flyer-details">
            <h3>${escapeHtml(flyer.petName)}</h3>
            <p><strong>Breed:</strong> ${escapeHtml(flyer.breed || 'N/A')}</p>
            <p><strong>Color:</strong> ${escapeHtml(flyer.color || 'N/A')}</p>
            <p class="urgent"><strong>Missing Since:</strong> ${escapeHtml(flyer.dateMissing)}</p>
            <p><strong>Last Seen:</strong> ${escapeHtml(flyer.lastSeenLocation || 'N/A')}</p>
            <p><strong>ZIP:</strong> ${escapeHtml(flyer.zipCode)}</p>
            <a href="${flyer.flyerPath}" class="download-btn" download>Download Flyer</a>
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
