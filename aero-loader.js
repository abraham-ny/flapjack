document.addEventListener('DOMContentLoaded', () => {
    // Feedback form submission handling
    const feedbackForm = document.getElementById('feedbackForm');
    const POSSIBLE_SCRIPT_URLS = [
    "https://script.google.com/macros/s/AKfycbx1QwPdF2t0VY7_jz8kKf39BuHyRjL-0nKfTkXhA9C-2YbZL7sHSs3lL1YExu-FpQ/exec",
    
    "https://script.google.com/macros/s/AKfycbx3Jd81Kp0Lr2xZ_1bF7WnPpQs2-mB4n6c92mP1hV4WHDJ5cP6A7x0L8N9Q7-2W0k/exec",
    "https://script.google.com/macros/s/AKfycbx9Ab4YkLmRf8Nj_T3p1f2Hq8Kc5Wj-B1UxVbP0rD3EzG7Xl5mS2k8yT9P0v3-QpM/exec",
    "https://script.google.com/macros/s/AKfycbz7Cm2WwGcQe5VdK8gA1sM9Ns0VbP6qRjXlN1fY2LtR4gT5pO8E1wJ0N2YbK7C/exec",
    
    "https://script.google.com/macros/s/AKfycbw2Lx5BdJgFq9M1Rk8Zy3TnF6CwB4d7QpXsUvK9E2G0XhY8sP1eVaD2K4NpT1B/exec",
    "https://script.google.com/macros/s/AKfycbp8Tq1SvEyRk6Yb_Wc3F9Mx2Pt0Nq-Z7UoRgLtK3CpQwB1dY6sT9mV4J1E5F7CbX/exec",
    "https://script.google.com/macros/s/AKfycbn3Qx2UdOj_Fb7YvLk9Vf8SqHw3RaN2KpTy-GoM4BjXwC5eD7rP1fQzE8N1HkJ6L/exec",
    
    "https://script.google.com/macros/s/AKfycbk9Jm4VcPiHn8RfBt2Sa3PwJq5GbL6YyMvTrE7HcKpA2xF4sD9eTbY0M1NvQ8R/exec",
    "https://script.google.com/macros/s/AKfycbv1Hg3SzTnQd5WmNb6Kx1FrLp0TgE9ZbCyWfP2JvRqU7oK5eM3cSdN8P6aHjF1X/exec",
    "https://script.google.com/macros/s/AKfycbx3Jd81Kp0Lr2xZ_1bF7WnPpQs2-mB4n6c92mP1hV4WHDJ5cP6A7x0L8N9Q7-2W0k/exec",
    "https://script.google.com/macros/s/AKfycbx9Ab4YkLmRf8Nj_T3p1f2Hq8Kc5Wj-B1UxVbP0rD345G7Xl5mS2k8yT9P0v3-QpM/exec",
    "https://script.google.com/macros/s/AKfycbz7Cm2WwGcQe5VdK8gA1sM9Ns0VbP6qRjXlN44Y2LtR4gT5pO8E1wJ0N2YbK7C/exec",
    
    "https://script.google.com/macros/s/AKfycbw2Lx5BdJgFq9M1Rk8Zy3TnF6CwB4d7QpXsUtK9E2G0XhY8sP1eVaD2K4NpT1B/exec",
    "https://script.google.com/macros/s/AKfycbp8Tq1SvEyRk6Yb_Wc3F9Mx2Pt0Nq-Z7UoRgLtttCpQwB1dY6sT9mV4J1E5F7CbX/exec",
    "https://script.google.com/macros/s/AKfycbn3Qx2UdOj_Fb7YvLk9Vt8iSqHw3RaN2KpTy-GoM4BjXwC5eD7rP1fQzE8N1HkJ6L/exec",
    
    "https://script.google.com/macros/s/AKfycbk9Jm4VcPiHn8RfBt2Sa3PwJq5GbL6YyMvTrE7HcKpA2xF4sD9eTbY0M1NvQ8R/exec",
    "https://script.google.com/macros/s/AKfycbv1Hg3SzTnQd5WmNb6Kx1FrLp0TgE9ZbCyWfP2JvRsU7oK5eM3cSdN8P6aHjF1X/exec",
    
    "https://script.google.com/macros/s/AKfycb4Pv6_ExGaLjC3JtSr1Dm8XyF-f0KbP9QvTgMbW7CqNpZ2dR6pO8E1zK4H0S-xL3A/exec",
    "https://script.google.com/macros/s/AKfycbx1QwPdF2t0VY7_jz8kKf39BuHyRjL-0nKfTkXhA9C-2YbZL7sHSs3lL1YExu-FpQ/exec",
    
    "https://script.google.com/macros/s/AKfycbx3Jd81Kp0Lr2xZ_1bF7WnPpQs2-mB4n6c92mP1hV4WHDJ5cP6A7x0L8N9Q7-2W0k/exec",
    "https://script.google.com/macros/s/AKfycbx9Ab4YkLmRf8Nj_T3p1f2Hq8Kc5Wj-B1UxVbP0rD3EzG7Xl5mS2k8yT9P0v3-QpM/exec",
    "https://script.google.com/macros/s/AKfycbz7Cm2WwGcQe5VdK8gA1sM9Ns0VbP6qRjXlN1fY2LtR4gT5pO8E1wJ0N2YbK7C/exec",
    
    "https://script.google.com/macros/s/AKfycbw2Lx5BdJgFq9M1Rk8Zy3TnF6CwB4d7QpXsUvK9E2G0XhY8sP1eVaD2K4NpT1B/exec",
    "https://script.google.com/macros/s/AKfycbp8Tq1SvEyRk6Yb_Wc3F9Mx2Pt0Nq-Z7UoRgLtK3CpQwB1dY6sT9mV4J1E5F7CbX/exec",
    "https://script.google.com/macros/s/AKfycbn3Qx2UdOj_Fb7YvLk9Vf8SqHw3RaN2KpTy-GoM4BjXwC5eD7rP1fQzE8N1HkJ6L/exec",
    
    "https://script.google.com/macros/s/AKfycbk9Jm4VcPiHn8RfBt2Sa3PwJq5GbL6YyMvTrE7HcKpA2xF4sD9eTbY0M1NvQ8R/exec",
    "https://script.google.com/macros/s/AKfycbv1Hg3SzTnQd5WmNb6Kx1FrLp0TgE9ZbCyWfP2JvRqU7oK5eM3cSdN8P6aHjF1X/exec",
    "https://script.google.com/macros/s/AKfycbx3Jd81Kp0Lr2xZ_1bF7WnPpQs2-mB4n6c92mP1hV4WHDJ5cP6A7x0L8N9Q7-2W0k/exec",
    "https://script.google.com/macros/s/AKfycbx9Ab4YkLmRf8Nj_T3p1f2Hq8Kc5Wj-B1UxVbP0rD345G7Xl5mS2k8yT9P0v3-QpM/exec",
    "https://script.google.com/macros/s/AKfycbz7Cm2WwGcQe5VdK8gA1sM9Ns0VbP6qRjXlN44Y2LtR4gT5pO8E1wJ0N2YbK7C/exec",
    
    "https://script.google.com/macros/s/AKfycbw2Lx5BdJgFq9M1Rk8Zy3TnF6CwB4d7QpXsUtK9E2G0XhY8sP1eVaD2K4NpT1B/exec",
    "https://script.google.com/macros/s/AKfycbp8Tq1SvEyRk6Yb_Wc3F9Mx2Pt0Nq-Z7UoRgLtttCpQwB1dY6sT9mV4J1E5F7CbX/exec",
    "https://script.google.com/macros/s/AKfycbn3Qx2UdOj_Fb7YvLk9Vt8iSqHw3RaN2KpTy-GoM4BjXwC5eD7rP1fQzE8N1HkJ6L/exec",
    
    "https://script.google.com/macros/s/AKfycbk9Jm4VcPiHn8RfBt2Sa3PwJq5GbL6YyMvTrE7HcKpA2xF4sD9eTbY0M1NvQ8R/exec",
    "https://script.google.com/macros/s/AKfycbv1Hg3SzTnQd5WmNb6Kx1FrLp0TgE9ZbCyWfP2JvRsU7oK5eM3cSdN8P6aHjF1X/exec",
    
    ];

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

            //@author @abraham-ny 2025 Nov 17 01:43pm : Server script verifies various parameters to prevent malicious use/unauthorised access
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxmPhatpAJqkN_SORYLpgdMUbkAvb-pUKYPsrwuzTmKHfkQ9WlcjoT8PLz2dD6-h8w/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-Origin": window.location.origin //server side will verify origin to prevent malicious use/unauthorised access
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