// Premium page functionality
function showPremiumForm() {
    document.getElementById('premium-signup-form').style.display = 'flex';
}

function hidePremiumForm() {
    document.getElementById('premium-signup-form').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const premiumForm = document.getElementById('premium-form');

    premiumForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        
        alert('Thank you for your interest in Premium, ' + fullName + '! Payment integration is currently in development. You will be notified when premium features are available.');
        
        hidePremiumForm();
        premiumForm.reset();
    });

    // Close form when clicking outside
    document.getElementById('premium-signup-form').addEventListener('click', function(e) {
        if (e.target === this) {
            hidePremiumForm();
        }
    });
});
