"use strict";

(function () {
  // ==========================================
  // HAMBURGER MENU FUNCTIONALITY
  // ==========================================
  const hamburgerToggleButton = document.querySelector('.hamburger-menu');
  const mainNavigationMenu = document.querySelector('.main-nav');

  if (hamburgerToggleButton && mainNavigationMenu) {
    const navLinks = mainNavigationMenu.querySelectorAll('a');
    
    // Helper function to manage link tabbing
    const updateNavLinkTabbing = (shouldBeHidden) => {
      navLinks.forEach((link) => {
        if (shouldBeHidden) {
          link.setAttribute('tabindex', '-1');
        } else {
          link.removeAttribute('tabindex');
        }
      });
    };
    
    // Helper function to check if at mobile size
    const isMobileSize = () => {
      return window.matchMedia('(max-width: 44rem)').matches;
    };
    
    // Initialize menu state based on screen size
    const initializeMenuState = () => {
      if (isMobileSize()) {
        mainNavigationMenu.hidden = true;
        hamburgerToggleButton.setAttribute('aria-expanded', 'false');
        updateNavLinkTabbing(true);
      } else {
        mainNavigationMenu.hidden = false;
        updateNavLinkTabbing(false);
      }
    };
    
    // Toggle menu when hamburger clicked
    hamburgerToggleButton.addEventListener('click', () => {
      const willBeVisible = mainNavigationMenu.hidden;
      mainNavigationMenu.hidden = !mainNavigationMenu.hidden;
      hamburgerToggleButton.setAttribute('aria-expanded', willBeVisible);
      updateNavLinkTabbing(!willBeVisible);
    });
    
    // Reinitialize when window resizes
    window.addEventListener('resize', initializeMenuState);
    
    // Initialize on page load
    initializeMenuState();
  }

  // ==========================================
  // ACCORDION FUNCTIONALITY (events.html only)
  // ==========================================
  const accordionContainer = document.querySelector('.accordion-container');

  if (accordionContainer) {
    const accordionButtons = accordionContainer.querySelectorAll('.accordion-button');

    accordionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';
        const contentId = button.getAttribute('aria-controls');
        const contentElement = document.querySelector(`#${contentId}`);

        if (isCurrentlyExpanded) {
          // Collapse this section
          button.setAttribute('aria-expanded', 'false');
          contentElement.hidden = true;
        } else {
          // Expand this section
          button.setAttribute('aria-expanded', 'true');
          contentElement.hidden = false;
        }
      });
    });
  }

  // ==========================================
  // PRIVACY PREFERENCES (privacy.html only)
  // TRUE STATE-RENDER CYCLE - REPLACES HTML CHUNKS
  // ==========================================
  const privacyContainer = document.querySelector('.privacy-preferences');

  if (privacyContainer) {

    // STATE OBJECT - all application state in one place
    const state = {
      analytics: false,
      marketing: false,
      newsletter: false
    };

    // RENDER FUNCTION - replaces HTML chunk based on current state
    const render = () => {
      // Generate HTML based on state
      const preferencesHTML = `
        <h2>Privacy Preferences</h2>
        <div class="preference-item">
          <div class="preference-info">
            <h3>Essential Cookies</h3>
            <p>Required for the website to function properly. These cookies enable core functionality such as security, network management, and accessibility. These cannot be disabled.</p>
          </div>
          <div class="toggle-container">
            <span class="toggle-status always-on">Always On</span>
          </div>
        </div>

        <div class="preference-item">
          <div class="preference-info">
            <h3>Analytics Cookies</h3>
            <p>Help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the user experience.</p>
          </div>
          <div class="toggle-container">
            <button type="button" class="toggle-btn" data-preference="analytics" aria-pressed="${state.analytics}">
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="toggle-label">${state.analytics ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        <div class="preference-item">
          <div class="preference-info">
            <h3>Marketing Cookies</h3>
            <p>Used to deliver personalized cat content and advertisements based on your interests. These help us show you relevant content about your favorite internet cats.</p>
          </div>
          <div class="toggle-container">
            <button type="button" class="toggle-btn" data-preference="marketing" aria-pressed="${state.marketing}">
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="toggle-label">${state.marketing ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        <div class="preference-item">
          <div class="preference-info">
            <h3>Email Newsletter</h3>
            <p>Receive weekly updates about internet cats, new content, upcoming events, and exclusive cat memes directly in your inbox.</p>
          </div>
          <div class="toggle-container">
            <button type="button" class="toggle-btn" data-preference="newsletter" aria-pressed="${state.newsletter}">
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="toggle-label">${state.newsletter ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      `;

      // Replace entire section HTML
      privacyContainer.innerHTML = preferencesHTML;

      // Update summary display (separate section, not replaced)
      const analyticsStatus = document.querySelector('#analytics-status');
      const marketingStatus = document.querySelector('#marketing-status');
      const newsletterStatus = document.querySelector('#newsletter-status');

      if (analyticsStatus) {
        analyticsStatus.textContent = state.analytics ? 'Enabled' : 'Disabled';
      }
      if (marketingStatus) {
        marketingStatus.textContent = state.marketing ? 'Enabled' : 'Disabled';
      }
      if (newsletterStatus) {
        newsletterStatus.textContent = state.newsletter ? 'Enabled' : 'Disabled';
      }
    };

    // EVENT DELEGATION - listen on ancestor element
    privacyContainer.addEventListener('click', (e) => {
      // Filter out irrelevant events - only respond to toggle buttons
      if (!e.target.closest('.toggle-btn')) {
        return;
      }

      const button = e.target.closest('.toggle-btn');
      const preference = button.getAttribute('data-preference');

      // Update state based on user action
      state[preference] = !state[preference];

      // Trigger render to update UI
      render();
    });

    // Initial render to display starting state
    render();
  }

  // ==========================================
  // MODAL AND FORM VALIDATION (cats.html only)
  // ==========================================
  const subscriptionModal = document.querySelector('#subscribe-modal');

  // Exit early if not on cats.html page
  if (!subscriptionModal) {
    return;
  }

  // Get all necessary elements
  const allSubscribeButtons = document.querySelectorAll('.subscribe-link');
  const cancelModalButton = document.querySelector('.btn-cancel');
  const subscriptionForm = document.querySelector('.subscribe-form');
  const emailInputField = document.querySelector('#email');
  const confirmEmailInputField = document.querySelector('#confirm-email');
  const emailErrorMessageElement = document.querySelector('#email-error');
  const confirmEmailErrorMessageElement = document.querySelector('#confirm-error');

  // ==========================================
  // VALIDATION HELPER FUNCTIONS
  // ==========================================
  const isValidEmailFormat = (emailAddress) => {
    return emailAddress.includes('@');
  };

  const doEmailAddressesMatch = (primaryEmail, confirmationEmail) => {
    return primaryEmail === confirmationEmail;
  };

  const displayErrorMessage = (errorElement, messageText) => {
    if (errorElement) {
      errorElement.textContent = messageText;
    }
  };

  const clearErrorMessage = (errorElement) => {
    if (errorElement) {
      errorElement.textContent = '';
    }
  };

  const resetFormAndClearAllErrors = () => {
    if (subscriptionForm) {
      subscriptionForm.reset();
    }
    clearErrorMessage(emailErrorMessageElement);
    clearErrorMessage(confirmEmailErrorMessageElement);
    if (emailInputField) {
      emailInputField.classList.remove('error');
    }
    if (confirmEmailInputField) {
      confirmEmailInputField.classList.remove('error');
    }
  };

  // ==========================================
  // MODAL OPEN/CLOSE FUNCTIONALITY
  // ==========================================
  // Open modal when any subscribe button is clicked
  allSubscribeButtons.forEach((subscribeButton) => {
    subscribeButton.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault();
      subscriptionModal.showModal();
    });
  });

  // Close modal when cancel button is clicked
  if (cancelModalButton) {
    cancelModalButton.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault();
      subscriptionModal.close();
    });
  }

  // Reset form when modal is closed by any means (Cancel button or Escape key)
  if (subscriptionModal) {
    subscriptionModal.addEventListener('close', () => {
      resetFormAndClearAllErrors();
    });
  }

  // ==========================================
  // REAL-TIME EMAIL VALIDATION
  // ==========================================
  if (emailInputField) {
    emailInputField.addEventListener('input', () => {
      const currentEmailValue = emailInputField.value.trim();

      if (currentEmailValue === '') {
        displayErrorMessage(emailErrorMessageElement, 'This field is required');
        emailInputField.classList.add('error');
      } else if (!isValidEmailFormat(currentEmailValue)) {
        displayErrorMessage(emailErrorMessageElement, 'This field must be a valid email address including a @');
        emailInputField.classList.add('error');
      } else {
        clearErrorMessage(emailErrorMessageElement);
        emailInputField.classList.remove('error');

        // Revalidate confirmation field if it has content
        if (confirmEmailInputField && confirmEmailInputField.value.trim() !== '') {
          const currentConfirmValue = confirmEmailInputField.value.trim();

          if (!doEmailAddressesMatch(currentEmailValue, currentConfirmValue)) {
            displayErrorMessage(confirmEmailErrorMessageElement, 'This field must match the provided email address');
            confirmEmailInputField.classList.add('error');
          } else {
            clearErrorMessage(confirmEmailErrorMessageElement);
            confirmEmailInputField.classList.remove('error');
          }
        }
      }
    });
  }

  // ==========================================
  // REAL-TIME CONFIRMATION EMAIL VALIDATION
  // ==========================================
  if (confirmEmailInputField) {
    confirmEmailInputField.addEventListener('input', () => {
      const primaryEmailValue = emailInputField ? emailInputField.value.trim() : '';
      const confirmationEmailValue = confirmEmailInputField.value.trim();

      if (confirmationEmailValue === '') {
        // If email field has a valid email, show match error instead of required
        if (primaryEmailValue !== '' && isValidEmailFormat(primaryEmailValue)) {
          displayErrorMessage(confirmEmailErrorMessageElement, 'This field must match the provided email address');
        } else {
          displayErrorMessage(confirmEmailErrorMessageElement, 'This field is required');
        }
        confirmEmailInputField.classList.add('error');
      } else if (!doEmailAddressesMatch(primaryEmailValue, confirmationEmailValue)) {
        displayErrorMessage(confirmEmailErrorMessageElement, 'This field must match the provided email address');
        confirmEmailInputField.classList.add('error');
      } else {
        clearErrorMessage(confirmEmailErrorMessageElement);
        confirmEmailInputField.classList.remove('error');
      }
    });
  }

  // ==========================================
  // FORM SUBMISSION VALIDATION
  // ==========================================
  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', (submitEvent) => {
      let formIsValid = true;
      const primaryEmailValue = emailInputField ? emailInputField.value.trim() : '';
      const confirmationEmailValue = confirmEmailInputField ? confirmEmailInputField.value.trim() : '';

      // Clear all existing errors
      clearErrorMessage(emailErrorMessageElement);
      clearErrorMessage(confirmEmailErrorMessageElement);

      if (emailInputField) {
        emailInputField.classList.remove('error');
      }
      if (confirmEmailInputField) {
        confirmEmailInputField.classList.remove('error');
      }

      // Validate primary email field
      if (primaryEmailValue === '') {
        displayErrorMessage(emailErrorMessageElement, 'This field is required');
        if (emailInputField) {
          emailInputField.classList.add('error');
        }
        formIsValid = false;
      } else if (!isValidEmailFormat(primaryEmailValue)) {
        displayErrorMessage(emailErrorMessageElement, 'This field must be a valid email address including a @');
        if (emailInputField) {
          emailInputField.classList.add('error');
        }
        formIsValid = false;
      }

      // Only validate confirmation email if primary email is valid
      if (primaryEmailValue !== '' && isValidEmailFormat(primaryEmailValue)) {
        if (confirmationEmailValue === '') {
          displayErrorMessage(confirmEmailErrorMessageElement, 'This field must match the provided email address');
          if (confirmEmailInputField) {
            confirmEmailInputField.classList.add('error');
          }
          formIsValid = false;
        } else if (!doEmailAddressesMatch(primaryEmailValue, confirmationEmailValue)) {
          displayErrorMessage(confirmEmailErrorMessageElement, 'This field must match the provided email address');
          if (confirmEmailInputField) {
            confirmEmailInputField.classList.add('error');
          }
          formIsValid = false;
        }
      }

      // Prevent form submission if validation fails
      if (!formIsValid) {
        submitEvent.preventDefault();
      }
    });
  }
})();