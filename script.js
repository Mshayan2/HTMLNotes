document.addEventListener('DOMContentLoaded', () => {
    // Presentation Navigation State
    let currentSlideIndex = 0;
    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;

    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarNav = document.getElementById('sidebar-nav');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const slideIndicator = document.getElementById('slide-indicator');

    // =========================================================================
    // 1. Core Presentation Engine
    // =========================================================================

    function initPresentation() {
        buildSidebarMenu();
        showSlide(0);
        setupEventListeners();
        initWidgets();
    }

    function buildSidebarMenu() {
        sidebarNav.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideTitleEl = slide.querySelector('.slide-title');
            const title = slideTitleEl ? slideTitleEl.textContent : `Slide ${index + 1}`;
            
            const navItem = document.createElement('a');
            navItem.className = `nav-item ${index === 0 ? 'active' : ''}`;
            navItem.innerHTML = `
                <span class="nav-index">${String(index + 1).padStart(2, '0')}</span>
                <span class="nav-text">${title}</span>
            `;
            navItem.addEventListener('click', () => {
                showSlide(index);
            });
            sidebarNav.appendChild(navItem);
        });
    }

    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Remove active class from old slide and sidebar nav
        slides[currentSlideIndex].classList.remove('active');
        const navItems = sidebarNav.querySelectorAll('.nav-item');
        if (navItems[currentSlideIndex]) {
            navItems[currentSlideIndex].classList.remove('active');
        }

        // Set new active slide
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');
        
        if (navItems[currentSlideIndex]) {
            navItems[currentSlideIndex].classList.add('active');
            navItems[currentSlideIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        // Update indicators & controls
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;
        
        const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercent}%`;
        slideIndicator.textContent = `Slide ${currentSlideIndex + 1} / ${totalSlides}`;
        
        // Special widget triggers on slide enter
        handleSlideFocus(currentSlideIndex);
    }

    function handleSlideFocus(slideIdx) {
        // If entering the playground slide (usually index 11), run code compilation automatically
        if (slides[slideIdx] && slides[slideIdx].querySelector('.playground-grid')) {
            updatePlaygroundPreview();
        }
    }

    function setupEventListeners() {
        // Button controls
        prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
        
        // Sidebar Toggle
        toggleSidebarBtn.addEventListener('click', toggleSidebar);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Ignore key events when typing inside inputs, textareas or select
            const activeTag = document.activeElement.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                showSlide(currentSlideIndex + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
                e.preventDefault();
                showSlide(currentSlideIndex - 1);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                toggleSidebar();
            }
        });

        // Clipboard Copy Helper
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-clipboard-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    // Extract code, removing lines prefixes if any
                    const code = targetEl.innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        button.style.backgroundColor = 'var(--success)';
                        button.style.borderColor = 'var(--success)';
                        setTimeout(() => {
                            button.textContent = originalText;
                            button.style.backgroundColor = '';
                            button.style.borderColor = '';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                    });
                }
            });
        });

        // Global Tab Viewers Switcher
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabContainer = btn.closest('.tab-container');
                const tabGroup = btn.getAttribute('data-tab-group');
                const tabId = btn.getAttribute('data-tab-id');

                tabContainer.querySelectorAll(`.tab-btn[data-tab-group="${tabGroup}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                tabContainer.querySelectorAll(`.tab-panel[data-tab-group="${tabGroup}"]`).forEach(panel => {
                    panel.classList.remove('active');
                });

                btn.classList.add('active');
                const activePanel = tabContainer.querySelector(`.tab-panel[data-tab-id="${tabId}"]`);
                if (activePanel) {
                    activePanel.classList.add('active');
                }
            });
        });
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
    }

    // =========================================================================
    // 2. Interactive Widgets Systems
    // =========================================================================

    function initWidgets() {
        initWidgetA(); // Evolution Timeline
        initWidgetB(); // Tree Explorer
        initWidgetC(); // Anchor Dialer
        initWidgetD(); // Table Planner
        initWidgetE(); // Code Playground & Console
    }

    // --- Widget A: Timeline Card Selector ---
    const timelineData = {
        '1991': {
            title: 'HTML 1.0 - The Genesis (1991)',
            desc: 'Created by Tim Berners-Lee at CERN. It contained only 18 basic structural elements like paragraphs, headings, lists, and anchors. Design layout controls, colors, or external stylesheets did not exist yet.'
        },
        '1999': {
            title: 'HTML 4.01 - Web Standard (1999)',
            desc: 'The backbone of the early desktop web. It introduced robust table systems, complex forms, frame layouts, and first-class integration with Cascading Style Sheets (CSS) to separate structure from styling.'
        },
        '2000': {
            title: 'XHTML 1.0 - Strict Era (2000)',
            desc: 'HTML rewritten as XML. It introduced strict parsing rules: all elements must reside in lowercase tags, all attributes must be quoted, all tags closed (e.g., `<br />`), and correct nesting was strictly enforced.'
        },
        '2014': {
            title: 'HTML5 - Rich Media & Semantics (2014)',
            desc: 'The current modern standard. Removed the need for external video/audio plugins (like Flash) by providing native tags. Added descriptive semantic layout anchors, client-side storage APIs, and standard canvas graphics.'
        }
    };

    function initWidgetA() {
        window.selectTimeline = function(year) {
            // Update active timeline nodes
            document.querySelectorAll('.timeline-node').forEach(node => {
                node.classList.remove('active');
                if (node.getAttribute('data-year') === String(year)) {
                    node.classList.add('active');
                }
            });

            // Update Panel content with animation
            const titleEl = document.getElementById('timeline-title');
            const descEl = document.getElementById('timeline-desc');
            const data = timelineData[year];
            if (data && titleEl && descEl) {
                const panel = titleEl.closest('.timeline-info-panel');
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    titleEl.textContent = data.title;
                    descEl.textContent = data.desc;
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                }, 150);
            }
        };
    }

    // --- Widget B: HTML Document Tree Explorer ---
    const treeElementsDb = {
        'doctype': {
            tag: '&lt;!DOCTYPE html&gt;',
            desc: 'Document Type Declaration. Instructs the browser engine that the document must be parsed according to the modern HTML5 standard. This must always be the very first line of any HTML page.',
            nesting: 'Nesting: Root level. No opening or closing requirements.',
            attr: 'No attributes available.'
        },
        'html': {
            tag: '&lt;html lang="en"&gt;',
            desc: 'The root container tag. Wraps all other tags on the webpage. Tells the browser where the HTML starts and stops.',
            nesting: 'Nesting: Directly contains `<head>` and `<body>` tags.',
            attr: 'Attributes: `lang` (specifies base language of the content, vital for screen readers).'
        },
        'head': {
            tag: '&lt;head&gt;',
            desc: 'The metadata container. Holds essential, machine-readable assets and data definitions that are not rendered directly inside the viewport window.',
            nesting: 'Nesting: Contains metadata (`<meta>`), titles (`<title>`), links to stylesheets (`<link>`), scripts (`<script>`).',
            attr: 'No standard visual attributes.'
        },
        'title': {
            tag: '&lt;title&gt;',
            desc: 'Webpage title container. Sets the text displayed on browser navigation tabs and indexing titles for search engines (SEO).',
            nesting: 'Nesting: Must reside inside the `<head>` element. Only plain text allowed inside.',
            attr: 'No attributes.'
        },
        'body': {
            tag: '&lt;body&gt;',
            desc: 'Document viewport container. Holds all visual markup content (headings, cards, grids, buttons, audio nodes) displayed to the end-user on the viewport.',
            nesting: 'Nesting: Main display parent, houses all semantic and non-semantic content.',
            attr: 'Attributes: Global attributes (like `class`, `id`, `style`).'
        },
        'h1': {
            tag: '&lt;h1&gt;',
            desc: 'Level 1 Heading element. Identifies the primary content outline on the page. Crucial for screen reader accessibility hierarchies.',
            nesting: 'Nesting: Standard child of `<body>` or semantic layout panels.',
            attr: 'Attributes: Standard global formatting styles.'
        },
        'p': {
            tag: '&lt;p&gt;',
            desc: 'Paragraph element. Groups blocks of text content together, automatically adding logical spacing margins before and after.',
            nesting: 'Nesting: Contains inline elements (like `<a>`, `<strong>`, `<em>`).',
            attr: 'Attributes: Standard global classes.'
        }
    };

    function initWidgetB() {
        window.selectTreeTag = function(key) {
            // Update tree structure nodes
            document.querySelectorAll('.tree-node').forEach(node => {
                node.classList.remove('active');
                if (node.getAttribute('data-element-key') === key) {
                    node.classList.add('active');
                }
            });

            // Update details
            const data = treeElementsDb[key];
            if (data) {
                document.getElementById('explorer-tag').innerHTML = data.tag;
                document.getElementById('explorer-desc').textContent = data.desc;
                document.getElementById('explorer-nesting').textContent = data.nesting;
                document.getElementById('explorer-attributes').textContent = data.attr;
                
                // Highlight corresponding mock tag visually
                document.querySelectorAll('.mock-code-line').forEach(line => {
                    line.classList.remove('highlighted');
                    if (line.getAttribute('data-line-key') === key) {
                        line.classList.add('highlighted');
                    }
                });
            }
        };
    }

    // --- Widget C: Interactive Anchor Link Dialer ---
    function initWidgetC() {
        const urlInput = document.getElementById('dialer-url');
        const targetInput = document.getElementById('dialer-target');
        const typeInput = document.getElementById('dialer-type');
        const previewUrl = document.getElementById('preview-url-bar');
        const displayCode = document.getElementById('dialer-code-display');
        const liveLink = document.getElementById('dialer-target-link');
        const statusLog = document.getElementById('dialer-log-screen');

        if (!urlInput || !targetInput || !typeInput) return;

        function updateDialerUI() {
            const url = urlInput.value;
            const target = targetInput.value;
            const type = typeInput.value;

            let href = url;
            let targetAttr = '';
            let label = 'Click Here';

            // Handle type shifts
            if (type === 'mailto') {
                href = `mailto:${url}`;
                targetInput.disabled = true;
                label = 'Email Support';
            } else if (type === 'tel') {
                href = `tel:${url}`;
                targetInput.disabled = true;
                label = 'Call Sales';
            } else if (type === 'download') {
                href = url;
                targetInput.disabled = true;
                label = 'Download Report';
            } else {
                targetInput.disabled = false;
                href = url;
                label = 'Visit Webpage';
            }

            // Target adjustments
            if (!targetInput.disabled && target !== '_self') {
                targetAttr = ` target="${target}"`;
            }

            // Update code display
            let code = `&lt;a href="${href}"`;
            if (targetAttr) code += targetAttr;
            if (type === 'download') code += ' download';
            code += `&gt;${label}&lt;/a&gt;`;

            displayCode.innerHTML = code;
            previewUrl.textContent = href;
            liveLink.textContent = label;
            liveLink.setAttribute('data-href', href);
            liveLink.setAttribute('data-target', target);
            liveLink.setAttribute('data-type', type);
        }

        urlInput.addEventListener('input', updateDialerUI);
        targetInput.addEventListener('change', updateDialerUI);
        typeInput.addEventListener('change', () => {
            // Update default values based on type selection
            const type = typeInput.value;
            if (type === 'mailto') {
                urlInput.value = 'info@example.com';
            } else if (type === 'tel') {
                urlInput.value = '+923001234567';
            } else if (type === 'download') {
                urlInput.value = 'brochure.pdf';
            } else {
                urlInput.value = 'https://google.com';
            }
            updateDialerUI();
        });

        liveLink.addEventListener('click', (e) => {
            e.preventDefault();
            const href = liveLink.getAttribute('data-href');
            const target = liveLink.getAttribute('data-target');
            const type = liveLink.getAttribute('data-type');
            
            let message = '';
            if (type === 'mailto') {
                message = `[MAILTO TRIGGER] Opening default user mail client targeting "${href}"`;
            } else if (type === 'tel') {
                message = `[TELEPHONY TRIGGER] Starting cellular dialer dial command to "${href}"`;
            } else if (type === 'download') {
                message = `[DOWNLOAD ACTION] Requesting web transfer download for file: "${href}"`;
            } else {
                if (target === '_blank') {
                    message = `[NAV ACTION] Opening link "${href}" in a new web browser tab.`;
                } else {
                    message = `[NAV ACTION] Replacing current browser location frame with "${href}"`;
                }
            }

            statusLog.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            statusLog.style.color = 'var(--accent)';
            setTimeout(() => {
                statusLog.style.color = 'var(--success)';
            }, 500);
        });

        // Initialize state
        updateDialerUI();
    }

    // --- Widget D: Table Colspan/Rowspan Grid Planner ---
    function initWidgetD() {
        const colspanInput = document.getElementById('table-colspan');
        const rowspanInput = document.getElementById('table-rowspan');
        const gridTable = document.getElementById('planner-grid-table');

        if (!colspanInput || !rowspanInput || !gridTable) return;

        function renderPlannerGrid() {
            const colspan = parseInt(colspanInput.value) || 1;
            const rowspan = parseInt(rowspanInput.value) || 1;

            let tableHtml = '<caption>Simulated Dynamic Grid</caption>';
            
            // Row 1
            tableHtml += '<tr>';
            tableHtml += `<td class="highlight" colspan="${colspan}" rowspan="${rowspan}">Target Cell (Colspan: ${colspan}, Rowspan: ${rowspan})</td>`;
            
            if (colspan === 1) {
                tableHtml += '<td>Cell 1-2</td><td>Cell 1-3</td>';
            } else if (colspan === 2) {
                tableHtml += '<td>Cell 1-3</td>';
            }
            tableHtml += '</tr>';

            // Row 2
            tableHtml += '<tr>';
            if (rowspan === 1) {
                if (colspan === 1) {
                    tableHtml += '<td>Cell 2-1</td><td>Cell 2-2</td><td>Cell 2-3</td>';
                } else if (colspan === 2) {
                    tableHtml += '<td colspan="2">Cell 2-1 & 2-2</td><td>Cell 2-3</td>';
                } else {
                    tableHtml += '<td colspan="3">Cells 2-1 to 2-3</td>';
                }
            } else {
                // If rowspan is 2, row 2 column 1 is blocked by the target cell
                if (colspan === 1) {
                    tableHtml += '<td>Cell 2-2</td><td>Cell 2-3</td>';
                } else if (colspan === 2) {
                    tableHtml += '<td>Cell 2-3</td>';
                }
            }
            tableHtml += '</tr>';

            gridTable.innerHTML = tableHtml;
        }

        colspanInput.addEventListener('change', renderPlannerGrid);
        rowspanInput.addEventListener('change', renderPlannerGrid);

        // Init
        renderPlannerGrid();
    }

    // --- Widget E: Live Playground ---
    const templates = {
        hello: `<!DOCTYPE html>
<html>
  <head>
    <title>First Webpage</title>
  </head>
  <body>
    <h1>Welcome to Coding!</h1>
    <p>This is a paragraph structured using the basic HTML body container tag layout.</p>
  </body>
</html>`,
        lists: `<p><strong>Interactive Ordered List:</strong></p>
<ol type="I" start="1">
  <li>Install VS Code</li>
  <li>Write index.html</li>
  <li>Open inside Web Browser</li>
</ol>

<p><strong>Unordered Grocery Items:</strong></p>
<ul style="color: coral;">
  <li>Fresh Apples</li>
  <li>Banana Cluster</li>
  <li>Dairy Milk</li>
</ul>`,
        tables: `<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
  <caption>Interactive Grades</caption>
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Student</th>
      <th>Subject</th>
      <th>Mark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ali</td>
      <td>HTML Basics</td>
      <td style="color: green; font-weight: bold;">95</td>
    </tr>
    <tr>
      <td>Sana</td>
      <td>Web Styling</td>
      <td style="color: green; font-weight: bold;">98</td>
    </tr>
  </tbody>
</table>`,
        forms: `<form id="playground-form" onsubmit="event.preventDefault(); window.parent.postMessage({type: 'log', message: 'Form submitted successfully! Username: ' + document.getElementById('uname').value}, '*');">
  <fieldset style="border: 1px solid #ccc; padding: 12px; border-radius: 8px;">
    <legend style="font-weight: bold;">User Account Settings</legend>
    
    <label for="uname">Username:</label><br>
    <input type="text" id="uname" required placeholder="Choose handle..." style="width: 100%; padding: 6px; margin: 6px 0; box-sizing: border-box;"><br>
    
    <label for="color">Favorite Accent:</label><br>
    <input type="color" id="color" value="#00e5ff" style="margin: 6px 0;"><br>
    
    <button type="submit" style="background-color: #7c3aed; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Register Details</button>
  </fieldset>
</form>`
    };

    function initWidgetE() {
        const select = document.getElementById('playground-select-template');
        const textarea = document.getElementById('playground-editor');
        const terminalBody = document.getElementById('terminal-log-body');
        
        if (!select || !textarea || !terminalBody) return;

        // Change templates
        select.addEventListener('change', () => {
            const val = select.value;
            if (templates[val]) {
                textarea.value = templates[val];
                updatePlaygroundPreview();
                addTerminalLog('Loaded template: ' + select.options[select.selectedIndex].text, 'info');
            }
        });

        // Track live edits (with a small debounce or on input)
        textarea.addEventListener('input', updatePlaygroundPreview);

        // Receive terminal logs from mock form actions or scripts inside iframe
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'log') {
                addTerminalLog(event.data.message, 'success');
            }
        });

        // Initialize template content
        textarea.value = templates.hello;
    }

    function addTerminalLog(message, type = 'info') {
        const terminalBody = document.getElementById('terminal-log-body');
        if (!terminalBody) return;

        const dateStr = new Date().toLocaleTimeString();
        const logNode = document.createElement('div');
        logNode.className = 'terminal-log';
        logNode.innerHTML = `
            <span class="log-time">[${dateStr}]</span>
            <span class="log-msg log-${type}">&gt; ${message}</span>
        `;
        terminalBody.appendChild(logNode);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function updatePlaygroundPreview() {
        const textarea = document.getElementById('playground-editor');
        const iframe = document.getElementById('playground-preview-frame');
        
        if (!textarea || !iframe) return;

        const code = textarea.value;
        
        // Wrap user code to intercept links/form submits and post message to our terminal console
        const scriptWrapper = `
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    // Intercept form submissions
                    document.querySelectorAll('form').forEach(form => {
                        form.addEventListener('submit', (e) => {
                            // If form hasn't blocked it or custom submit is there
                            window.parent.postMessage({
                                type: 'log',
                                message: 'Form submitted to action: "' + (form.getAttribute('action') || '#') + '" using: ' + (form.getAttribute('method') || 'GET')
                            }, '*');
                        });
                    });
                    
                    // Intercept link clicks
                    document.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.parent.postMessage({
                                type: 'log',
                                message: 'Link Clicked! target href: "' + link.getAttribute('href') + '"'
                            }, '*');
                        });
                    });

                    // Intercept color input visual shifts
                    const colInput = document.querySelector('input[type="color"]');
                    if (colInput) {
                        colInput.addEventListener('change', (e) => {
                            window.parent.postMessage({
                                type: 'log',
                                message: 'Color input changed to: ' + colInput.value
                            }, '*');
                        });
                    }
                });
            </script>
        `;

        const finalCode = code + scriptWrapper;

        // Write directly into the iframe source document
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(finalCode);
            iframeDoc.close();
        } catch (e) {
            console.error('Playground frame write failed:', e);
        }
    }

    // Run Initialization
    initPresentation();
});
