document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Account for fixed navbar height
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Form Validation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation passed (HTML5 'required' attribute handles empty fields)

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.textContent;

            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                formStatus.style.color = 'green';
                formStatus.style.marginTop = '1rem';

                contactForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1500);
        });
    }

    // Scroll Animation (Fade in on scroll)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Founders Carousel Logic
    const track = document.getElementById('foundersTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = document.querySelectorAll('.carousel-card');
        const cardCount = cards.length;

        function updateCarousel() {
            // Recalculate width every time in case of resize using the container width
            const containerWidth = document.querySelector('.carousel-container').clientWidth;

            // Ensure cards take full width of container
            cards.forEach(card => card.style.minWidth = `${containerWidth}px`);

            track.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < cardCount - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cardCount - 1; // Loop to end
            }
            updateCarousel();
        });

        // Initialize and handle window resize
        updateCarousel();
        window.addEventListener('resize', () => {
            // Debounce slightly or just call update
            updateCarousel();
        });
    }

    // Add scroll animation classes if needed, or rely on CSS animations
    // Currently using simple CSS animations on load for Hero, but could expand.
});
