/* ==========================================
   WEDDING WEBSITE - MAIN JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavbar();
    initCountdown();
    initScrollAnimations();
    initGallery();
    initFAQ();
    initRSVPForm();
    initMusicToggle();
    initBackToTop();
    initSmoothScroll();
});

/* ==========================================
   PRELOADER
   ========================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }
    
    // Hide preloader when page loads
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hidePreloader, 1000);
        });
    }
    
    // Fallback: Hide preloader after 3 seconds max (in case resources fail to load)
    setTimeout(hidePreloader, 3000);
}

/* ==========================================
   NAVIGATION
   ========================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        updateActiveLink();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ==========================================
   COUNTDOWN TIMER
   ========================================== */
function initCountdown() {
    // Wedding date: January 23, 2026 at 9:00 AM IST
    const weddingDate = new Date(2026, 0, 23, 9, 0, 0).getTime(); // Month is 0-indexed (0 = January)
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Wedding day has passed
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = days;
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================
   GALLERY
   ========================================== */
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update filtered items array
            filteredItems = filter === 'all' 
                ? [...galleryItems] 
                : [...galleryItems].filter(item => item.dataset.category === filter);
        });
    });
    
    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = filteredItems.indexOf(this);
            openLightbox(this.querySelector('img').src);
        });
    });
    
    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        lightboxImg.src = filteredItems[currentIndex].querySelector('img').src;
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        lightboxImg.src = filteredItems[currentIndex].querySelector('img').src;
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    
    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

/* ==========================================
   FAQ ACCORDION
   ========================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================
   RSVP FORM
   ========================================== */
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
    const attendingDetails = document.querySelector('.attending-details');
    const successMessage = document.getElementById('rsvp-success');
    
    // Show/hide attending details based on selection
    attendanceInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'yes') {
                attendingDetails.classList.add('show');
            } else {
                attendingDetails.classList.remove('show');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        // For now, we'll just show the success message
        console.log('RSVP Data:', data);
        
        // Simulate form submission
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Trigger confetti effect
            createConfetti();
        }, 1500);
    });
}

/* ==========================================
   CONFETTI EFFECT
   ========================================== */
function createConfetti() {
    const colors = ['#b76e79', '#d4a5a5', '#c9a86c', '#f8e8e8', '#d4af37'];
    const confettiCount = 100;
    
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);
        
        // Trigger animation
        setTimeout(() => {
            confetti.classList.add('active');
        }, 50);
    }
    
    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, 5000);
}

/* ==========================================
   MUSIC TOGGLE
   ========================================== */
function initMusicToggle() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const icon = musicBtn.querySelector('i');
    let isPlaying = false;
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            icon.className = 'fas fa-volume-mute';
            musicBtn.classList.remove('playing');
        } else {
            audio.play().catch(e => {
                console.log('Audio autoplay blocked:', e);
            });
            icon.className = 'fas fa-volume-up';
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ==========================================
   BACK TO TOP BUTTON
   ========================================== */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   PARALLAX EFFECT (Optional enhancement)
   ========================================== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(window.scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ==========================================
   TYPING EFFECT (For hero text)
   ========================================== */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ==========================================
   LAZY LOADING IMAGES
   ========================================== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ==========================================
   FORM VALIDATION HELPERS
   ========================================== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return phone === '' || re.test(phone);
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ==========================================
   TOUCH DEVICE DETECTION
   ========================================== */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Add touch class to body for CSS hooks
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

/* ==========================================
   CONSOLE EASTER EGG
   ========================================== */
console.log('%c💕 Surendra & Pradeepa 💕', 'font-size: 24px; color: #b76e79; font-family: cursive;');
console.log('%cJanuary 23, 2026', 'font-size: 16px; color: #666;');
console.log('%cWe\'re getting married! 💍', 'font-size: 14px; color: #c9a86c;');
