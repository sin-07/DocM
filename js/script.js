/*
==========================================
  ORTHOPEDIC DOCTOR WEBSITE - JAVASCRIPT
  Author: Professional Web Development
==========================================
*/

// ==========================================
// MOBILE MENU
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    // Open mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenuOverlay.classList.remove('opacity-0', 'invisible');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    }

    // Close mobile menu
    function closeMobileMenuHandler() {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuOverlay.classList.add('opacity-0', 'invisible');
        document.body.style.overflow = ''; // Restore scroll
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeMobileMenuHandler);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenuHandler);
    }

    // Close menu when clicking on anchor links
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a[href^="#"]');
    mobileMenuLinks?.forEach(link => {
        link.addEventListener('click', closeMobileMenuHandler);
    });
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function to limit function execution rate
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ==========================================
// PAGE LOADER
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.querySelector('.page-loader');
    
    // Hide loader after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (pageLoader && typeof pageLoader.classList !== 'undefined') {
                pageLoader.classList.add('hidden');
                // Remove from DOM after animation completes
                setTimeout(function() {
                    if (pageLoader && typeof pageLoader.style !== 'undefined') {
                        pageLoader.style.display = 'none';
                    }
                }, 500);
            }
        }, 500);
    });
});

// ==========================================
// PROGRESS BAR
// ==========================================

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    if (progressBar && typeof progressBar.style !== 'undefined') {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', debounce(updateProgressBar, 10));

// ==========================================
// STICKY HEADER
// ==========================================

const header = document.querySelector('.main-header');
const nav = document.querySelector('.main-nav');
const headerHeight = header ? header.offsetHeight : 0;

function handleStickyHeader() {
    const scrollPosition = window.pageYOffset;
    
    if (header) {
        if (scrollPosition > headerHeight) {
            header.classList.add('sticky');
            if (nav) {
                nav.classList.add('sticky');
            }
            document.body.style.paddingTop = headerHeight + 'px';
        } else {
            header.classList.remove('sticky');
            if (nav) {
                nav.classList.remove('sticky');
            }
            document.body.style.paddingTop = '0';
        }
    }
}

window.addEventListener('scroll', debounce(handleStickyHeader, 10));

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.body;

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (mainNav && mainNav.classList.contains('active')) {
        if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    }
});

// ==========================================
// NAVIGATION DROPDOWN
// ==========================================

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown-menu');
    
    if (dropdown) {
        // For mobile - toggle on click
        if (window.innerWidth <= 1023) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        }
    }
});

// Handle resize
window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 1023) {
        navItems.forEach(item => item.classList.remove('active'));
        if (mainNav) {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            body.style.overflow = 'auto';
        }
    }
}, 100));

// ==========================================
// HERO SLIDER
// ==========================================

class HeroSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;
        
        this.slides = this.slider.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            this.startAutoPlay();
        }
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }
    
    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.slideInterval);
    }
}

// Initialize hero slider
const heroSlider = new HeroSlider('.hero-slider');

// ==========================================
// STATISTICS COUNTER ANIMATION
// ==========================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-content h3');
        this.animated = false;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', debounce(() => {
            this.checkPosition();
        }, 100));
    }
    
    checkPosition() {
        if (this.animated) return;
        
        const statsSection = document.querySelector('.statistics-section');
        if (!statsSection) return;
        
        if (isInViewport(statsSection)) {
            this.animateCounters();
            this.animated = true;
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current).toLocaleString() + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString() + '+';
                }
            };
            
            updateCounter();
        });
    }
}

// Initialize counter animation
const counterAnimation = new CounterAnimation();

// ==========================================
// CLINIC GALLERY CAROUSEL
// ==========================================

class ClinicCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
        this.prevBtn = this.carousel.querySelector('.prev-btn');
        this.nextBtn = this.carousel.querySelector('.next-btn');
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.slideWidth = this.slides[0].offsetWidth;
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        window.addEventListener('resize', debounce(() => {
            this.slidesToShow = this.getSlidesToShow();
            this.slideWidth = this.slides[0].offsetWidth;
            this.updateCarousel();
        }, 200));
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width <= 767) return 1;
        if (width <= 1023) return 2;
        return 3;
    }
    
    updateCarousel() {
        const offset = -this.currentIndex * (this.slideWidth + 10);
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.slides.length - this.slidesToShow;
        }
    }
    
    next() {
        if (this.currentIndex < this.slides.length - this.slidesToShow) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
}

// Initialize clinic carousel
const clinicCarousel = new ClinicCarousel('.clinic-carousel');

