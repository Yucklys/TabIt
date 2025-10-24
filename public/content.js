// Content script for Tab Sense Chrome Extension
// This script runs on all web pages to extract content

(function() {
  'use strict';

  // Extract page content and send to background script
  function extractPageContent() {
    const content = {
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
      timestamp: Date.now(),
      content: '',
      metaDescription: '',
      headings: [],
      images: [],
      links: []
    };

    // Extract main content
    const mainContent = document.querySelector('main') || 
                       document.querySelector('article') || 
                       document.querySelector('.content') ||
                       document.querySelector('#content') ||
                       document.body;

    if (mainContent) {
      // Get text content
      const walker = document.createTreeWalker(
        mainContent,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip script and style elements
            if (node.parentElement.tagName === 'SCRIPT' || 
                node.parentElement.tagName === 'STYLE') {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        },
        false
      );
      
      let text = '';
      let node;
      while (node = walker.nextNode()) {
        text += node.textContent + ' ';
      }
      content.content = text.substring(0, 3000); // Limit content length
    }

    // Extract meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      content.metaDescription = metaDesc.content;
    }

    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    content.headings = Array.from(headings).map(h => ({
      level: parseInt(h.tagName.charAt(1)),
      text: h.textContent.trim()
    }));

    // Extract images (first 5)
    const images = document.querySelectorAll('img[src]');
    content.images = Array.from(images).slice(0, 5).map(img => ({
      src: img.src,
      alt: img.alt || '',
      title: img.title || ''
    }));

    // Extract links (first 10)
    const links = document.querySelectorAll('a[href]');
    content.links = Array.from(links).slice(0, 10).map(link => ({
      href: link.href,
      text: link.textContent.trim().substring(0, 100),
      title: link.title || ''
    }));

    return content;
  }

  // Send content to background script
  function sendContentToBackground() {
    try {
      const content = extractPageContent();
      
      // Send to background script
      chrome.runtime.sendMessage({
        action: 'pageContentExtracted',
        content: content
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Tab Sense: Could not send content to background:', chrome.runtime.lastError.message);
        }
      });
    } catch (error) {
      console.log('Tab Sense: Error extracting content:', error);
    }
  }

  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendContentToBackground);
  } else {
    // Page is already loaded
    sendContentToBackground();
  }

  // Also send content when page visibility changes (for SPA navigation)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(sendContentToBackground, 1000); // Delay to allow SPA to update
    }
  });

})();
