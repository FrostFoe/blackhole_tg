document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleTheme');
  const backgroundColorPicker = document.getElementById('backgroundColor');
  const textColorPicker = document.getElementById('textColor');
  const primaryColorPicker = document.getElementById('primaryColor');
  const accentColorPicker = document.getElementById('accentColor');
  const resetColorsButton = document.getElementById('resetColors');

  const defaultColors = {
    backgroundColor: '#000000',
    textColor: '#e0e0e0',
    primaryColor: '#1a1a1a',
    accentColor: '#5e35b1'
  };

  function updateButtonText(themeEnabled) {
    toggleButton.textContent = themeEnabled ? 'Disable Theme' : 'Enable Theme';
  }

  function applyColorsToPickers(colors) {
    backgroundColorPicker.value = colors.backgroundColor;
    textColorPicker.value = colors.textColor;
    primaryColorPicker.value = colors.primaryColor;
    accentColorPicker.value = colors.accentColor;
  }

  function sendColorsToContentScript(colors) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { command: 'applyColors', colors: colors });
      }
    });
  }

  // Load initial state and colors
  chrome.storage.sync.get(['themeEnabled', 'customColors'], (data) => {
    const themeEnabled = data.themeEnabled !== false;
    updateButtonText(themeEnabled);

    const customColors = data.customColors || defaultColors;
    applyColorsToPickers(customColors);

    // Send initial colors to content script if theme is enabled
    if (themeEnabled) {
      sendColorsToContentScript(customColors);
    }
  });

  // Toggle theme button listener
  toggleButton.addEventListener('click', function() {
    chrome.storage.sync.get('themeEnabled', (data) => {
      const newThemeEnabled = !(data.themeEnabled !== false);

      chrome.storage.sync.set({ themeEnabled: newThemeEnabled }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleTheme', enable: newThemeEnabled });
            if (newThemeEnabled) {
              // If enabling, also send current custom colors
              chrome.storage.sync.get('customColors', (colorData) => {
                sendColorsToContentScript(colorData.customColors || defaultColors);
              });
            }
          }
        });
        updateButtonText(newThemeEnabled);
      });
    });
  });

  // Color picker change listeners
  [backgroundColorPicker, textColorPicker, primaryColorPicker, accentColorPicker].forEach(picker => {
    picker.addEventListener('input', function() {
      const newColors = {
        backgroundColor: backgroundColorPicker.value,
        textColor: textColorPicker.value,
        primaryColor: primaryColorPicker.value,
        accentColor: accentColorPicker.value
      };
      chrome.storage.sync.set({ customColors: newColors }, () => {
        sendColorsToContentScript(newColors);
      });
    });
  });

  // Reset colors button listener
  resetColorsButton.addEventListener('click', function() {
    applyColorsToPickers(defaultColors);
    chrome.storage.sync.set({ customColors: defaultColors }, () => {
      sendColorsToContentScript(defaultColors);
    });
  });
});