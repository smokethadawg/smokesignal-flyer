// Main form handling for missing pet report
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('missing-pet-form');
    const messageDiv = document.getElementById('form-message');

    // Date validation helper
    function validateDate(dateString) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(dateString)) {
            return false;
        }
        
        const [month, day, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        
        return date.getMonth() === month - 1 && 
               date.getDate() === day && 
               date.getFullYear() === year;
    }

    // ZIP code validation
    function validateZipCode(zip) {
        return /^\d{5}$/.test(zip);
    }

    // Phone validation
    function validatePhone(phone) {
        if (!phone) return true; // Phone is optional
        return /[\d\s\-\(\)\+]+/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    // Email validation
    function validateEmail(email) {
        if (!email) return true; // Email is optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show message
    function showMessage(message, isError = false) {
        messageDiv.textContent = message;
        messageDiv.className = 'form-message ' + (isError ? 'error' : 'success');
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous messages
        messageDiv.className = 'form-message';
        messageDiv.textContent = '';

        // Validate date
        const dateMissing = document.getElementById('dateMissing').value;
        if (!validateDate(dateMissing)) {
            showMessage('Please enter a valid date in MM/DD/YYYY format', true);
            return;
        }

        // Validate ZIP code
        const zipCode = document.getElementById('zipCode').value;
        if (!validateZipCode(zipCode)) {
            showMessage('Please enter a valid 5-digit ZIP code', true);
            return;
        }

        // Validate phone
        const phone = document.getElementById('contactPhone').value;
        if (!validatePhone(phone)) {
            showMessage('Please enter a valid phone number', true);
            return;
        }

        // Validate email
        const email = document.getElementById('contactEmail').value;
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', true);
            return;
        }

        // Ensure at least one contact method
        if (!phone && !email) {
            showMessage('Please provide at least one contact method (phone or email)', true);
            return;
        }

        // Submit form
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Generating Flyer...';

        try {
            const response = await fetch('/api/submit-report', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message, false);
                
                // Show download link
                if (result.flyerUrl) {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = result.flyerUrl;
                    downloadLink.textContent = 'Download Your Flyer (PDF)';
                    downloadLink.className = 'download-btn';
                    downloadLink.download = true;
                    downloadLink.style.display = 'inline-block';
                    downloadLink.style.marginTop = '1rem';
                    
                    messageDiv.appendChild(document.createElement('br'));
                    messageDiv.appendChild(downloadLink);
                }

                // Reset form after success
                setTimeout(() => {
                    form.reset();
                }, 2000);
            } else {
                showMessage(result.error || 'Failed to submit report. Please try again.', true);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generate Flyer & Start Outreach';
        }
    });

    // Auto-format date input
    const dateInput = document.getElementById('dateMissing');
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9);
        }
        e.target.value = value;
    });

    // Auto-format ZIP code
    const zipInput = document.getElementById('zipCode');
    zipInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
});
