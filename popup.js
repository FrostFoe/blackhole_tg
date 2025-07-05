document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleTheme');

  // Function to update button text
  function updateButtonText(themeEnabled) {
    toggleButton.textContent = themeEnabled ? 'Disable Theme' : 'Enable Theme';
  }

  // Load current theme state and update button
  chrome.storage.sync.get('themeEnabled', (data) => {
    const themeEnabled = data.themeEnabled !== false; // Default to true
    updateButtonText(themeEnabled);
  });

  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      chrome.storage.sync.get('themeEnabled', (data) => {
        const currentThemeEnabled = data.themeEnabled !== false;
        const newThemeEnabled = !currentThemeEnabled;

        // Save new state
        chrome.storage.sync.set({ themeEnabled: newThemeEnabled }, () => {
          // Send message to content script to toggle theme
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleTheme', enable: newThemeEnabled });
            }
          });
          // Update button text immediately
          updateButtonText(newThemeEnabled);
        });
      });
    });
  }
});