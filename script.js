document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Navbar scroll state ---------- */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    /* ---------- Scroll reveal ---------- */
    const revealItems = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach(item => revealObserver.observe(item));

    /* ---------- Founders carousel ---------- */
    const track = document.getElementById('foundersTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsWrap = document.getElementById('carouselDots');

    if (track) {
        const slides = track.querySelectorAll('.carousel-slide');
        let index = 0;
        let autoTimer;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir a la persona ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });
        const dots = dotsWrap.querySelectorAll('button');

        function render() {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            render();
            restartAuto();
        }

        function restartAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(index + 1), 6000);
        }

        nextBtn.addEventListener('click', () => goTo(index + 1));
        prevBtn.addEventListener('click', () => goTo(index - 1));

        // Swipe support
        let startX = null;
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 40) goTo(index + (diff < 0 ? 1 : -1));
            startX = null;
        });

        render();
        restartAuto();
    }

    /* ---------- Gallery scroll arrow (only present on multimedia.html) ---------- */
    const galleryScroller = document.getElementById('galleryScroller');
    const galleryScrollBtn = document.getElementById('galleryScrollBtn');
    if (galleryScroller && galleryScrollBtn) {
        galleryScrollBtn.addEventListener('click', () => {
            galleryScroller.scrollBy({ left: 340, behavior: 'smooth' });
        });
        const updateScrollBtn = () => {
            const atEnd = galleryScroller.scrollLeft + galleryScroller.clientWidth >= galleryScroller.scrollWidth - 10;
            galleryScrollBtn.style.opacity = atEnd ? '0' : '1';
            galleryScrollBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        };
        galleryScroller.addEventListener('scroll', updateScrollBtn, { passive: true });
        updateScrollBtn();
    }

    /* ---------- Gallery lightbox (only present on multimedia.html) ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxContent && lightboxClose) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const src = item.dataset.src;
                lightboxContent.innerHTML = type === 'video'
                    ? `<video src="${src}" controls autoplay playsinline></video>`
                    : `<img src="${src}" alt="">`;
                lightbox.classList.add('active');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightboxContent.innerHTML = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    }

    /* ---------- Gallery inline video preview autoplay on hover/viewport ---------- */
    document.querySelectorAll('.gallery-item[data-type="video"] video').forEach(video => {
        const item = video.closest('.gallery-item');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) video.play().catch(() => { });
                else video.pause();
            });
        }, { threshold: 0.5 });
        io.observe(item);
    });

    /* ---------- Copy alias ---------- */
    const copyBtn = document.getElementById('copyAliasBtn');
    const aliasText = document.getElementById('aliasText');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(aliasText.textContent.trim());
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
            } catch {
                /* clipboard unavailable, ignore */
            }
        });
    }

    /* ---------- Contact form ---------- */
    // Para activar el envío real: crea una cuenta gratis en https://formspree.io,
    // creá un formulario y reemplazá TU_ID_DE_FORMSPREE por el ID que te den.
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TU_ID_DE_FORMSPREE';

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = '';

            try {
                const res = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(contactForm)
                });

                if (res.ok) {
                    formStatus.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
                    formStatus.classList.add('ok');
                    contactForm.reset();
                } else {
                    throw new Error('submit failed');
                }
            } catch {
                formStatus.innerHTML = `No pudimos enviar el formulario. Escribinos directo a <a href="mailto:info@rawsonimagenes.com.ar">info@rawsonimagenes.com.ar</a>.`;
                formStatus.classList.add('err');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
