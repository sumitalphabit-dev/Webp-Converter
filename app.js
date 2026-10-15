/**
 * ⚡ WebP Express (v2.0 PRO)
 * Ultra-Fast, 100% Client-Side Private Batch Image to WebP Converter
 * Features: Multi-format support, Split Comparison Slider, Clipboard Paste, 
 * Advanced Scaling & Dimensions, Dynamic Light/Dark Themes, ZIP export.
 */

(() => {
  'use strict';

  // --- Global State ---
  const state = {
    items: [],             // Array of item objects
    quality: 0.80,         // Default 80% (0.80)
    isConverting: false,
    viewMode: 'grid',      // 'grid' or 'list'
    theme: localStorage.getItem('webp_theme') || 'dark',
    activeModalItem: null,
  };

  // --- DOM Elements ---
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityBadge = document.getElementById('qualityBadge');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const preserveTransparency = document.getElementById('preserveTransparency');
  const autoDownloadZip = document.getElementById('autoDownloadZip');
  const resizeScaleSelect = document.getElementById('resizeScaleSelect');
  const filenameSuffixInput = document.getElementById('filenameSuffixInput');
  const advancedToggleBtn = document.getElementById('advancedToggleBtn');
  const advancedSettings = document.getElementById('advancedSettings');
  const queueCounter = document.getElementById('queueCounter');
  const queuePillCount = document.getElementById('queuePillCount');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const convertAllBtn = document.getElementById('convertAllBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');
  const progressContainer = document.getElementById('progressContainer');
  const progressStatus = document.getElementById('progressStatus');
  const progressPct = document.getElementById('progressPct');
  const progressBarFill = document.getElementById('progressBarFill');
  const statsDashboard = document.getElementById('statsDashboard');
  const statFilesCount = document.getElementById('statFilesCount');
  const statOrigSize = document.getElementById('statOrigSize');
  const statConvSize = document.getElementById('statConvSize');
  const statSaved = document.getElementById('statSaved');
  const queueGrid = document.getElementById('queueGrid');
  const emptyPlaceholder = document.getElementById('emptyPlaceholder');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const pasteBadge = document.getElementById('pasteBadge');
  const toastContainer = document.getElementById('toastContainer');

  // Modal Elements
  const compareModal = document.getElementById('compareModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalFileName = document.getElementById('modalFileName');
  const compareContainer = document.getElementById('compareContainer');
  const compareOriginalImg = document.getElementById('compareOriginalImg');
  const compareConvertedImg = document.getElementById('compareConvertedImg');
  const compareClippedWrapper = document.getElementById('compareClippedWrapper');
  const compareDivider = document.getElementById('compareDivider');
  const modalOrigMeta = document.getElementById('modalOrigMeta');
  const modalConvMeta = document.getElementById('modalConvMeta');
  const modalSavingsBadge = document.getElementById('modalSavingsBadge');
  const modalDims = document.getElementById('modalDims');
  const modalDownloadBtn = document.getElementById('modalDownloadBtn');

  // --- Theme Management ---
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webp_theme', theme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  applyTheme(state.theme);

  // --- Advanced Settings Toggle ---
  advancedToggleBtn.addEventListener('click', () => {
    const isOpen = advancedSettings.classList.toggle('open');
    advancedToggleBtn.classList.toggle('open', isOpen);
  });

  // --- Utility Functions ---
  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '⚡';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px) scale(0.95)';
      setTimeout(() => toast.remove(), 350);
    }, 4200);
  }

  function getBaseFileName(fileName) {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? fileName : fileName.substring(0, lastDot);
  }

  // --- Drag & Drop & Paste Handlers ---
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    window.addEventListener(eventName, preventDefaults, false);
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      handleIncomingFiles(dt.files);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(e.target.files);
      fileInput.value = ''; // Reset input to allow re-selection
    }
  });

  // Clipboard Paste Support (Ctrl+V)
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    const files = [];
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
          const file = new File([blob], `pasted_image_${timestamp}.png`, { type: blob.type });
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      handleIncomingFiles(files);
      showToast(`Pasted ${files.length} image from clipboard!`, 'success');
    }
  });

  pasteBadge.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        const files = [];
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
              const file = new File([blob], `pasted_image_${timestamp}.png`, { type });
              files.push(file);
            }
          }
        }
        if (files.length > 0) {
          handleIncomingFiles(files);
          showToast(`Pasted ${files.length} image from clipboard!`, 'success');
        } else {
          showToast('No image in clipboard. Copy an image first and click or press Ctrl+V.', 'info');
        }
      } else {
        showToast('Press Ctrl+V to paste copied images directly.', 'info');
      }
    } catch (err) {
      showToast('Press Ctrl+V anywhere on the page to paste images.', 'info');
    }
  });

  // --- File Ingestion ---
  function handleIncomingFiles(files) {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/avif', 'image/x-icon'];
    let addedCount = 0;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/') && !supportedTypes.includes(file.type)) {
        return;
      }

      const id = 'img_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      const previewUrl = URL.createObjectURL(file);

      const item = {
        id,
        file,
        name: file.name,
        origSize: file.size,
        previewUrl,
        convertedBlob: null,
        convertedUrl: null,
        convertedSize: null,
        status: 'pending', // pending, converting, success, error
        errorMsg: null,
        origWidth: 0,
        origHeight: 0,
        outWidth: 0,
        outHeight: 0
      };

      state.items.push(item);
      addedCount++;

      renderItemCard(item);
    });

    if (addedCount > 0) {
      updateUIQueueState();
      showToast(`Added ${addedCount} image${addedCount > 1 ? 's' : ''} to queue.`, 'info');
    } else {
      showToast('No valid image files detected.', 'error');
    }
  }

  // --- Render Item in DOM ---
  function renderItemCard(item) {
    if (emptyPlaceholder) {
      emptyPlaceholder.style.display = 'none';
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.id = `card_${item.id}`;

    card.innerHTML = `
      <div class="item-preview-row">
        <div class="item-thumb-wrapper" id="thumb_${item.id}" title="Click to view & compare">
          <img src="${item.previewUrl}" alt="${item.name}" class="item-thumb" loading="lazy">
          <div class="item-thumb-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </div>
        </div>
        <div class="item-details">
          <h4 class="item-filename" title="${item.name}">${item.name}</h4>
          <div class="item-meta">
            <span class="item-size">${formatBytes(item.origSize)}</span>
            <span class="status-pill status-pending" id="status_${item.id}">Ready</span>
          </div>
        </div>
      </div>
      <div class="item-size-box" id="sizeBox_${item.id}" style="display: none;">
        <span class="size-original">${formatBytes(item.origSize)}</span>
        <span class="size-arrow">→</span>
        <span class="size-converted" id="convSize_${item.id}">—</span>
        <span class="size-saved" id="savedPct_${item.id}">—</span>
      </div>
      <div class="item-actions">
        <div class="item-action-btns">
          <button class="item-download-btn" id="dlBtn_${item.id}" style="display: none;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download</span>
          </button>
          <button class="item-compare-btn" id="cmpBtn_${item.id}" style="display: none;" title="Compare Original vs WebP">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 0 20z"></path></svg>
            <span>Compare</span>
          </button>
        </div>
        <button class="item-remove-btn" id="rmBtn_${item.id}" title="Remove image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    // Remove Button Handler
    card.querySelector(`#rmBtn_${item.id}`).addEventListener('click', () => {
      removeItem(item.id);
    });

    // Individual Download Handler
    card.querySelector(`#dlBtn_${item.id}`).addEventListener('click', () => {
      if (item.convertedBlob) {
        const outName = getOutputFileName(item.name);
        downloadBlob(item.convertedBlob, outName);
      }
    });

    // Compare Modal Handlers
    card.querySelector(`#cmpBtn_${item.id}`).addEventListener('click', () => {
      openCompareModal(item);
    });
    card.querySelector(`#thumb_${item.id}`).addEventListener('click', () => {
      openCompareModal(item);
    });

    queueGrid.appendChild(card);
  }

  function getOutputFileName(originalName) {
    const base = getBaseFileName(originalName);
    const suffix = (filenameSuffixInput && filenameSuffixInput.value.trim()) || '';
    return `${base}${suffix}.webp`;
  }

  function removeItem(id) {
    const idx = state.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      const item = state.items[idx];
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      state.items.splice(idx, 1);

      const card = document.getElementById(`card_${id}`);
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.remove(), 200);
      }

      updateUIQueueState();
      updateStatsSummary();
    }
  }

  function clearAll() {
    if (state.isConverting) return;
    state.items.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    state.items = [];
    queueGrid.innerHTML = '';
    if (emptyPlaceholder) {
      queueGrid.appendChild(emptyPlaceholder);
      emptyPlaceholder.style.display = 'block';
    }
    updateUIQueueState();
    statsDashboard.style.display = 'none';
    downloadZipBtn.style.display = 'none';
    progressContainer.style.display = 'none';
    showToast('Queue cleared.', 'info');
  }

  function updateUIQueueState() {
    const count = state.items.length;
    queueCounter.textContent = `${count} image${count !== 1 ? 's' : ''} in queue`;
    queuePillCount.textContent = `${count} Item${count !== 1 ? 's' : ''}`;

    if (count > 0) {
      clearAllBtn.style.display = 'inline-flex';
      convertAllBtn.disabled = state.isConverting;
      if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
    } else {
      clearAllBtn.style.display = 'none';
      convertAllBtn.disabled = true;
      if (emptyPlaceholder) emptyPlaceholder.style.display = 'block';
    }
  }

  // --- Quality Slider and Preset Controls ---
  function updateQuality(val) {
    state.quality = val / 100;
    qualitySlider.value = val;

    let desc = 'Balanced';
    if (val >= 98) desc = 'Lossless / Ultra';
    else if (val >= 90) desc = 'High Quality';
    else if (val >= 75) desc = 'Balanced';
    else if (val >= 60) desc = 'Small File';
    else desc = 'Aggressive';

    qualityBadge.textContent = `${val}% (${desc})`;

    // Highlight active preset button
    presetBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.quality) === parseInt(val));
    });
  }

  qualitySlider.addEventListener('input', (e) => {
    updateQuality(parseInt(e.target.value));
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateQuality(parseInt(btn.dataset.quality));
    });
  });

  // --- Image to WebP Conversion Engine (Canvas API with Scaling) ---
  async function convertImageToWebP(item, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          item.origWidth = img.naturalWidth || img.width;
          item.origHeight = img.naturalHeight || img.height;

          // Calculate output dimensions based on scale selection
          let targetW = item.origWidth;
          let targetH = item.origHeight;
          const scaleMode = resizeScaleSelect ? resizeScaleSelect.value : '1';

          if (scaleMode.startsWith('max-')) {
            const maxDimension = parseInt(scaleMode.replace('max-', ''));
            if (targetW > maxDimension || targetH > maxDimension) {
              if (targetW >= targetH) {
                targetH = Math.round((targetH * maxDimension) / targetW);
                targetW = maxDimension;
              } else {
                targetW = Math.round((targetW * maxDimension) / targetH);
                targetH = maxDimension;
              }
            }
          } else {
            const factor = parseFloat(scaleMode) || 1;
            targetW = Math.max(1, Math.round(item.origWidth * factor));
            targetH = Math.max(1, Math.round(item.origHeight * factor));
          }

          item.outWidth = targetW;
          item.outHeight = targetH;

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;

          const ctx = canvas.getContext('2d', { alpha: preserveTransparency.checked });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw scaled image to canvas
          ctx.drawImage(img, 0, 0, targetW, targetH);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas conversion produced empty output.'));
              return;
            }
            resolve(blob);
          }, 'image/webp', quality);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to decode image file.'));
      };

      img.src = item.previewUrl;
    });
  }

  // --- Batch Conversion Orchestrator ---
  async function startBatchConversion() {
    if (state.isConverting || state.items.length === 0) return;

    state.isConverting = true;
    convertAllBtn.disabled = true;
    clearAllBtn.disabled = true;
    downloadZipBtn.style.display = 'none';

    // Show Progress Bar
    progressContainer.style.display = 'flex';
    progressBarFill.style.width = '0%';
    progressPct.textContent = '0%';
    progressStatus.textContent = 'Optimizing images...';

    const total = state.items.length;
    let completed = 0;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < total; i++) {
      const item = state.items[i];
      updateItemStatus(item.id, 'converting', 'Converting...');
      progressStatus.textContent = `Optimizing (${i + 1}/${total}) ${item.name}...`;

      try {
        const webpBlob = await convertImageToWebP(item, state.quality);
        item.convertedBlob = webpBlob;
        item.convertedUrl = URL.createObjectURL(webpBlob);
        item.convertedSize = webpBlob.size;
        item.status = 'success';
        successCount++;

        updateItemSuccessUI(item);
      } catch (err) {
        console.error(`Error converting ${item.name}:`, err);
        item.status = 'error';
        item.errorMsg = err.message || 'Conversion error';
        errorCount++;
        updateItemStatus(item.id, 'error', 'Failed');
      }

      completed++;
      const pct = Math.round((completed / total) * 100);
      progressBarFill.style.width = `${pct}%`;
      progressPct.textContent = `${pct}%`;

      updateStatsSummary();
    }

    state.isConverting = false;
    convertAllBtn.disabled = false;
    clearAllBtn.disabled = false;
    progressStatus.textContent = `Completed: ${successCount} optimized, ${errorCount} errors.`;

    if (successCount > 0) {
      downloadZipBtn.style.display = 'inline-flex';
      showToast(`Batch completed! Successfully converted ${successCount} image${successCount > 1 ? 's' : ''}.`, 'success');

      if (autoDownloadZip.checked) {
        downloadAllAsZip();
      }
    } else {
      showToast('Conversion encountered errors.', 'error');
    }
  }

  function updateItemStatus(id, statusClass, text) {
    const pill = document.getElementById(`status_${id}`);
    if (pill) {
      pill.className = `status-pill status-${statusClass}`;
      pill.textContent = text;
    }
  }

  function updateItemSuccessUI(item) {
    updateItemStatus(item.id, 'success', 'WebP Ready');

    const sizeBox = document.getElementById(`sizeBox_${item.id}`);
    const convSizeEl = document.getElementById(`convSize_${item.id}`);
    const savedPctEl = document.getElementById(`savedPct_${item.id}`);
    const dlBtn = document.getElementById(`dlBtn_${item.id}`);
    const cmpBtn = document.getElementById(`cmpBtn_${item.id}`);

    if (sizeBox && convSizeEl && savedPctEl) {
      sizeBox.style.display = 'flex';
      convSizeEl.textContent = formatBytes(item.convertedSize);

      const diff = item.origSize - item.convertedSize;
      const pct = (diff / item.origSize) * 100;

      if (diff > 0) {
        savedPctEl.textContent = `-${pct.toFixed(0)}%`;
        savedPctEl.style.color = '#34d399';
      } else {
        savedPctEl.textContent = `+${Math.abs(pct).toFixed(0)}%`;
        savedPctEl.style.color = '#fbbf24';
      }
    }

    if (dlBtn) dlBtn.style.display = 'inline-flex';
    if (cmpBtn) cmpBtn.style.display = 'inline-flex';
  }

  // --- Statistics Summary ---
  function updateStatsSummary() {
    const convertedItems = state.items.filter(i => i.status === 'success');
    if (convertedItems.length === 0) return;

    statsDashboard.style.display = 'grid';

    let totalOrig = 0;
    let totalConv = 0;

    convertedItems.forEach(i => {
      totalOrig += i.origSize;
      totalConv += i.convertedSize;
    });

    const savedBytes = Math.max(0, totalOrig - totalConv);
    const savedPct = totalOrig > 0 ? ((savedBytes / totalOrig) * 100).toFixed(1) : 0;

    statFilesCount.textContent = `${convertedItems.length} / ${state.items.length}`;
    statOrigSize.textContent = formatBytes(totalOrig);
    statConvSize.textContent = formatBytes(totalConv);
    statSaved.textContent = `${formatBytes(savedBytes)} (${savedPct}%)`;
  }

  // --- Comparison Modal Logic ---
  function openCompareModal(item) {
    state.activeModalItem = item;
    modalFileName.textContent = item.name;
    compareOriginalImg.src = item.previewUrl;
    compareConvertedImg.src = item.convertedUrl || item.previewUrl;

    modalOrigMeta.textContent = formatBytes(item.origSize);
    modalConvMeta.textContent = item.convertedSize ? formatBytes(item.convertedSize) : 'Pending';

    if (item.convertedSize) {
      const diff = item.origSize - item.convertedSize;
      const pct = (diff / item.origSize) * 100;
      modalSavingsBadge.textContent = diff > 0 ? `Saved ${pct.toFixed(0)}%` : `+${Math.abs(pct).toFixed(0)}%`;
    } else {
      modalSavingsBadge.textContent = '—';
    }

    const dims = item.outWidth ? `${item.outWidth} × ${item.outHeight} px` : `${item.origWidth || '—'} px`;
    modalDims.textContent = dims;

    // Reset divider position to 50%
    setComparePosition(50);

    compareModal.style.display = 'flex';
  }

  function closeCompareModal() {
    compareModal.style.display = 'none';
    state.activeModalItem = null;
  }

  modalCloseBtn.addEventListener('click', closeCompareModal);
  modalDismissBtn.addEventListener('click', closeCompareModal);
  compareModal.addEventListener('click', (e) => {
    if (e.target === compareModal) closeCompareModal();
  });

  modalDownloadBtn.addEventListener('click', () => {
    if (state.activeModalItem && state.activeModalItem.convertedBlob) {
      const outName = getOutputFileName(state.activeModalItem.name);
      downloadBlob(state.activeModalItem.convertedBlob, outName);
    } else if (state.activeModalItem) {
      showToast('Converting image for download...', 'info');
      convertImageToWebP(state.activeModalItem, state.quality).then(blob => {
        state.activeModalItem.convertedBlob = blob;
        const outName = getOutputFileName(state.activeModalItem.name);
        downloadBlob(blob, outName);
      });
    }
  });

  // Slider Dragging Functionality
  function setComparePosition(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    compareClippedWrapper.style.width = `${clamped}%`;
    compareDivider.style.left = `${clamped}%`;
  }

  let isDraggingCompare = false;

  function updateCompareDrag(e) {
    if (!isDraggingCompare) return;
    const rect = compareContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const pct = (offset / rect.width) * 100;
    setComparePosition(pct);
  }

  compareContainer.addEventListener('mousedown', (e) => {
    isDraggingCompare = true;
    updateCompareDrag(e);
  });

  compareContainer.addEventListener('touchstart', (e) => {
    isDraggingCompare = true;
    updateCompareDrag(e);
  });

  window.addEventListener('mousemove', updateCompareDrag);
  window.addEventListener('touchmove', updateCompareDrag);

  window.addEventListener('mouseup', () => { isDraggingCompare = false; });
  window.addEventListener('touchend', () => { isDraggingCompare = false; });

  // --- Download & ZIP Handling ---
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadAllAsZip() {
    const successItems = state.items.filter(i => i.status === 'success' && i.convertedBlob);
    if (successItems.length === 0) {
      showToast('No converted WebP images to download.', 'error');
      return;
    }

    if (typeof JSZip === 'undefined') {
      showToast('JSZip library is still loading. Please wait...', 'error');
      return;
    }

    downloadZipBtn.disabled = true;
    downloadZipBtn.innerHTML = `<span>Packing ZIP Archive...</span>`;

    try {
      const zip = new JSZip();
      const folder = zip.folder('webp_images');

      successItems.forEach(item => {
        const outName = getOutputFileName(item.name);
        folder.file(outName, item.convertedBlob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(zipBlob, `webp_express_batch_${timestamp}.zip`);
      showToast('ZIP archive downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error generating ZIP:', err);
      showToast(`Failed to package ZIP: ${err.message}`, 'error');
    } finally {
      downloadZipBtn.disabled = false;
      downloadZipBtn.innerHTML = `
        <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Download All as ZIP</span>
      `;
    }
  }

  // --- View Mode Toggles ---
  gridViewBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    queueGrid.classList.remove('list-view');
  });

  listViewBtn.addEventListener('click', () => {
    state.viewMode = 'list';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    queueGrid.classList.add('list-view');
  });

  // --- Global Event Attachments ---
  convertAllBtn.addEventListener('click', startBatchConversion);
  downloadZipBtn.addEventListener('click', downloadAllAsZip);
  clearAllBtn.addEventListener('click', clearAll);

  // Initialize
  updateQuality(80);
})();
