# ⚡ WebP Express (v2.0 PRO) — Bulk Image to WebP Converter

A high-performance, ultra-modern, 100% client-side web application designed to batch convert, compress, and scale images (PNG, JPG, JPEG, GIF, BMP, TIFF, AVIF, SVG, ICO) into modern, high-efficiency **WebP** format directly inside the browser.

Zero uploads, zero servers, total privacy, and instant compression.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSZip](https://img.shields.io/badge/JSZip-3.10.1-orange.svg)](https://stuk.github.io/jszip/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#-privacy--security)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Why WebP?](#-why-webp)
- [Key Features](#-key-features)
- [Supported Formats](#-supported-formats)
- [Technical Constraints & Limitations](#-technical-constraints--limitations)
- [How It Works](#-how-it-works)
- [Quick Start Guide](#-quick-start-guide)
- [User Interface & Controls](#-user-interface--controls)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Browser Compatibility](#-browser-compatibility)
- [Project Structure](#-project-structure)
- [Privacy & Security](#-privacy--security)
- [License](#-license)

---

## 💡 About the Project

**WebP Express** was built to solve a common developer and designer pain point: converting batches of images into the modern WebP format quickly without sacrificing privacy, uploading sensitive assets to random cloud conversion servers, or struggling with complicated command-line utilities.

Built with pure vanilla web technologies (HTML5 Canvas, CSS3 Glassmorphism, and ES6+ JavaScript), the entire conversion lifecycle happens locally inside your web browser engine.

---

## 🎯 Why WebP?

- **30%–80% Smaller File Sizes**: WebP typically produces files 25–34% smaller than JPEG at comparable visual quality, and up to 80% smaller than unoptimized PNGs.
- **Transparency Support**: Supports full 8-bit alpha channel transparency (unlike standard JPEG).
- **Faster Web Page Load Times**: Drastically lowers page weight, improving Google Core Web Vitals (LCP) and SEO rankings.
- **Modern Standard**: Supported across all major modern browsers worldwide (>97% global support).

---

## ✨ Key Features

- 🔒 **100% Client-Side Privacy**: No backend server, no cloud storage, and no tracking. Your files never leave your device.
- ⚡ **Batch Image Processing**: Queue multiple files and process them sequentially with real-time progress tracking.
- 📋 **Direct Clipboard Paste Support**: Copy any screenshot or image to your clipboard and hit <kbd>Ctrl</kbd> + <kbd>V</kbd> (or <kbd>Cmd</kbd> + <kbd>V</kbd>) anywhere on the page to convert it instantly.
- 🔍 **Interactive Before / After Split Comparison Slider**: Visually inspect compression fidelity with a side-by-side draggable split comparison modal before saving.
- 🎚️ **Customizable Compression Quality**:
  - Continuous slider from 5% to 100%.
  - Quick 1-click presets: **Aggressive (50%)**, **Small (70%)**, **Balanced (80%)**, **High (92%)**, and **Lossless (100%)**.
- 📐 **Smart Dimension Rescaling**:
  - Percentage Scaling: 100% (Original), 85%, 75%, 50% (Half size).
  - Max Bounding Box Presets: Max 1920px (Full HD), Max 1280px (HD), Max 800px (Web Content), Max 400px (Thumbnails) with preserved aspect ratio.
- 🪟 **Alpha Transparency Preservation**: Cleanly retains transparent backgrounds for PNGs and icons without black fill artifacts.
- 🏷️ **Custom Filename Suffixes**: Append custom suffixes (e.g., `-min`, `_optimized`) or leave empty for clean output.
- 📦 **One-Click Batch ZIP Export**: Download individual WebP files or package the entire queue into a single `.zip` archive via JSZip.
- 📊 **Real-Time Savings Dashboard**: Instant breakdown of total files processed, original size, compressed size, and percentage storage saved.
- 🌓 **Dynamic Theme Switcher**: Fluid toggle between Deep Midnight Dark Mode and Crisp Light Pearl Mode with persistent preference saved in `localStorage`.
- 🎛️ **Dual View Layouts**: Toggle seamlessly between responsive Card Grid view and compact List view.

---

## 📂 Supported Formats

| Format | Extension | Input Support | Output Support | Notes |
|---|---|:---:|:---:|---|
| **WebP** | `.webp` | ✅ | ✅ | Direct conversion, re-compression, or resizing |
| **PNG** | `.png` | ✅ | ➡️ `.webp` | Preserves full 8-bit alpha transparency |
| **JPEG / JPG** | `.jpg`, `.jpeg` | ✅ | ➡️ `.webp` | High-efficiency compression |
| **GIF** | `.gif` | ✅ | ➡️ `.webp` | Converted as static frame (see [Constraints](#-technical-constraints--limitations)) |
| **BMP** | `.bmp` | ✅ | ➡️ `.webp` | Full lossless decompression to WebP |
| **TIFF** | `.tif`, `.tiff` | ✅ | ➡️ `.webp` | Depends on browser TIFF codec support |
| **AVIF** | `.avif` | ✅ | ➡️ `.webp` | Supported on modern browsers with AVIF decoding |
| **SVG** | `.svg` | ✅ | ➡️ `.webp` | Rasterized to canvas at native dimensions |
| **ICO** | `.ico` | ✅ | ➡️ `.webp` | Icon conversion |

---

## ⚠️ Technical Constraints & Limitations

Understanding the operational boundaries and technical constraints of in-browser client-side conversion:

### 1. In-Browser Memory (RAM) Limitations
- All image decoding, canvas manipulation, and blob generation happen inside the browser process's memory space.
- Processing batches with dozens of ultra-high-resolution images (e.g., 40+ megapixel RAW/DSLR photos) may consume high RAM. The app features automatic memory cleanup (`URL.revokeObjectURL`) on queue clearing to prevent memory leaks.

### 2. Animated Format Conversion (GIF & Animated WebP)
- Standard HTML5 2D Canvas rendering draws only the **first frame** of an animated GIF or animated WebP.
- Consequently, animated inputs are converted into **static single-frame WebP images**.

### 3. Vector SVG Rasterization
- When an SVG vector graphic is converted to WebP, it is rasterized at its native viewBox or intrinsic dimensions. It will become a pixel-based raster image in the final WebP output.

### 4. Browser Canvas Size Limits
- HTML5 Canvas imposes maximum width/height limits depending on browser and GPU hardware (typically 16,384 x 16,384 pixels or 32,767 x 32,767 pixels on desktop). Images exceeding these dimensions will be constrained by the browser's maximum canvas limit.

### 5. Client Hardware-Bound Speed
- Because conversions run locally on your device's CPU/GPU rather than a dedicated cloud server cluster, batch conversion speed scales with your local machine's processor and available memory.

---

## ⚙️ How It Works

```
[ Image Input (Drag & Drop / Picker / Ctrl+V) ]
                   │
                   ▼
       [ HTML5 File API & Blob URL ]
                   │
                   ▼
     [ In-Memory HTML5 Image Object ]
                   │
                   ▼
  [ Dimension Scaling & Aspect Ratio Logic ]
                   │
                   ▼
   [ Offscreen HTML5 2D Canvas Context ]
   - High-quality image smoothing
   - Alpha channel transparency preserved
                   │
                   ▼
 [ canvas.toBlob('image/webp', qualityFactor) ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[ Single Download ]   [ JSZip Archive ]
```

1. **File Ingestion**: Files dropped, selected, or pasted via clipboard are converted to temporary object URLs (`URL.createObjectURL`).
2. **Dimension Scaling**: If a scale factor or maximum dimension (e.g., 1920px Full HD) is selected, target dimensions are calculated maintaining original aspect ratio.
3. **Canvas Drawing**: An in-memory canvas element is allocated with target dimensions. The image is drawn with high-quality cubic interpolation smoothing enabled.
4. **Encoding**: The browser's native `canvas.toBlob('image/webp', quality)` encodes the canvas bitmap into a compressed WebP binary.
5. **Memory Cleanup & Packaging**: Resulting blobs are bundled into JSZip or made available for immediate one-click download.

---

## 🚀 Quick Start Guide

### Zero Setup / No Installation Required
WebP Express requires **no dependencies, no build steps, and no Node.js runtime**.

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/webp-converter.git
   ```
2. **Open `index.html`**:
   - Simply double-click **`index.html`** in your file manager, or
   - Right-click and choose **Open with** (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, or Safari).

### (Optional) Serve via Local HTTP Server
If you prefer running through a local web server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```
Then visit `http://localhost:8080` in your browser.

---

## 🖥️ User Interface & Controls

| Element | Description |
|---|---|
| **Drop Zone** | Large target area supporting multi-file drag-and-drop or standard file picker dialog. |
| **Quality Slider** | Precision slider adjusting WebP compression quality from 5% (high compression) to 100% (lossless). |
| **Quality Presets** | Instant one-click selection for **50%**, **70%**, **80%**, **92%**, and **100%**. |
| **Alpha Transparency Toggle** | Preserves transparent background channels for PNGs and icons. |
| **Scale / Resize Dropdown** | Scale by percentage (100%, 85%, 75%, 50%) or fit within maximum dimensions (1920px, 1280px, 800px, 400px). |
| **Filename Suffix Field** | Appends custom text before `.webp` extension (e.g. `image_optimized.webp`). |
| **Auto-Download ZIP Toggle** | Automatically creates and triggers download of a `.zip` archive upon batch completion. |
| **Split Comparison Modal** | Interactive draggable slider to compare original vs converted images side-by-side with zoom preview. |
| **Theme Toggle** | Switches between Dark Mode and Light Pearl Mode. |
| **View Toggle** | Switches card layout between Grid View and compact List View. |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>V</kbd> / <kbd>Cmd</kbd> + <kbd>V</kbd> | Paste copied image or screenshot directly from clipboard into queue |
| <kbd>Esc</kbd> | Close Before/After comparison modal |

---

## 🌐 Browser Compatibility

WebP Express is compatible with all modern evergreen browsers supporting the HTML5 Canvas WebP export API (`canvas.toBlob('image/webp')`):

| Browser | Supported Version | Notes |
|---|:---:|---|
| **Google Chrome** | 32+ | Full Support |
| **Microsoft Edge** | 79+ | Full Support |
| **Mozilla Firefox** | 65+ | Full Support |
| **Apple Safari** | 14+ | Full Support on macOS Big Sur (11+) & iOS 14+ |
| **Opera** | 19+ | Full Support |
| **Brave / Vivaldi** | All | Full Support |

---

## 📁 Project Structure

```text
webp-converter/
├── index.html          # Semantic HTML5 markup, accessibility attributes & layout structure
├── style.css           # Glassmorphism 3.0 design system, CSS variables & animations
├── app.js              # Pure JavaScript conversion engine, event listeners & JSZip logic
└── README.md           # Documentation, usage guide, architecture & technical constraints
```

---

## 🔒 Privacy & Security

- **Zero Cloud Ingestion**: Images are processed strictly within the client browser instance using JavaScript and HTML5 Canvas.
- **No Analytics / Telemetry**: No user data, filenames, or images are transmitted over network sockets or telemetry endpoints.
- **Offline Capable**: Works completely offline without an active internet connection once loaded.

---

## 📄 License

This project is open-source and released under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it for personal or commercial projects.
