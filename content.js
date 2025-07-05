/**
 * content.js
 * Telegram Blackhole Theme
 *
 * This script ensures the theme is applied consistently, especially
 * to dynamically loaded content within Telegram Web. It uses MutationObserver
 * for efficient DOM monitoring and debouncing for performance optimization.
 */

console.log("Telegram Blackhole Theme: content.js loaded.");

/**
 * Toggles the 'blackhole-theme' class on the body element.
 * @param {boolean} enable If true, adds the class; if false, removes it.
 */
function toggleTheme(enable) {
  if (enable) {
    document.body.classList.add('blackhole-theme');
    console.log("Telegram Blackhole Theme: Theme enabled.");
  } else {
    document.body.classList.remove('blackhole-theme');
    console.log("Telegram Blackhole Theme: Theme disabled.");
  }
}

/**
 * Applies styling to elements that might be added dynamically or require
 * JavaScript-based adjustments not easily handled by CSS alone.
 * This function is kept minimal to ensure performance.
 */
function applyDynamicStyling() {
  try {
    // Ensure images within message containers have the correct border-radius.
    // CSS can sometimes be overridden by inline styles added by the web app.
    const mediaImages = document.querySelectorAll('.Message .media-container img');
    mediaImages.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
    });

    // Example: If Telegram dynamically adds elements that need specific background colors
    // that are hard to override with CSS due to inline styles or specificity issues.
    // const dynamicallyAddedElements = document.querySelectorAll('.some-dynamic-element');
    // dynamicallyAddedElements.forEach(el => {
    //   el.style.backgroundColor = '#0a0a0a';
    // });
  } catch (error) {
    console.error("Telegram Blackhole Theme: Error applying dynamic styling:", error);
  }
}

/**
 * Debounce utility to limit the rate at which a function gets called.
 * Useful for events that fire rapidly (e.g., DOM mutations).
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Waits for a specific element to appear in the DOM using MutationObserver.
 * This is more efficient than polling with setInterval.
 * @param {string} selector The CSS selector of the element to wait for.
 * @param {function(Element): void} callback The function to execute once the element is found, receiving the found element as an argument.
 */
function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const foundElement = document.querySelector(selector);
    if (foundElement) {
      callback(foundElement);
      obs.disconnect(); // Disconnect the observer once the element is found to prevent memory leaks
    }
  });

  // Start observing the entire document body for changes
  observer.observe(document.body, {
    childList: true, // Observe direct children additions/removals
    subtree: true // Observe all descendants
  });
}

// --- Main Execution Flow ---

// Listen for messages from the extension (e.g., from the popup)
chrome.runtime.onMessage.addListener((message) => {
  if (message.command === 'toggleTheme') {
    toggleTheme(message.enable);
  }
});

// Apply theme on initial load based on stored preference
chrome.storage.sync.get('themeEnabled', (data) => {
  const themeEnabled = data.themeEnabled !== false; // Default to true if not set
  toggleTheme(themeEnabled);
});

// 1. Initial styling application after a short delay.
// This ensures that elements present on initial page load are styled correctly.
setTimeout(applyDynamicStyling, 500);

// 2. Create a debounced version of the styling function.
// This prevents applyDynamicStyling from being called too frequently during rapid DOM changes.
const debouncedApplyDynamicStyling = debounce(applyDynamicStyling, 100);

// 3. Wait for the main chat container to be present in the DOM.
// This is a critical element that indicates Telegram Web UI is loaded.
waitForElement('.Transitionable.chat-container', (chatContainer) => {
  // 4. Initialize a MutationObserver to watch for dynamic content changes within the chat container.
  // This is crucial for styling new messages, media, or other elements added to the chat.
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check if new nodes (elements) were added to the DOM.
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Call the debounced styling function to apply styles to newly added elements.
        debouncedApplyDynamicStyling();
        // Break after the first relevant mutation to avoid redundant calls within the same batch.
        break;
      }
    }
  });

  // Start observing the chat container and its entire subtree.
  // This ensures that changes deep within the chat (e.g., new messages within .MessageList)
  // are also detected.
  observer.observe(chatContainer, {
    childList: true, // Observe direct children additions/removals
    subtree: true // Observe all descendants
  });

  console.log("Telegram Blackhole Theme: MutationObserver is now watching the chat container for dynamic content.");
});
