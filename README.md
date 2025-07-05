# Telegram Blackhole Theme

An immersive, ultra-dark "blackhole" theme for Telegram Web.

## Installation

To install this theme as a browser extension, follow these steps:

### Google Chrome / Microsoft Edge

1.  **Download the repository:** Download the entire repository as a ZIP file and extract it to a local folder, or clone the repository using Git.
2.  **Open Extension Management:**
    *   Open Chrome/Edge.
    *   Type `chrome://extensions` (for Chrome) or `edge://extensions` (for Edge) in the address bar and press Enter.
3.  **Enable Developer Mode:** In the top right corner, toggle on "Developer mode".
4.  **Load Unpacked:** Click on the "Load unpacked" button.
5.  **Select the Extension Folder:** Navigate to the folder where you extracted/cloned the `tg` repository (e.g., `/path/to/tg/`) and select it.
6.  **Verify Installation:** The "Telegram Blackhole Theme" extension should now appear in your list of extensions. Make sure it's enabled.

### Mozilla Firefox

Firefox has stricter requirements for loading unpacked extensions. While you can temporarily load it for testing, for permanent installation, it's usually done via `about:debugging` or by signing the extension.

#### Temporary Installation (for testing):

1.  **Download the repository:** Download the entire repository as a ZIP file and extract it to a local folder, or clone the repository using Git.
2.  **Open `about:debugging`:**
    *   Open Firefox.
    *   Type `about:debugging#/runtime/this-firefox` in the address bar and press Enter.
3.  **Load Temporary Add-on:** Click on "Load Temporary Add-on...".
4.  **Select `manifest.json`:** Navigate to the `tg` folder and select the `manifest.json` file.
5.  **Verify Installation:** The extension will be loaded, but it will be removed when you close Firefox.

For a permanent Firefox installation, you would typically need to sign the extension through Mozilla's Add-ons site.

## Usage

Once installed and enabled, simply navigate to [web.telegram.org](https://web.telegram.org/). The theme should automatically apply, transforming your Telegram Web interface into a sleek, dark "blackhole" experience.

## Customization

If you wish to customize the theme, you can edit the `styles.css` file directly within the extension's folder. After making changes, you may need to:

*   **Chrome/Edge:** Go to `chrome://extensions` / `edge://extensions` and click the refresh icon on the "Telegram Blackhole Theme" extension card.
*   **Firefox:** Reload the temporary add-on via `about:debugging`.

## Contributing

Feel free to fork this repository, make improvements, and submit pull requests. Suggestions and bug reports are welcome!