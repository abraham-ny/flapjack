document.addEventListener('DOMContentLoaded', () => {
    // Feedback form submission handling
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = '';
            formMessage.className = '';

            const formData = new FormData(feedbackForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                feedback: formData.get('feedback'),
                source: formData.get('source'),
                type: formData.get('type')
            };

            if (!data.feedback.trim()) {
                formMessage.textContent = 'Please enter your feedback.';
                formMessage.className = 'text-danger';
                return;
            }

            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxa97C9wlpcODyevKT45Yy1sckbElfVONpsPwpI-oiW6cIiJ2nk91623LkE-viKRMrD_Q/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // Since mode: 'no-cors' is used, we cannot check response.ok
                formMessage.textContent = 'Thank you for your feedback!';
                formMessage.className = 'text-success';
                feedbackForm.reset();
            } catch (error) {
                formMessage.textContent = 'An error occurred while submitting your feedback. Please try again later.';
                formMessage.className = 'text-danger';
            }
        });
    }
});