document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');

    // 1. MOBILE NAVIGATION
    function initNavigation() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = !navMenu.classList.contains('open');
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 600 && navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', false);
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 600 &&
                navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                e.target !== navToggle) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', false);
            }
        });
    }

    // 2. SMOOTH SCROLLING
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href === '#' || href === '#0' || !href.startsWith('#')) return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    if (window.innerWidth <= 600 && navMenu.classList.contains('open')) {
                        navMenu.classList.remove('open');
                        navToggle.setAttribute('aria-expanded', false);
                    }

                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 3. CONTACT FORM - EMAILJS + WHATSAPP
    function initContactForm() {
        if (!form) return;

        // Initialize EmailJS with YOUR Public Key
        emailjs.init("Xn6HvytzLB8_mnhrV");

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            // 1. Send email via EmailJS
            emailjs.send("iskaashi-gmail", "template_01rhhxf", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || 'Not provided',
                service: formData.service,
                message: formData.message,
                time: new Date().toLocaleString()
            }).then(function (response) {
                console.log('Email sent successfully!');
            }, function (error) {
                console.log('Email failed to send:', error);
            });

            // 2. Open WhatsApp with the same message
            const name = encodeURIComponent(formData.name.trim());
            const email = encodeURIComponent(formData.email.trim());
            const phone = encodeURIComponent(formData.phone.trim());
            const service = encodeURIComponent(formData.service);
            const message = encodeURIComponent(formData.message.trim());

            const whatsappMessage = `Hi, I'd like to enquire about your IT solutions.%0A%0A*Name:* ${name}%0A*Email:* ${email}${phone ? `%0A*Phone:* ${phone}` : ''}%0A*Service:* ${service}%0A*Message:* ${message}`;
            const whatsappURL = `https://wa.me/27658830687?text=${whatsappMessage}`;

            // Open WhatsApp after short delay
            setTimeout(() => {
                window.open(whatsappURL, '_blank');

                // Reset form and show success
                form.reset();
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = 'var(--accent)';
                }

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.textContent = 'Send Message';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }
                }, 3000);
            }, 1000);
        });
    }

    // 4. FULL SITE VIDEO
    function initFullSiteVideo() {
        const fullsiteVideo = document.querySelector('.fullsite-video');
        if (!fullsiteVideo) return;

        fullsiteVideo.addEventListener('canplay', () => {
            fullsiteVideo.play().catch(() => {
                // Silent fail for autoplay
            });
        });
    }

    // INITIALIZE EVERYTHING
    function initializeAll() {
        initNavigation();
        initSmoothScroll();
        initContactForm();
        initFullSiteVideo();
    }

    initializeAll();
});