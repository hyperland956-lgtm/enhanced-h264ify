/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 alextrv
 * Copyright (c) 2015 erkserkserks
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

if (localStorage['enhanced-h264ify-block_60fps'] === undefined) localStorage['enhanced-h264ify-block_60fps'] = false;
if (localStorage['enhanced-h264ify-block_50fps'] === undefined) localStorage['enhanced-h264ify-block_50fps'] = false;
if (localStorage['enhanced-h264ify-block_h264'] === undefined) localStorage['enhanced-h264ify-block_h264'] = false;
if (localStorage['enhanced-h264ify-block_vp8'] === undefined) localStorage['enhanced-h264ify-block_vp8'] = true;
if (localStorage['enhanced-h264ify-block_vp9'] === undefined) localStorage['enhanced-h264ify-block_vp9'] = true;
if (localStorage['enhanced-h264ify-block_av1'] === undefined) localStorage['enhanced-h264ify-block_av1'] = true;
if (localStorage['enhanced-h264ify-block_opus'] === undefined) localStorage['enhanced-h264ify-block_opus'] = true;
if (localStorage['enhanced-h264ify-block_mp4a'] === undefined) localStorage['enhanced-h264ify-block_mp4a'] = true;
if (localStorage['enhanced-h264ify-disable_LN'] === undefined) localStorage['enhanced-h264ify-disable_LN'] = false;
if (localStorage['enhanced-h264ify-block_distractions'] === undefined) localStorage['enhanced-h264ify-block_distractions'] = false;

chrome.storage.local.get({
  block_60fps: false,
  block_50fps: false,
  block_h264: false,
  block_vp8: true,
  block_vp9: true,
  block_av1: true,
  block_opus: false,
  block_mp4a: false,
  disable_LN: false,
  block_distractions: false
}, function(options) {
  localStorage['enhanced-h264ify-block_60fps'] = options.block_60fps;
  localStorage['enhanced-h264ify-block_50fps'] = options.block_50fps;
  localStorage['enhanced-h264ify-block_h264'] = options.block_h264;
  localStorage['enhanced-h264ify-block_vp8'] = options.block_vp8;
  localStorage['enhanced-h264ify-block_vp9'] = options.block_vp9;
  localStorage['enhanced-h264ify-block_av1'] = options.block_av1;
  localStorage['enhanced-h264ify-block_opus'] = options.block_opus;
  localStorage['enhanced-h264ify-block_mp4a'] = options.block_mp4a;
  localStorage['enhanced-h264ify-disable_LN'] = options.disable_LN;
  localStorage['enhanced-h264ify-block_distractions'] = options.block_distractions;
  if (options.block_distractions) applyDistractionBlocking();
});

function applyDistractionBlocking() {
  if (!document.getElementById('enhanced-h264ify-distraction-style')) {
    const style = document.createElement('style');
    style.id = 'enhanced-h264ify-distraction-style';
    style.textContent = `
      #secondary,
      .ytd-watch-next-secondary-results-renderer.style-scope > .ytd-item-section-renderer.style-scope {
        display: none !important;
      }
      .enhanced-h264ify-relax-card {
        margin: 18px auto;
        max-width: 850px;
        border-radius: 18px;
        border: 1px solid rgba(0,0,0,0.1);
        padding: 24px;
        text-align: center;
        background: linear-gradient(135deg, #dbf4ff, #d7ffe7);
        box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        font-family: system-ui, sans-serif;
      }
      .enhanced-h264ify-relax-card .emoji {
        font-size: 2.1rem;
        display: block;
      }
      .enhanced-h264ify-relax-card .title {
        font-size: 1.35rem;
        color: #144658;
        margin-top: 8px;
        font-weight: 650;
      }
      .enhanced-h264ify-relax-card .desc {
        margin-top: 8px;
        color: #2f5b6d;
      }
    `;
    document.documentElement.appendChild(style);
  }

  const grid = document.querySelector('.ytd-two-column-browse-results-renderer.style-scope > .ytd-rich-grid-renderer.style-scope');
  if (grid && !document.querySelector('.enhanced-h264ify-relax-card')) {
    const card = document.createElement('section');
    card.className = 'enhanced-h264ify-relax-card';
    card.innerHTML = '<span class="emoji">😌 🌴🌴</span><div class="title">What are we looking for today?</div><div class="desc">Take a breath, keep it light, and pick something that feels good.</div>';
    grid.replaceWith(card);
  }
}

const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL('/src/inject/inject_codec_check.js');
injectScript.onload = function() { this.parentNode.removeChild(this); };
(document.head || document.documentElement).appendChild(injectScript);

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/src/inject/inject_ln.js');
    document.body.appendChild(script);
    if (localStorage['enhanced-h264ify-block_distractions'] === 'true') applyDistractionBlocking();
  }
};

new MutationObserver(function() {
  if (localStorage['enhanced-h264ify-block_distractions'] === 'true') applyDistractionBlocking();
}).observe(document.documentElement, { childList: true, subtree: true });
