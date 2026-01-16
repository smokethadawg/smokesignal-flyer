// Search page functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchResults = document.getElementById('search-results');

    searchBtn.addEventListener('click', performSearch);
    clearBtn.addEventListener('click', clearSearch);

    // Allow Enter key to trigger search
    document.querySelectorAll('.search-filters input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });

    async function performSearch() {
        const searchAll = document.getElementById('searchAll').value.trim();
        const searchZip = document.getElementById('searchZip').value.trim();
        const searchBreed = document.getElementById('searchBreed').value.trim();
        const searchName = document.getElementById('searchName').value.trim();

        // Build query parameters
        const params = new URLSearchParams();
        if (searchAll) params.append('search', searchAll);
        if (searchZip) params.append('zipCode', searchZip);
        if (searchBreed) params.append('breed', searchBreed);
        if (searchName) params.append('petName', searchName);

        // Show loading
        searchResults.innerHTML = '<div class="loading">Searching...</div>';

        try {
            const response = await fetch(`/api/flyers?${params.toString()}`);
            const flyers = await response.json();

            searchResults.innerHTML = '';

            if (flyers.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No matching flyers found. Try different search criteria.</div>';
                return;
            }

            flyers.forEach(flyer => {
                const card = createFlyerCard(flyer);
                searchResults.appendChild(card);
            });
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="no-results">Search failed. Please try again.</div>';
        }
    }

    function clearSearch() {
        document.getElementById('searchAll').value = '';
        document.getElementById('searchZip').value = '';
        document.getElementById('searchBreed').value = '';
        document.getElementById('searchName').value = '';
        searchResults.innerHTML = '<div class="no-results">Enter search criteria and click Search</div>';
    }

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
});
