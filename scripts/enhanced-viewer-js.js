// Document and Image Viewer - Enhanced Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PDF.js for document viewing
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    // ===== TAB FUNCTIONALITY =====
    initTabSystem();
    
    // ===== IMAGE VIEWER FUNCTIONALITY =====
    initImageViewer();
    
    // ===== PDF VIEWER FUNCTIONALITY =====
    initPdfViewer();
    
    // ===== SCROLL AND ANIMATION EFFECTS =====
    initScrollEffects();
    
    // ===== RESPONSIVE HANDLING =====
    handleResponsiveness();
});

// ============= TAB SYSTEM =============
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Set default active tab if none is active
    if (!document.querySelector('.tab-button.active')) {
        const firstTab = tabButtons[0];
        if (firstTab) {
            firstTab.classList.add('active', 'bg-indigo-100', 'text-indigo-800');
            firstTab.classList.remove('bg-gray-100', 'text-gray-700');
            
            const firstTabContent = document.getElementById(firstTab.dataset.tab);
            if (firstTabContent) firstTabContent.classList.add('active');
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active', 'bg-indigo-100', 'text-indigo-800'));
            tabButtons.forEach(btn => btn.classList.add('bg-gray-100', 'text-gray-700'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active', 'bg-indigo-100', 'text-indigo-800');
            button.classList.remove('bg-gray-100', 'text-gray-700');
            
            const targetTab = document.getElementById(button.dataset.tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });
}

// ============= IMAGE VIEWER =============
function initImageViewer() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const projectImages = document.querySelectorAll('.project-image');
    const closeModal = document.querySelector('.modal-close');
    
    // Create modal if it doesn't exist
    if (!modal) {
        createImageModal();
        return initImageViewer(); // Reinitialize after creating modal
    }
    
    projectImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'Project Image';
            
            // Add loading indicator
            modalImg.classList.add('opacity-0');
            const loader = document.getElementById('modal-loader');
            if (loader) loader.style.display = 'block';
            
            // When image loads
            modalImg.onload = () => {
                if (loader) loader.style.display = 'none';
                modalImg.classList.remove('opacity-0');
            };
            
            // Prevent scrolling of background
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Also attach to elements with view-image-btn class
    const viewImageBtns = document.querySelectorAll('.view-image-btn');
    viewImageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const imageUrl = btn.getAttribute('data-image');
            if (!imageUrl) return;
            
            modal.style.display = 'flex';
            modalImg.src = imageUrl;
            modalImg.alt = btn.getAttribute('data-title') || 'Image';
            
            // Add loading indicator
            modalImg.classList.add('opacity-0');
            const loader = document.getElementById('modal-loader');
            if (loader) loader.style.display = 'block';
            
            // When image loads
            modalImg.onload = () => {
                if (loader) loader.style.display = 'none';
                modalImg.classList.remove('opacity-0');
            };
            
            // Prevent scrolling of background
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Handle close button
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeImageModal();
        }
    });
}

