/* ==========================================
   NEXIFY WEB INTERACTIVITY (Vanilla JS)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {



    // --- EMAIL INTEGRATION (WEB3FORMS) ---
    // Get a free key at https://web3forms.com/ and paste it below to receive submissions directly in Gmail.
    const WEB3FORMS_ACCESS_KEY = "00241f2f-a565-4a04-8ff9-3e52735dcf3b";


    // --- STICKY HEADER SCROLL EVENT ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // --- ACTIVE NAV LINK UPDATES ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateActiveNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // --- MOBILE MENU NAVIGATION ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to keep performance high
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- START PROJECT BUTTONS PRE-FILL ---
    const startProjectBtns = document.querySelectorAll('.start-project-btn');
    startProjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const packageName = btn.getAttribute('data-package');
            const textMsg = document.getElementById('form-message');
            if (textMsg) {
                textMsg.value = `Hi Nexify, I am interested in the ${packageName}. Please get in touch with me to discuss our project!`;
                // Trigger label float
                textMsg.focus();
            }
            // Smooth scroll to contact
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- CONTACT FORM SUBMISSION HANDLER ---
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check (HTML5 does most of it)
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                showToast("Error", "Please fill out all required fields.", true);
                return;
            }

            // Web3Forms AJAX post
            const phone = document.getElementById('form-phone').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            }

            if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || !WEB3FORMS_ACCESS_KEY) {
                // Key is still placeholder, simulate delivery
                setTimeout(() => {
                    showToast("Simulated Request Received", "To receive requests in Gmail, enter your Web3Forms access key in app.js.");
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }, 1200);
                return;
            }

            // Real submission
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    from_name: "Nexify Customer Portal",
                    subject: "New Client Website Inquiry"
                })
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        showToast("Message Sent Successfully!", "We will review your inquiry and get back to you shortly.");
                        contactForm.reset();
                    } else {
                        showToast("Error Sending Request", json.message || "Please check your settings.", true);
                    }
                })
                .catch(error => {
                    console.error("Web3Forms error:", error);
                    showToast("Network Error", "Could not send form data. Please check your connection.", true);
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                });
        });
    }

    function showToast(title, msg, isError = false) {
        if (!toast) return;

        toastTitle.innerText = title;
        toastMsg.innerText = msg;

        const icon = toast.querySelector('.toast-icon');
        if (isError) {
            toast.style.borderColor = "#ff4757";
            if (icon) {
                icon.className = "fa-solid fa-circle-exclamation toast-icon";
                icon.style.color = "#ff4757";
            }
        } else {
            toast.style.borderColor = "var(--color-gold)";
            if (icon) {
                icon.className = "fa-solid fa-circle-check toast-icon";
                icon.style.color = "var(--color-gold)";
            }
        }

        toast.classList.add('active');

        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);
    }

    // --- FAQ ACCORDION ---
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const faqBody = faqItem.querySelector('.faq-body');
            const isActive = faqItem.classList.contains('active');

            // Close all active items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-body').style.maxHeight = null;
                item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle selected item
            if (!isActive) {
                faqItem.classList.add('active');
                faqBody.style.maxHeight = faqBody.scrollHeight + "px";
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- CURSOR TRACKING GLOW ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        });
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // --- 3D CARD TILT EFFECT ---
    const tiltCards = document.querySelectorAll('.pricing-card, .feature-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            // Limit rotation to a subtle 4 degrees maximum
            const rotateX = -(y - yc) / 20;
            const rotateY = (x - xc) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore original scales
            if (card.classList.contains('featured')) {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.03)';
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            }
        });
    });
});
