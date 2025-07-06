document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleTheme');

  function updateButtonText(themeEnabled) {
    toggleButton.textContent = themeEnabled ? 'Disable Theme' : 'Enable Theme';
  }

  chrome.storage.sync.get('themeEnabled', (data) => {
    const themeEnabled = data.themeEnabled !== false;
    updateButtonText(themeEnabled);
  });

  toggleButton.addEventListener('click', function() {
    chrome.storage.sync.get('themeEnabled', (data) => {
      const newThemeEnabled = !(data.themeEnabled !== false);

      chrome.storage.sync.set({ themeEnabled: newThemeEnabled }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleTheme', enable: newThemeEnabled });
          }
        });
        updateButtonText(newThemeEnabled);
      });
    });
  });
});