function createImageModal() {
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden';
    modal.innerHTML = `
        <div class="relative max-w-4xl w-full mx-4">
            <button class="modal-close absolute -top-12 right-0 text-white text-2xl font-bold">&times;</button>
            <div class="relative bg-white rounded-lg p-1">
                <div id="modal-loader" class="absolute inset-0 flex items-center justify-center">
                    <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <img id="modalImage" class="max-h-[80vh] max-w-full object-contain transition-opacity duration-300" src="" alt="Project Image">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        // Restore scrolling
        document.body.style.overflow = '';
    }
}

// ============= PDF VIEWER =============
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
let canvas = null;
let ctx = null;

function initPdfViewer() {
    // Get elements
    const modal = document.getElementById('pdf-viewer-modal');
    const viewButtons = document.querySelectorAll('.view-pdf-btn');
    
    // Create modal if it doesn't exist
    if (!modal && viewButtons.length > 0) {
        createPdfModal();
        return initPdfViewer(); // Reinitialize after creating modal
    }
    
    if (!modal) return; // No modal needed if no view buttons
    
    const pdfContainer = document.getElementById('pdf-container');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const currentPageInput = document.getElementById('current-page');
    const pageCount = document.getElementById('page-count');
    const pdfTitle = document.getElementById('pdf-title');
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const closeButton = document.querySelector('.close-pdf');
    const downloadButton = document.getElementById('download-pdf');
    
    // Setup view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfUrl = this.getAttribute('data-pdf');
            if (!pdfUrl) {
                console.error('No PDF URL specified');
                return;
            }
            
            // Get document title
            let documentTitle = 'Document';
            const parentContainer = this.closest('.flex');
            if (parentContainer) {
                const heading = parentContainer.querySelector('h4, h3, h2');
                if (heading) documentTitle = heading.textContent.trim();
            }
            
            openPdfViewer(pdfUrl, documentTitle);
            
            // Set download link if available
            if (downloadButton) {
                downloadButton.href = pdfUrl;
                downloadButton.download = documentTitle + '.pdf';
            }
        });
    });
    
    // Close modal handlers
    if (closeButton) {
        closeButton.addEventListener('click', closePdfViewer);
    }
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closePdfViewer();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closePdfViewer();
        }
    });
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (pageNum <= 1) return;
            pageNum--;
            queueRenderPage(pageNum);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
            pageNum++;
            queueRenderPage(pageNum);
        });
    }
    
    // Page input
    if (currentPageInput) {
        currentPageInput.addEventListener('change', function() {
            if (!pdfDoc) return;
            
            const newPage = parseInt(this.value);
            if (!isNaN(newPage) && newPage > 0 && newPage <= pdfDoc.numPages) {
                pageNum = newPage;
                queueRenderPage(pageNum);
            } else {
                this.value = pageNum;
            }
        });
    }
    
    // Zoom controls
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            scale += 0.25;
            queueRenderPage(pageNum);
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (scale <= 0.5) return;
            scale -= 0.25;
            queueRenderPage(pageNum);
        });
    }
}

function createPdfModal() {
    const modal = document.createElement('div');
    modal.id = 'pdf-viewer-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col mx-4">
            <div class="flex items-center justify-between p-4 border-b">
                <h3 id="pdf-title" class="text-lg font-semibold text-gray-900 truncate">Document Viewer</h3>
                <button class="close-pdf text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="flex-1 overflow-auto relative">
                <div id="pdf-loader" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                    <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <div id="pdf-container" class="flex justify-center min-h-[400px]"></div>
            </div>
            
            <div class="border-t p-4 flex flex-wrap items-center gap-2">
                <div class="flex items-center space-x-2">
                    <button id="prev-page" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    
                    <div class="flex items-center">
                        <input id="current-page" class="w-12 text-center border rounded" type="number" value="1" min="1">
                        <span class="mx-1 text-gray-600">/</span>
                        <span id="page-count" class="text-gray-600">1</span>
                    </div>
                    
                    <button id="next-page" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" disabled>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="flex items-center space-x-2 ml-auto">
                    <button id="zoom-out" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                    </button>
                    
                    <button id="zoom-in" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                    
                    <a id="download-pdf" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 inline-flex items-center" href="#" download>
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function openPdfViewer(pdfUrl, title) {
    const modal = document.getElementById('pdf-viewer-modal');
    const pdfContainer = document.getElementById('pdf-container');
    const loader = document.getElementById('pdf-loader');
    const pdfTitle = document.getElementById('pdf-title');
    const currentPageInput = document.getElementById('current-page');
    const pageCount = document.getElementById('page-count');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!modal || !pdfContainer) {
        console.error('PDF viewer elements not found');
        return;
    }
    
    // Show loader
    if (loader) loader.style.display = 'flex';
    
    // Clear previous canvas if any
    pdfContainer.innerHTML = '';
    
    // Create new canvas
    canvas = document.createElement('canvas');
    canvas.className = 'pdf-canvas'; // For styling if needed
    pdfContainer.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    // Set modal title
    if (pdfTitle) pdfTitle.textContent = title || 'Document Viewer';
    
    // Reset page number and scale
    pageNum = 1;
    scale = 1.0;
    
    // Reset UI elements
    if (currentPageInput) currentPageInput.value = 1;
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent scrolling of background
    document.body.style.overflow = 'hidden';
    
    // Load PDF
    loadPdf(pdfUrl);
}

function closePdfViewer() {
    const modal = document.getElementById('pdf-viewer-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Restore scrolling
        document.body.style.overflow = '';
        
        // Clear PDF doc reference
        pdfDoc = null;
    }
}

function loadPdf(pdfUrl) {
    const loader = document.getElementById('pdf-loader');
    const pageCount = document.getElementById('page-count');
    const pdfContainer = document.getElementById('pdf-container');
    
    // Safety check
    if (!pdfjsLib) {
        console.error('PDF.js library not found. Please include PDF.js in your project.');
        if (pdfContainer) {
            pdfContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-lg font-medium text-gray-900">PDF.js library missing</p>
                    <p class="text-gray-600 mt-2 text-center">Please include PDF.js library in your project.</p>
                </div>
            `;
        }
        if (loader) loader.style.display = 'none';
        return;
    }
    
    // Load the PDF document
    pdfjsLib.getDocument(pdfUrl).promise
        .then(function(pdf) {
            pdfDoc = pdf;
            
            // Update page count
            if (pageCount) pageCount.textContent = pdf.numPages;
            
            // Enable/disable next button based on page count
            const nextButton = document.getElementById('next-page');
            if (nextButton) nextButton.disabled = pdf.numPages <= 1;
            
            // Initial page render
            renderPage(pageNum);
        })
        .catch(function(error) {
            console.error("Error loading PDF:", error);
            
            // Show error message in container
            if (pdfContainer) {
                pdfContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-64 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-lg font-medium text-gray-900">Unable to load PDF</p>
                        <p class="text-gray-600 mt-2 text-center">The document could not be loaded. Please check the URL and try again.</p>
                        <p class="text-gray-500 mt-2 text-sm">${error.message}</p>
                    </div>
                `;
            }
            
            // Hide loader
            if (loader) loader.style.display = 'none';
        });
}

function renderPage(num) {
    const loader = document.getElementById('pdf-loader');
    
    pageRendering = true;
    
    // Show loader while rendering
    if (loader) loader.style.display = 'flex';
    
    // Update UI
    const currentPageInput = document.getElementById('current-page');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (currentPageInput) currentPageInput.value = num;
    if (prevButton) prevButton.disabled = num <= 1;
    if (nextButton && pdfDoc) nextButton.disabled = num >= pdfDoc.numPages;
    
    // Get page
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale });
        
        // Set canvas dimensions to match page size
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Make canvas responsive
        updateCanvasResponsiveStyles();
        
        // Render PDF page
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            
            // Hide loader
            if (loader) loader.style.display = 'none';
            
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        }).catch(function(error) {
            console.error("Error rendering page:", error);
            pageRendering = false;
            
            // Hide loader
            if (loader) loader.style.display = 'none';
        });
    }).catch(function(error) {
        console.error("Error getting page:", error);
        pageRendering = false;
        
        // Hide loader
        if (loader) loader.style.display = 'none';
    });
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function updateCanvasResponsiveStyles() {
    if (!canvas) return;
    
    const pdfContainer = document.getElementById('pdf-container');
    if (!pdfContainer) return;
    
    const containerWidth = pdfContainer.clientWidth;
    
    // Only apply responsive styles if canvas is wider than container
    if (canvas.width > containerWidth - 40) { // 40px buffer for padding
        const scaleFactor = (containerWidth - 40) / canvas.width;
        canvas.style.width = '100%';
        canvas.style.maxWidth = `${containerWidth - 40}px`;
        canvas.style.height = 'auto';
    } else {
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
    }
}

// ============= SCROLL EFFECTS =============
function initScrollEffects() {
    // Add smooth scroll for any buttons with hero-button class
    const heroButtons = document.querySelectorAll('.hero-button');
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href') || button.dataset.target;
            const targetElement = document.querySelector(targetId || '#portfolio-section');
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
    
    // Add scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe grid elements
    document.querySelectorAll('.grid > div').forEach(el => {
        observer.observe(el);
    });
    
    // Also observe any elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============= RESPONSIVE HANDLING =============
function handleResponsiveness() {
    // Make sure our modal components adjust properly on window resize
    window.addEventListener('resize', () => {
        // Update PDF canvas if active
        if (pdfDoc && canvas) {
            updateCanvasResponsiveStyles();
        }
        
        // Handle PDF items for mobile vs desktop layout
        const pdfItems = document.querySelectorAll('.bg-white.p-6');
        pdfItems.forEach(item => {
            const flexContainer = item.querySelector('.flex');
            if (!flexContainer) return;
            
            if (window.innerWidth < 640) { // Mobile
                flexContainer.classList.remove('items-center');
                flexContainer.classList.add('flex-col');
                
                const button = flexContainer.querySelector('button');
                if (button) button.classList.add('w-full', 'mt-4');
            } else { // Desktop
                flexContainer.classList.add('items-center');
                flexContainer.classList.remove('flex-col');
                
                const button = flexContainer.querySelector('button');
                if (button) button.classList.remove('w-full', 'mt-4');
            }
        });
    });
    
    // Initial call to set up layouts
    const pdfItems = document.querySelectorAll('.bg-white.p-6');
    pdfItems.forEach(item => {
        const flexContainer = item.querySelector('.flex');
        if (!flexContainer) return;
        
        if (window.innerWidth < 640) {
            flexContainer.classList.remove('items-center');
            flexContainer.classList.add('flex-col');
            
            const button = flexContainer.querySelector('button');
            if (button) button.classList.add('w-full', 'mt-4');
        }
    });
    
    // Add swipe navigation for PDF viewer on touch devices
    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        pdfContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        pdfContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - go to next page
                if (pdfDoc && pageNum < pdfDoc.numPages) {
                    pageNum++;
                    queueRenderPage(pageNum);
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - go to previous page
                if (pageNum > 1) {
                    pageNum--;
                    queueRenderPage(pageNum);
                }
            }
        }
    }
}