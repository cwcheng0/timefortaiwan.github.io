document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Header Scroll Behavior & Active Links
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll header effect
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link highlight
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
  });

  // ==========================================
  // 2. Intersection Observer for Scroll Reveal
  // ==========================================
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track again
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  const cards = document.querySelectorAll('.timeline-card, .gallery-item, .drink-display-wrapper, .chef-card');
  cards.forEach(card => {
    revealObserver.observe(card);
  });

  // ==========================================
  // 3. Beverage Menu Explorer Filter
  // ==========================================
  const drinksData = {
    tea: [
      { zh: "最澄氣泡茶香檳三重奏", en: "TRIO SACHO Sparkling Tea (200ml x 3)", price: "1,800" },
      { zh: "焙茶之韻氣泡茶", en: "SACHO Hojicha (200ml)", price: "680" },
      { zh: "大吉嶺之華氣泡茶", en: "SACHO Darjeeling (200ml)", price: "680" },
      { zh: "茉莉花之舞氣泡茶", en: "SACHO Jasmine (200ml)", price: "680" }
    ],
    gin: [
      { zh: "蘋果二葉松琴通寧 (釀蒸餾所)", en: "Apple Pine Gin Tonic (Taiwan Nong Distillery)", price: "480" },
      { zh: "土窯柴焙桂圓琴通寧 (釀蒸餾所)", en: "Dried Smoked Longan Gin Tonic", price: "480" },
      { zh: "鰹魚琴通寧 (釀蒸餾所)", en: "Bonito Gin Tonic (Taiwan Nong Distillery)", price: "480" },
      { zh: "豐濱牛琴通寧 (釀蒸餾所)", en: "Beef Gin Tonic (Taiwan Nong Distillery)", price: "480" }
    ],
    beer: [
      { zh: "吉姆老爹 津津蘆筍汁啤酒", en: "Jim & Dad Asparagus Juice Beer", price: "290" },
      { zh: "吉姆老爹 百香酒花艾爾", en: "Jim & Dad Passionfruit IPA", price: "290" },
      { zh: "吉姆老爹 暗夜行者黑啤酒", en: "Jim & Dad Dark Ale", price: "290" }
    ]
  };

  const drinkFilterBtns = document.querySelectorAll('.drink-filter-btn');
  const drinkContainer = document.getElementById('drink-items-container');

  drinkFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      drinkFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      renderDrinks(category);
    });
  });

  function renderDrinks(category) {
    drinkContainer.innerHTML = '';
    const items = drinksData[category] || [];
    
    items.forEach((item, index) => {
      const drinkElement = document.createElement('div');
      drinkElement.className = 'drink-item';
      drinkElement.style.animationDelay = `${index * 0.1}s`;
      drinkElement.innerHTML = `
        <div class="drink-info">
          <span class="drink-name-zh">${item.zh}</span>
          <span class="drink-name-en">${item.en}</span>
        </div>
        <span class="drink-price">NT$ ${item.price}</span>
      `;
      drinkContainer.appendChild(drinkElement);
    });
  }

  // ==========================================
  // 4. Full-Screen Photo Lightbox Modal
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Collect all zoomable photos in order
  const galleryItems = [];
  
  // Find all elements acting as gallery triggers
  // They have data-full attribute
  const triggers = document.querySelectorAll('[data-full]');
  
  triggers.forEach((trigger, index) => {
    galleryItems.push({
      element: trigger,
      fullSrc: trigger.getAttribute('data-full'),
      title: trigger.getAttribute('data-title'),
      desc: trigger.getAttribute('data-desc')
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index);
    });
  });

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
  }

  function updateLightboxContent() {
    const item = galleryItems[currentGalleryIndex];
    if (item) {
      // Fade out image quickly, load next, then fade in
      lightboxImg.style.opacity = '0';
      
      // Preload image
      const tempImg = new Image();
      tempImg.onload = () => {
        lightboxImg.src = item.fullSrc;
        lightboxImg.alt = item.title;
        lightboxImg.style.opacity = '1';
      };
      tempImg.src = item.fullSrc;

      lightboxTitle.textContent = item.title;
      lightboxDesc.textContent = item.desc;
    }
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  // Event Listeners for Lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  // Close when clicking background glass
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });
});