// ==========================================
// TESTIMONIALS CAROUSEL
// ==========================================

class TestimonialsCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.testimonials-track');
        this.slides = Array.from(this.track.querySelectorAll('.testimonial-card'));
        this.prevBtn = this.carousel.querySelector('.prev-btn');
        this.nextBtn = this.carousel.querySelector('.next-btn');
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        window.addEventListener('resize', debounce(() => {
            this.slidesToShow = this.getSlidesToShow();
            this.updateCarousel();
        }, 200));
        
        this.startAutoPlay();
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width <= 767) return 1;
        if (width <= 1023) return 2;
        return 3;
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 20;
        const offset = -this.currentIndex * (slideWidth + gap);
        this.track.style.transform = `translateX(${offset}px)`;
    }
    
    next() {
        if (this.currentIndex < this.slides.length - this.slidesToShow) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.slides.length - this.slidesToShow;
        }
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize testimonials carousel
const testimonialsCarousel = new TestimonialsCarousel('.testimonials-carousel');

// ==========================================
// READ MORE FUNCTIONALITY
// ==========================================

const readMoreBtns = document.querySelectorAll('.read-more-btn');

readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const reviewText = this.previousElementSibling;
        const fullText = reviewText.getAttribute('data-full-text');
        const shortText = reviewText.getAttribute('data-short-text');
        
        if (this.textContent === 'Read more') {
            reviewText.textContent = fullText;
            this.textContent = 'Read less';
        } else {
            reviewText.textContent = shortText;
            this.textContent = 'Read more';
        }
    });
});

// ==========================================
// VERTICAL GALLERY CAROUSEL
// ==========================================

class VerticalCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.slides = this.carousel.querySelectorAll('.vertical-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');
        
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        this.startAutoPlay();
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
    
    next() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prev() {
        this.showSlide(this.currentSlide - 1);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize vertical carousel
const verticalCarousel = new VerticalCarousel('.vertical-carousel');

// ==========================================
// FAQ ACCORDION
// ==========================================

// Pattern 1: index.html FAQ (.faq-question / .faq-answer with chevron icon)
// Pattern 1: index.html FAQ - handled by inline toggleIndexFaq function

// Pattern 2: Service page FAQs handled by inline script in each HTML page

// ==========================================
// APPOINTMENT MODAL
// ==========================================

const modal = document.getElementById('appointmentModal');
const appointmentBtns = document.querySelectorAll('.btn-appointment, [data-modal="appointment"]');
const closeModal = document.querySelector('.close-modal');
const appointmentForm = document.getElementById('appointmentForm');

// Open modal
if (modal && appointmentBtns.length > 0) {
    appointmentBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

// Close modal
if (closeModal && modal) {
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (modal) {
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        const errorMessages = this.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
        
        let isValid = true;
        
        // Get form fields
        const name = this.querySelector('#name');
        const phone = this.querySelector('#phone');
        const email = this.querySelector('#email');
        const date = this.querySelector('#date');
        const time = this.querySelector('#time');
        
        // Validate name
        if (name.value.trim() === '') {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        // Validate phone
        const phonePattern = /^[0-9]{10}$/;
        if (phone.value.trim() === '') {
            showError(phone, 'Phone number is required');
            isValid = false;
        } else if (!phonePattern.test(phone.value.replace(/\D/g, ''))) {
            showError(phone, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate date
        if (date.value === '') {
            showError(date, 'Date is required');
            isValid = false;
        }
        
        // Validate time
        if (time.value === '') {
            showError(time, 'Time is required');
            isValid = false;
        }
        
        if (isValid) {
            submitForm(this);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorMessage = formGroup.querySelector('.error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    input.style.borderColor = '#ff0000';
}

function submitForm(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = form.querySelector('.form-message');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin btn-loader"></i>';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        formMessage.textContent = 'Thank you! Your appointment request has been submitted successfully. We will contact you soon.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Appointment';
        
        // Hide success message and close modal after 3 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 3000);
    }, 2000);
}

// Clear error on input
const formInputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
formInputs.forEach(input => {
    input.addEventListener('input', function() {
        this.style.borderColor = '#ddd';
        const errorMessage = this.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

const backToTopBtn = document.querySelector('.back-to-top');

function handleBackToTop() {
    if (backToTopBtn && typeof backToTopBtn.classList !== 'undefined') {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

window.addEventListener('scroll', debounce(handleBackToTop, 100));

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// FLOATING BUTTONS
// ==========================================


// Floating WhatsApp and Call buttons (match index.html)
const whatsappBtn = document.querySelector('a[href^="https://wa.me/"]');
const callBtn = document.querySelector('a[href^="tel:+91-7991153348"]');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
        // Only override if you want custom behavior, otherwise let default work
        // e.preventDefault();
        // window.open(this.href, '_blank');
    });
}

if (callBtn) {
    callBtn.addEventListener('click', function(e) {
        // Only override if you want custom behavior, otherwise let default work
        // e.preventDefault();
        // window.location.href = this.href;
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#appointmentModal') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            // Defensive: only try to close menu if elements exist
            const mainNav = document.querySelector('.main-nav');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            const header = document.querySelector('.main-header');
            const offset = header && header.classList.contains('sticky') ? 140 : 0;
            smoothScrollTo(targetElement, offset);
        }
    });
});

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// ANIMATE ON SCROLL
// ==========================================

function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .blog-card, .stat-item, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}



window.addEventListener('scroll', debounce(animateOnScroll, 50));
window.addEventListener('load', animateOnScroll);

// ==========================================
// SERVICE CARD HOVER EFFECTS
// ==========================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ==========================================
// CONSOLE INITIALIZATION MESSAGE
// ==========================================

// console.log('%cDr. Test Orthopedic Website Loaded Successfully! ', 'background: #00447c; color: #ffffff; font-size: 16px; padding: 10px; border-radius: 5px;');
// console.log('%cVersion 1.0 | Professional Medical Website', 'color: #676767; font-size: 12px;');

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

if (window.performance) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
        }, 0);
    });
}

// ==========================================
// FORM AUTO-FILL DATE RESTRICTION
// ==========================================

const dateInput = document.querySelector('#date');
if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ==========================================
// PREVENT FORM RESUBMISSION
// ==========================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ==========================================
// ERROR HANDLING
// ==========================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // You can add error reporting service here
});

