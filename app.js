document.addEventListener('DOMContentLoaded', () => {
  // Accessible contact-form validation
  const contactForm = document.querySelector('#contact form');

  if (contactForm) {
    const fields = [
      { id: 'fullName', label: 'Full Name' },
      { id: 'emailAddress', label: 'Email Address' },
      { id: 'userMessage', label: 'Your Message' }
    ];

    contactForm.addEventListener('submit', (event) => {
      let isValid = true;
      let firstInvalid = null;

      fields.forEach(({ id, label }) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.classList.remove('is-invalid', 'is-valid');
        input.removeAttribute('aria-invalid');

        const existingFeedback = input.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) existingFeedback.remove();

        if (!input.checkValidity()) {
          isValid = false;
          firstInvalid ??= input;
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');

          let message = `${label} is required.`;
          if (input.validity.typeMismatch) {
            message = 'Please enter a valid email address.';
          }

          const feedbackEl = document.createElement('div');
          feedbackEl.className = 'invalid-feedback';
          feedbackEl.textContent = message;
          input.after(feedbackEl);
        } else {
          input.classList.add('is-valid');
          input.setAttribute('aria-invalid', 'false');
        }
      });

      if (!isValid) {
        event.preventDefault();
        firstInvalid?.focus();
        return;
      }

      // This is a static portfolio/demo form, so prevent a page reload.
      event.preventDefault();
      alert('Thank you! Your message has been sent successfully.');
      contactForm.reset();

      fields.forEach(({ id }) => {
        const input = document.getElementById(id);
        if (input) {
          input.classList.remove('is-valid');
          input.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }

  // Week 4 testimonial rotator: keyboard-safe and pausable.
  const rotatorContainer = document.getElementById('testimonial-rotator');
  const togglePauseBtn = document.getElementById('rotator-toggle-btn');
  const slides = document.querySelectorAll('.testimonial-slide');

  if (rotatorContainer && slides.length > 0) {
    let currentIndex = 0;
    let autoRotateInterval = null;
    let isUserPaused = false;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const startRotation = () => {
      if (!autoRotateInterval && !isUserPaused && slides.length > 1) {
        autoRotateInterval = setInterval(nextSlide, 4000);
      }
    };

    const stopRotation = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    };

    if (togglePauseBtn) {
      togglePauseBtn.addEventListener('click', () => {
        isUserPaused = !isUserPaused;

        if (isUserPaused) {
          togglePauseBtn.setAttribute('aria-pressed', 'true');
          togglePauseBtn.textContent = 'Play Auto-Rotation';
          stopRotation();
        } else {
          togglePauseBtn.setAttribute('aria-pressed', 'false');
          togglePauseBtn.textContent = 'Pause Auto-Rotation';
          startRotation();
        }
      });
    }

    // Pause while a visitor is interacting with the rotator.
    rotatorContainer.addEventListener('mouseenter', stopRotation);
    rotatorContainer.addEventListener('mouseleave', () => {
      if (!isUserPaused) startRotation();
    });

    rotatorContainer.addEventListener('focusin', stopRotation);
    rotatorContainer.addEventListener('focusout', (event) => {
      if (!rotatorContainer.contains(event.relatedTarget) && !isUserPaused) {
        startRotation();
      }
    });

    showSlide(currentIndex);
    startRotation();
  }

  // Week 5 Book a Class CTA: preserve the anchor destination and focus the first
  // booking field after the user activates it.
  const bookClassButton = document.getElementById('book-class-btn');

  if (bookClassButton) {
    bookClassButton.addEventListener('click', () => {
      const firstField = document.getElementById('fullName');

      if (firstField) {
        setTimeout(() => firstField.focus(), 50);
      }
    });
  }
});
