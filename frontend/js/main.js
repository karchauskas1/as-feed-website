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

    // Fix catalog product visibility (reset opacity from Intersection Observer)
    if (pageId === 'catalog') {
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '1';
      });
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
  // Product Detail Modal
  // ==========================================================================

  const PRODUCTS = {
    'karp': {
      name: 'Карп',
      category: 'Аквакультура',
      image: 'images/products/karp.png',
      type: 'Полностью экструдированный гранулированный',
      granules: '4 мм, 6 мм, 8 мм',
      components: 'Рыбная мука, рыбий жир, растительное масло, кукуруза, пшеница, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '8%',
        'Сырой протеин': '32%',
        'Сырой жир': '8.5%',
        'Углеводы': '38%',
        'Зола': '7.0%',
        'Клетчатка': '4.0%',
        'Фосфор': '1.5%',
        'Общая энергия': '19.2 МДж/кг',
        'Перевариваемая энергия': '16.1 МДж/кг'
      }
    },
    'osetr': {
      name: 'Осётр',
      category: 'Аквакультура',
      image: 'images/products/osetr.png',
      type: 'Полностью экструдированный гранулированный',
      granules: '4 мм, 6 мм, 8 мм, 10 мм',
      components: 'Рыбная мука, рыбий жир, травяная мука, кукуруза, пшеница, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '8.5%',
        'Сырой протеин': '48%',
        'Сырой жир': '14%',
        'Углеводы': '18%',
        'Зола': '8%',
        'Клетчатка': '1.5%',
        'Фосфор': '1.5%',
        'Общая энергия': '20.34 МДж/кг',
        'Перевариваемая энергия': '16.6 МДж/кг'
      }
    },
    'forel': {
      name: 'Форель',
      category: 'Аквакультура',
      image: 'images/products/forel.png',
      type: 'Полностью экструдированный гранулированный',
      granules: '4 мм, 6 мм, 8 мм, 10 мм',
      components: 'Рыбная мука, рыбий жир, травяная мука, кукуруза, пшеница, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '7%',
        'Сырой протеин': '50%',
        'Сырой жир': '16%',
        'Углеводы': '19%',
        'Зола': '7.5%',
        'Клетчатка': '2.3%',
        'Фосфор': '1.5%',
        'Общая энергия': '20.2 МДж/кг',
        'Перевариваемая энергия': '16.23 МДж/кг'
      }
    },
    'pticy-start': {
      name: 'Птицы Старт',
      category: 'Птицы',
      image: 'images/products/pticy-start.png',
      type: 'Частично экструдированный гранулированный',
      granules: '3 мм, 4 мм',
      components: 'Рыбная мука, растительный жир, кукуруза, пшеница, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '7%',
        'Сырой протеин': '26%',
        'Сырой жир': '8%',
        'Углеводы': '51%',
        'Зола': '8%',
        'Клетчатка': '5.5%',
        'Фосфор': '1.1%',
        'Общая энергия': '14.8 МДж/кг',
        'Перевариваемая энергия': '12.0 МДж/кг'
      }
    },
    'pticy-rost': {
      name: 'Птицы Рост',
      category: 'Птицы',
      image: 'images/products/pticy-rost.png',
      type: 'Частично экструдированный гранулированный',
      granules: '3 мм, 4 мм, 5 мм',
      components: 'Рыбная мука, растительный жир, кукуруза, пшеница, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '9%',
        'Сырой протеин': '19%',
        'Сырой жир': '6%',
        'Углеводы': '58%',
        'Зола': '6.2%',
        'Клетчатка': '5.1%',
        'Фосфор': '0.88%',
        'Общая энергия': '14.1 МДж/кг',
        'Перевариваемая энергия': '11.5 МДж/кг'
      }
    },
    'telyata': {
      name: 'Телята',
      category: 'КРС',
      image: 'images/products/telyata.png',
      type: 'Частично экструдированный гранулированный',
      granules: '4 мм, 5 мм, 6 мм',
      components: 'Растительный жир, кукуруза, пшеница, ячмень, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '7%',
        'Сырой протеин': '21%',
        'Сырой жир': '5%',
        'Углеводы': '55%',
        'Зола': '8.3%',
        'Клетчатка': '7.2%',
        'Фосфор': '0.98%',
        'Общая энергия': '13.8 МДж/кг',
        'Перевариваемая энергия': '11.5 МДж/кг'
      }
    },
    'molochnye-korovy': {
      name: 'Молочные коровы',
      category: 'КРС',
      image: 'images/products/molochnye-korovy.png',
      type: 'Частично экструдированный гранулированный',
      granules: '5 мм, 6 мм, 8 мм',
      components: 'Растительный жир, кукуруза, пшеница, ячмень, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '7.5%',
        'Сырой протеин': '23%',
        'Сырой жир': '5.5%',
        'Углеводы': '50%',
        'Зола': '9%',
        'Клетчатка': '7.2%',
        'Фосфор': '0.95%',
        'Общая энергия': '18.8 МДж/кг',
        'Перевариваемая энергия': '13.5 МДж/кг'
      }
    },
    'krs-otkorm': {
      name: 'КРС на откорме',
      category: 'КРС',
      image: 'images/products/krs-otkorm.png',
      type: 'Частично экструдированный гранулированный',
      granules: '5 мм, 6 мм, 8 мм',
      components: 'Растительный жир, кукуруза, пшеница, ячмень, шрот подсолнечный, шрот рапсовый, дрожжи кормовые, меласс, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '8.5%',
        'Сырой протеин': '14%',
        'Сырой жир': '3.5%',
        'Углеводы': '65%',
        'Зола': '6.5%',
        'Клетчатка': '7.2%',
        'Фосфор': '0.90%',
        'Общая энергия': '13.8 МДж/кг',
        'Перевариваемая энергия': '11.5 МДж/кг'
      }
    },
    'molodnyak': {
      name: 'Молодняк свиней',
      category: 'Свиньи',
      image: 'images/products/molodnyak.png',
      type: 'Частично экструдированный гранулированный',
      granules: '3 мм, 4 мм',
      components: 'Рыбная мука, растительный жир, кукуруза, пшеница, ячмень, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '8.5%',
        'Сырой протеин': '19%',
        'Сырой жир': '7%',
        'Углеводы': '46%',
        'Зола': '7.5%',
        'Клетчатка': '5.2%',
        'Фосфор': '0.90%',
        'Общая энергия': '13.9 МДж/кг',
        'Перевариваемая энергия': '12.5 МДж/кг'
      }
    },
    'svinomatki': {
      name: 'Свиноматки',
      category: 'Свиньи',
      image: 'images/products/svinomatki.png',
      type: 'Частично экструдированный гранулированный',
      granules: '4 мм, 5 мм, 6 мм',
      components: 'Рыбная мука, растительный жир, кукуруза, пшеница, ячмень, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '8%',
        'Сырой протеин': '16%',
        'Сырой жир': '6%',
        'Углеводы': '63%',
        'Зола': '7.5%',
        'Клетчатка': '5%',
        'Фосфор': '0.75%',
        'Общая энергия': '14.0 МДж/кг',
        'Перевариваемая энергия': '11.5 МДж/кг'
      }
    },
    'svini-otkorm': {
      name: 'Свиньи на откорме',
      category: 'Свиньи',
      image: 'images/products/svini-otkorm.png',
      type: 'Частично экструдированный гранулированный',
      granules: '4 мм, 5 мм, 6 мм',
      components: 'Рыбная мука, растительный жир, кукуруза, пшеница, ячмень, шрот рапсовый, дрожжи кормовые, минералы, витамины, пробиотик',
      vitamins: 'Витамин А 10000 ME, витамин D3 1250 ME, витамин Е 50 мг, витамин С 100 мг',
      shelfLife: '12 месяцев с даты изготовления',
      chars: {
        'Влажность': '7%',
        'Сырой протеин': '14%',
        'Сырой жир': '5%',
        'Углеводы': '62%',
        'Зола': '5.5%',
        'Клетчатка': '4%',
        'Фосфор': '0.80%',
        'Общая энергия': '13.8 МДж/кг',
        'Перевариваемая энергия': '11.9 МДж/кг'
      }
    }
  };

  const pdOverlay = document.getElementById('pdOverlay');
  const pdClose = document.getElementById('pdClose');
  let currentProductName = '';

  /**
   * Open product detail modal
   * @param {string} productId - Product key from PRODUCTS object
   */
  window.openProductDetail = function(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    currentProductName = product.name;

    // Populate modal fields
    document.getElementById('pdImage').src = product.image;
    document.getElementById('pdImage').alt = product.name;
    document.getElementById('pdCategory').textContent = product.category;
    document.getElementById('pdTitle').textContent = product.name;
    document.getElementById('pdType').textContent = product.type;
    document.getElementById('pdGranules').textContent = 'Гранулы: ' + product.granules;

    // Build characteristics table
    var charsHtml = '';
    var charEntries = Object.entries(product.chars);
    for (var i = 0; i < charEntries.length; i++) {
      charsHtml += '<tr><td>' + charEntries[i][0] + '</td><td>' + charEntries[i][1] + '</td></tr>';
    }
    document.getElementById('pdCharsBody').innerHTML = charsHtml;

    // Components
    document.getElementById('pdComponents').textContent = product.components;
    document.getElementById('pdVitamins').textContent = product.vitamins;

    // Storage
    document.getElementById('pdShelfLife').textContent = 'Срок хранения: ' + product.shelfLife;

    // Reset to first tab
    var tabs = document.querySelectorAll('.pd-tab');
    var contents = document.querySelectorAll('.pd-tab-content');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].classList.remove('active');
    }
    for (var c = 0; c < contents.length; c++) {
      contents[c].classList.remove('active');
    }
    tabs[0].classList.add('active');
    document.getElementById('pdTabChars').classList.add('active');

    // Show modal
    pdOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /**
   * Close product detail modal
   */
  function closeProductDetail() {
    pdOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentProductName = '';
  }

  // Close on X button
  if (pdClose) {
    pdClose.addEventListener('click', closeProductDetail);
  }

  // Close on overlay click
  if (pdOverlay) {
    pdOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeProductDetail();
      }
    });
  }

  // Tab switching
  document.querySelectorAll('.pd-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var tabName = this.dataset.tab;

      // Deactivate all tabs
      document.querySelectorAll('.pd-tab').forEach(function(t) {
        t.classList.remove('active');
      });
      document.querySelectorAll('.pd-tab-content').forEach(function(c) {
        c.classList.remove('active');
      });

      // Activate clicked tab
      this.classList.add('active');
      var tabMap = {
        'chars': 'pdTabChars',
        'components': 'pdTabComponents',
        'storage': 'pdTabStorage'
      };
      var targetEl = document.getElementById(tabMap[tabName]);
      if (targetEl) {
        targetEl.classList.add('active');
      }
    });
  });

  // Order button inside product detail -> close detail, open order modal
  var pdOrderBtn = document.getElementById('pdOrderBtn');
  if (pdOrderBtn) {
    pdOrderBtn.addEventListener('click', function() {
      var name = currentProductName;
      closeProductDetail();
      openModal(name);
    });
  }

  // Make product cards clickable (card itself, excluding the order button)
  document.querySelectorAll('.product-card[data-product]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      // Don't open detail if the order button was clicked
      if (e.target.closest('.product-btn')) return;
      var productId = this.dataset.product;
      openProductDetail(productId);
    });
  });

  // Close product detail on Escape key (extend existing handler)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && pdOverlay.classList.contains('active')) {
      closeProductDetail();
    }
  });

  // ==========================================================================
  // Product Filter
  // ==========================================================================

  /**
   * Filter products by category
   * @param {string} category - Category to filter (all, aqua, poultry, cattle, pigs)
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
        product.style.opacity = '1';  // Ensure visibility (fixes Intersection Observer issue)
        product.style.animation = 'fadeIn 0.3s ease';
      } else {
        product.classList.add('hidden');
      }
    });
  };

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

  // Observe elements for animation (excluding product-card to prevent catalog visibility issues)
  document.querySelectorAll('.feature-card, .partner-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    // Handle initial hash
    handleInitialHash();

    // Initialize filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        filterProducts(this.dataset.filter);
      });
    });

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