// ==========================================
// BROWSER COMPATIBILITY CHECK
// ==========================================

(function() {
    // Check for essential features
    const requiredFeatures = {
        'querySelector': document.querySelector,
        'addEventListener': window.addEventListener,
        'classList': document.documentElement.classList,
        'localStorage': typeof(Storage) !== 'undefined'
    };
    
    let unsupportedFeatures = [];
    
    for (let feature in requiredFeatures) {
        if (!requiredFeatures[feature]) {
            unsupportedFeatures.push(feature);
        }
    }
    
    if (unsupportedFeatures.length > 0) {
        console.warn('Your browser does not support:', unsupportedFeatures.join(', '));
        console.warn('Please update your browser for the best experience.');
    }
})();

// ==========================================
// SCROLL ANIMATIONS FOR SERVICE SECTIONS
// ==========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ==========================================
// INLINE FAQ TOGGLE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const heading = item.querySelector('h4');
        const content = item.querySelector('p');
        const icon = heading.querySelector('i');
        
        // Hide content initially if it has plus icon
        if (icon && icon.classList.contains('fa-plus')) {
            if (content) content.style.display = 'none';
        }
        
        item.addEventListener('click', function() {
            const isOpen = content && content.style.display !== 'none';
            
            if (content) {
                if (isOpen) {
                    content.style.display = 'none';
                    if (icon) {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                } else {
                    content.style.display = 'block';
                    if (icon) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    }
                }
            }
        });
    });
});

// ==========================================
// SIDEBAR SERVICE NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-widget h4');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            const serviceName = this.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            const serviceSection = document.getElementById(serviceName);
            
            if (serviceSection) {
                smoothScrollTo(serviceSection, 100);
            }
        });
    });
});

// ==========================================
// SMOOTH SCROLL FOR HASH LINKS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Handle all hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty or just # links
            if (!href || href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement, 80);
                
                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
    
    // Handle page load with hash
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement, 80);
            }
        }, 100);
    }
});

// ==========================================
// ANIMATE ELEMENTS ON SCROLL
// ==========================================

function animateOnScroll() {
    const elements = document.querySelectorAll('.service-main-content > *, .service-sidebar > *');
    
    elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !element.classList.contains('animated')) {
            setTimeout(() => {
                if (element && typeof element.style !== 'undefined') {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                if (element && typeof element.classList !== 'undefined') {
                    element.classList.add('animated');
                }
            }, index * 50);
        }
    });
}

// Initial setup for elements
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-main-content > *, .service-sidebar > *');
    elements.forEach(element => {
        if (element && typeof element.classList !== 'undefined' && typeof element.style !== 'undefined') {
            if (!element.classList.contains('fade-in') && 
                !element.classList.contains('fade-in-up') && 
                !element.classList.contains('fade-in-right')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        }
    });
    
    animateOnScroll();
});

