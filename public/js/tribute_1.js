// Tribute page functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const successForm = document.getElementById('success-form');
    const memorialForm = document.getElementById('memorial-form');

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show/hide tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });

    // Success story form submission
    successForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const petName = document.getElementById('successPetName').value;
        const story = document.getElementById('successStory').value;
        
        alert('Thank you for sharing your success story about ' + petName + '! Your story will be reviewed and added to our gallery soon.');
        
        successForm.reset();
    });

    // Memorial form submission
    memorialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const petName = document.getElementById('memorialPetName').value;
        
        alert('Memorial created for ' + petName + '. Your tribute will be reviewed and added to our memorial gallery soon.');
        
        memorialForm.reset();
    });
});
