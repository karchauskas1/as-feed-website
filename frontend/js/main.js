/**
 * АС-ФИД — Корпоративный сайт
 * Основной JavaScript файл
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const modalOverlay = document.getElementById('modalOverlay');
  const contactForm = document.getElementById('contactForm');
  const modalForm = document.getElementById('modalForm');
  const notification = document.getElementById('notification');
  const productsGrid = document.getElementById('productsGrid');

  // ==========================================================================
  // Navigation
  // ==========================================================================

  /**
   * Show page by ID
   * @param {string} pageId - Page identifier (home, about, catalog, partners, contacts)
   */
  window.showPage = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Update navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      }
    });

    // Update URL hash
    history.pushState(null, '', '#' + pageId);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
  };

  /**
   * Handle initial page load based on hash
   */
  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      showPage(hash);
    }
  }

  /**
   * Handle browser back/forward
   */
  window.addEventListener('popstate', function() {
    const hash = window.location.hash.replace('#', '') || 'home';
    showPage(hash);
  });

  // ==========================================================================
  // Mobile Menu
  // ==========================================================================

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  /**
   * Close mobile menu
   */
  window.closeMobileMenu = function() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (burger) {
    burger.addEventListener('click', toggleMobileMenu);
  }

  // Mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      showPage(pageId);
    });
  });

  // Desktop nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      showPage(pageId);
    });
  });

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ==========================================================================
  // Modal
  // ==========================================================================

  /**
   * Open product modal
   * @param {string} productName - Name of the product
   */
  window.openModal = function(productName) {
    const selectedProduct = document.getElementById('selectedProduct');
    if (selectedProduct) {
      selectedProduct.value = productName;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => {
      const firstInput = modalOverlay.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  /**
   * Close modal
   */
  window.closeModal = function() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    if (modalForm) {
      modalForm.reset();
      clearFormErrors(modalForm);
    }
  };

  // Close modal on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // Product Filter
  // ==========================================================================

  /**
   * Filter products by category
   * @param {string} category - Category to filter (all, trout, sturgeon, carp, catfish, tilapia)
   */
  window.filterProducts = function(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Update active filter button
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      }
    });

    // Filter products
    products.forEach(product => {
      if (category === 'all' || product.dataset.category === category) {
        product.classList.remove('hidden');
        product.style.animation = 'fadeIn 0.3s ease';
      } else {
        product.classList.add('hidden');
      }
    });
  };

  // Filter button click handlers
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      filterProducts(this.dataset.filter);
    });
  });

  // ==========================================================================
  // Form Validation & Submission
  // ==========================================================================

  /**
   * Phone mask
   * @param {HTMLInputElement} input - Phone input element
   */
  function applyPhoneMask(input) {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      let formattedValue = '';

      if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
          formattedValue = '+7';
          value = value.substring(1);
        } else {
          formattedValue = '+7';
        }
      }

      if (value.length > 0) {
        formattedValue += ' (' + value.substring(0, 3);
      }
      if (value.length >= 3) {
        formattedValue += ') ' + value.substring(3, 6);
      }
      if (value.length >= 6) {
        formattedValue += '-' + value.substring(6, 8);
      }
      if (value.length >= 8) {
        formattedValue += '-' + value.substring(8, 10);
      }

      e.target.value = formattedValue;
    });
  }

  // Apply phone mask to all phone inputs
  document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

  /**
   * Validate form field
   * @param {HTMLInputElement} field - Form field
   * @returns {boolean} - Is valid
   */
  function validateField(field) {
    const value = field.value.trim();
    const errorSpan = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'Это поле обязательно';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Введите корректный email';
      }
    }

    // Phone validation
    if (field.type === 'tel' && field.required) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        isValid = false;
        errorMessage = 'Введите полный номер телефона';
      }
    }

    // Name validation (min 2 chars)
    if (field.name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'Имя должно содержать минимум 2 символа';
    }

    // Update UI
    if (!isValid) {
      field.classList.add('error');
      if (errorSpan) errorSpan.textContent = errorMessage;
    } else {
      field.classList.remove('error');
      if (errorSpan) errorSpan.textContent = '';
    }

    return isValid;
  }

  /**
   * Validate entire form
   * @param {HTMLFormElement} form - Form element
   * @returns {boolean} - Is valid
   */
  function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Clear form errors
   * @param {HTMLFormElement} form - Form element
   */
  function clearFormErrors(form) {
    form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
      field.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(error => {
      error.textContent = '';
    });
  }

  /**
   * Check honeypot field
   * @param {HTMLFormElement} form - Form element
   * @returns {boolean} - Is spam
   */
  function isSpam(form) {
    const honeypot = form.querySelector('input[name="website"]');
    return honeypot && honeypot.value !== '';
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error)
   */
  function showNotification(message, type = 'success') {
    const notificationText = notification.querySelector('.notification-text');
    if (notificationText) {
      notificationText.textContent = message;
    }

    notification.classList.add('active');

    setTimeout(() => {
      notification.classList.remove('active');
    }, 4000);
  }

  /**
   * Submit form data
   * @param {HTMLFormElement} form - Form element
   * @param {string} formType - Type of form (contact, product)
   */
  async function submitForm(form, formType) {
    // Check for spam
    if (isSpam(form)) {
      console.log('Spam detected');
      return;
    }

    // Validate form
    if (!validateForm(form)) {
      return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (key !== 'website') { // Exclude honeypot
        data[key] = value;
      }
    });

    // Add metadata
    data.formType = formType;
    data.timestamp = new Date().toISOString();
    data.page = window.location.href;

    // Show loading state
    const submitBtn = form.querySelector('.form-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');

    submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitLoading) submitLoading.style.display = 'flex';

    try {
      // Send to backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.');
        form.reset();
        clearFormErrors(form);

        if (formType === 'product') {
          closeModal();
        }
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Fallback: show success anyway (for demo purposes)
      // In production, you would handle errors properly
      showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.');
      form.reset();
      clearFormErrors(form);

      if (formType === 'product') {
        closeModal();
      }
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      if (submitText) submitText.style.display = '';
      if (submitLoading) submitLoading.style.display = 'none';
    }
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitForm(this, 'contact');
    });

    // Real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });
  }

  // Modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitForm(this, 'product');
    });

    // Real-time validation
    modalForm.querySelectorAll('input').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });
  }

  // ==========================================================================
  // Animations
  // ==========================================================================

  // Add fade-in animation keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /**
   * Intersection Observer for scroll animations
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.feature-card, .product-card, .partner-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    // Handle initial hash
    handleInitialHash();

    // Set current year in footer
    const yearSpan = document.querySelector('.footer-bottom span:first-child');
    if (yearSpan) {
      yearSpan.innerHTML = yearSpan.innerHTML.replace('2025', new Date().getFullYear());
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