window.addEventListener('scroll', debounce(animateOnScroll, 50));

// ==========================================
// FAQ ACCORDION FUNCTIONALITY
// ==========================================

// Helper function to close FAQ with animation
function closeFaqWithAnimation(answer, icon, iconType = 'chevron') {
    if (!answer.classList.contains('hidden')) {
        answer.classList.add('closing');
        setTimeout(() => {
            answer.classList.add('hidden');
            answer.classList.remove('closing');
        }, 300);
        
        if (icon) {
            if (iconType === 'chevron') {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.classList.remove('fa-minus', 'text-secondary-orange');
                icon.classList.add('fa-plus', 'text-primary-blue');
            }
        }
    }
}

// Helper function to open FAQ with animation
function openFaqWithAnimation(answer, icon, iconType = 'chevron') {
    answer.classList.remove('hidden', 'closing');
    
    if (icon) {
        if (iconType === 'chevron') {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.classList.remove('fa-plus', 'text-primary-blue');
            icon.classList.add('fa-minus', 'text-secondary-orange');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for FAQ (main and injury)
    document.body.addEventListener('click', function(e) {
        // Main FAQ: button.faq-question
        if (e.target.closest('.faq-question')) {
            const question = e.target.closest('.faq-question');
            let answer = question.nextElementSibling;
            if (!answer || !answer.classList.contains('faq-answer')) {
                answer = question.parentElement.querySelector('.faq-answer');
            }
            const icon = question.querySelector('i');
            
            if (answer) {
                const isCurrentlyHidden = answer.classList.contains('hidden');
                
                // Close all other main FAQs with animation
                document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
                    if (otherAnswer !== answer) {
                        const otherQuestion = otherAnswer.previousElementSibling;
                        const otherIcon = otherQuestion ? otherQuestion.querySelector('i') : null;
                        closeFaqWithAnimation(otherAnswer, otherIcon, 'chevron');
                    }
                });
                
                // Toggle current FAQ with animation
                if (isCurrentlyHidden) {
                    openFaqWithAnimation(answer, icon, 'chevron');
                } else {
                    closeFaqWithAnimation(answer, icon, 'chevron');
                }
            }
            e.preventDefault();
        }
        
        // Injury FAQ: h4.cursor-pointer
        if (e.target.closest('h4.cursor-pointer')) {
            const header = e.target.closest('h4.cursor-pointer');
            let answer = header.nextElementSibling;
            if (!answer || !(answer.tagName === 'DIV')) {
                answer = header.parentElement.querySelector('div');
            }
            const icon = header.querySelector('i');
            
            if (answer) {
                const isHidden = answer.classList.contains('hidden');
                
                // Close all other injury FAQs with animation
                document.querySelectorAll('h4.cursor-pointer').forEach(otherHeader => {
                    if (otherHeader !== header) {
                        let otherAnswer = otherHeader.nextElementSibling;
                        if (otherAnswer && otherAnswer.tagName === 'DIV') {
                            const otherIcon = otherHeader.querySelector('i');
                            closeFaqWithAnimation(otherAnswer, otherIcon, 'plusminus');
                        }
                    }
                });
                
                // Toggle current FAQ with animation
                if (isHidden) {
                    openFaqWithAnimation(answer, icon, 'plusminus');
                } else {
                    closeFaqWithAnimation(answer, icon, 'plusminus');
                }
            }
            e.preventDefault();
        }
    });

    // On load: injury FAQ only first open, others closed
    const injuryFaqHeaders = document.querySelectorAll('h4.cursor-pointer');
    injuryFaqHeaders.forEach((header, idx) => {
        let answer = header.nextElementSibling;
        if (!answer || !(answer.tagName === 'DIV')) {
            answer = header.parentElement.querySelector('div');
        }
        const icon = header.querySelector('i');
        if (answer) {
            if (idx === 0) {
                answer.classList.remove('hidden');
                if (icon) {
                    icon.classList.remove('fa-plus', 'text-primary-blue');
                    icon.classList.add('fa-minus', 'text-secondary-orange');
                }
            } else {
                answer.classList.add('hidden');
                if (icon) {
                    icon.classList.remove('fa-minus', 'text-secondary-orange');
                    icon.classList.add('fa-plus', 'text-primary-blue');
                }
            }
        }
    });
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// END OF SCRIPT
// ==========================================

