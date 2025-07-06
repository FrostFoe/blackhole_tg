/**
 * content.js
 * Telegram Blackhole Theme
 *
 * This script ensures the theme is applied consistently, especially
 * to dynamically loaded content within Telegram Web. It uses MutationObserver
 * for efficient DOM monitoring and debouncing for performance optimization.
 */

console.log("Telegram Blackhole Theme: content.js loaded.");

function applyColors(colors) {
  const root = document.documentElement;
  root.style.setProperty('--background-color', colors.backgroundColor);
  root.style.setProperty('--text-color', colors.textColor);
  root.style.setProperty('--primary-color', colors.primaryColor);
  root.style.setProperty('--accent-color', colors.accentColor);
  // Add other colors as needed
}

function toggleTheme(enable) {
  document.body.classList.toggle('blackhole-theme', enable);
  if (enable) {
    document.body.classList.add('blackhole-theme-loaded');
  }
  console.log(`Telegram Blackhole Theme: Theme ${enable ? 'enabled' : 'disabled'}.`);
}

function applyDynamicStyling() {
  try {
    const mediaImages = document.querySelectorAll('.Message .media-container img');
    mediaImages.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
    });
  } catch (error) {
    console.error("Telegram Blackhole Theme: Error applying dynamic styling:", error);
  }
}

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function waitForElement(selector, callback, timeout = 10000) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const foundElement = document.querySelector(selector);
    if (foundElement) {
      callback(foundElement);
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    observer.disconnect();
  }, timeout);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.command === 'toggleTheme') {
    toggleTheme(message.enable);
  } else if (message.command === 'applyColors') {
    applyColors(message.colors);
  }
});

chrome.storage.sync.get(['themeEnabled', 'customColors'], (data) => {
  const themeEnabled = data.themeEnabled !== false;
  toggleTheme(themeEnabled);
  if (themeEnabled && data.customColors) {
    applyColors(data.customColors);
  }
});

setTimeout(applyDynamicStyling, 500);

const debouncedApplyDynamicStyling = debounce(applyDynamicStyling, 100);

waitForElement('.Transitionable.chat-container', (chatContainer) => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        debouncedApplyDynamicStyling();
        break;
      }
    }
  });

  observer.observe(chatContainer, { 
    childList: true,
    subtree: true
  });

  console.log("Telegram Blackhole Theme: MutationObserver is now watching the chat container for dynamic content.");
});