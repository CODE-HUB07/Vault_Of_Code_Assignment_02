/**
 * PDF Export functionality using jsPDF
 * Exports the resume preview as a PDF document with theme preservation
 */

function downloadResumeAsPDF(elementId, template, theme, filename = 'resume.pdf') {
    try {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF library is not loaded');
        }

        const { jsPDF } = window.jspdf;
        const element = document.getElementById(elementId);
        
        if (!element) {
            throw new Error('Resume preview element not found');
        }

        // Create new jsPDF instance
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });

        // Get theme colors and styles
        const themeConfig = getThemeConfig(theme, template);
        
        // Get resume data for text extraction
        const resumeData = extractResumeData(element);
        
        // Generate PDF content with theme styling
        generateStyledPDFContent(doc, resumeData, themeConfig, template);
        
        // Save the PDF
        doc.save(filename);
        
        // Show success feedback
        showSuccessMessage('Resume PDF downloaded successfully!');
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        showErrorMessage('Failed to generate PDF. Please try again.');
        throw error;
    }
}

function getThemeConfig(theme, template) {
    const themes = {
        'dark-blue': {
            primary: [30, 58, 138],
            secondary: [59, 130, 246],
            text: [31, 41, 55],
            light: [248, 250, 252],
            accent: [219, 234, 254]
        },
        'emerald': {
            primary: [5, 150, 105],
            secondary: [16, 185, 129],
            text: [31, 41, 55],
            light: [240, 253, 244],
            accent: [209, 250, 229]
        },
        'purple': {
            primary: [139, 92, 246],
            secondary: [168, 85, 247],
            text: [31, 41, 55],
            light: [250, 245, 255],
            accent: [233, 213, 255]
        },
        'rose': {
            primary: [244, 63, 94],
            secondary: [251, 113, 133],
            text: [31, 41, 55],
            light: [255, 241, 242],
            accent: [254, 205, 211]
        },
        'slate': {
            primary: [71, 85, 105],
            secondary: [100, 116, 139],
            text: [31, 41, 55],
            light: [248, 250, 252],
            accent: [226, 232, 240]
        }
    };

    const fonts = {
        'modern': 'Inter',
        'classic': 'Times',
        'creative': 'Inter',
        'professional': 'Inter',
        'minimal': 'Helvetica'
    };

    return {
        colors: themes[theme] || themes['dark-blue'],
        font: fonts[template] || 'Inter',
        template: template
    };
}

function extractResumeData(element) {
    const data = {
        name: '',
        contact: [],
        summary: '',
        sections: []
    };

    try {
        // Extract header information
        const header = element.querySelector('.resume-header');
        if (header) {
            const nameElement = header.querySelector('h1');
            if (nameElement) {
                data.name = nameElement.textContent.trim();
            }

            const contactElements = header.querySelectorAll('.contact-info span');
            contactElements.forEach(span => {
                const text = span.textContent.trim();
                if (text) {
                    data.contact.push(text);
                }
            });
        }

        // Extract content sections
        const contentSections = element.querySelectorAll('.resume-section');
        contentSections.forEach(section => {
            const sectionData = {
                title: '',
                items: []
            };

            const titleElement = section.querySelector('h2');
            if (titleElement) {
                sectionData.title = titleElement.textContent.trim();
            }

            // Handle different section types
            if (section.classList.contains('resume-skills')) {
                // Skills section
                const skills = section.querySelectorAll('.resume-skill');
                const skillsText = Array.from(skills).map(skill => skill.textContent.trim()).join(', ');
                sectionData.items.push({ text: skillsText });
            } else if (section.classList.contains('resume-languages')) {
                // Languages section
                const languages = section.querySelectorAll('.language-item');
                languages.forEach(lang => {
                    const name = lang.querySelector('.language-name')?.textContent.trim() || '';
                    const level = lang.querySelector('.language-level')?.textContent.trim() || '';
                    if (name) {
                        sectionData.items.push({ text: `${name} (${level})` });
                    }
                });
            } else {
                // Regular sections with items
                const items = section.querySelectorAll('.resume-item');
                items.forEach(item => {
                    const itemData = {
                        title: '',
                        meta: '',
                        description: ''
                    };

                    const titleElement = item.querySelector('h3');
                    if (titleElement) {
                        itemData.title = titleElement.textContent.trim();
                    }

                    const metaElement = item.querySelector('.item-meta');
                    if (metaElement) {
                        itemData.meta = metaElement.textContent.trim();
                    }

                    const descElement = item.querySelector('.item-description');
                    if (descElement) {
                        itemData.description = descElement.textContent.trim();
                    }

                    if (itemData.title || itemData.description) {
                        sectionData.items.push(itemData);
                    }
                });

                // Handle summary section (no items, just paragraph)
                if (sectionData.title === 'Professional Summary') {
                    const summaryPara = section.querySelector('p');
                    if (summaryPara) {
                        data.summary = summaryPara.textContent.trim();
                    }
                }
            }

            if (sectionData.title && (sectionData.items.length > 0 || data.summary)) {
                data.sections.push(sectionData);
            }
        });

    } catch (error) {
        console.error('Error extracting resume data:', error);
    }

    return data;
}

function generateStyledPDFContent(doc, data, themeConfig, template) {
    let yPosition = 20;
    const pageWidth = 210; // A4 width in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Set font based on template
    const font = themeConfig.font.toLowerCase();
    if (font === 'times') {
        doc.setFont('times');
    } else {
        doc.setFont('helvetica');
    }

    // Apply template-specific styling
    if (template === 'creative' || template === 'modern') {
        // Add header background for creative and modern templates
        doc.setFillColor(...themeConfig.colors.primary);
        doc.rect(0, 0, pageWidth, 35, 'F');
        yPosition = 15;
    } else if (template === 'professional') {
        // Add subtle header background for professional template
        doc.setFillColor(...themeConfig.colors.light);
        doc.rect(0, 0, pageWidth, 30, 'F');
        yPosition = 15;
    }

    // Header - Name
    if (data.name) {
        doc.setFontSize(template === 'minimal' ? 20 : 24);
        
        if (template === 'creative' || template === 'modern') {
            doc.setTextColor(255, 255, 255); // White text on colored background
        } else {
            doc.setTextColor(...themeConfig.colors.primary);
        }
        
        if (template === 'classic') {
            doc.setFont('times', 'bold');
        } else {
            doc.setFont('helvetica', 'bold');
        }
        
        doc.text(data.name, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += template === 'minimal' ? 8 : 10;
    }

    // Contact Information
    if (data.contact.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const contactText = data.contact.join(' • ');
        const contactLines = doc.splitTextToSize(contactText, contentWidth);
        doc.text(contactLines, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += (contactLines.length * 4) + 8;
    }

    // Reset to normal background after header
    if (template === 'creative' || template === 'modern') {
        doc.setTextColor(...themeConfig.colors.text); // Reset text color
        yPosition += 5;
    }

    // Add separator line with theme color
    doc.setDrawColor(...themeConfig.colors.primary);
    doc.setLineWidth(template === 'minimal' ? 1 : 0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Summary
    if (data.summary) {
        yPosition = addStyledSection(doc, 'Professional Summary', data.summary, yPosition, margin, contentWidth, themeConfig, template, true);
    }

    // Other sections
    data.sections.forEach(section => {
        if (section.title !== 'Professional Summary') {
            yPosition = addStyledSection(doc, section.title, section.items, yPosition, margin, contentWidth, themeConfig, template);
        }
    });
}

function addStyledSection(doc, title, content, yPosition, margin, contentWidth, themeConfig, template, isSummary = false) {
    // Check if we need a new page
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }

    // Section title with theme styling
    doc.setFontSize(template === 'minimal' ? 12 : 14);
    doc.setTextColor(...themeConfig.colors.primary);
    
    if (template === 'classic') {
        doc.setFont('times', 'bold');
    } else if (template === 'minimal') {
        doc.setFont('helvetica', 'bold');
        // Add underline for minimal template
        const titleWidth = doc.getTextWidth(title);
        doc.line(margin, yPosition + 1, margin + titleWidth, yPosition + 1);
    } else {
        doc.setFont('helvetica', 'bold');
    }
    
    doc.text(title, margin, yPosition);
    yPosition += template === 'minimal' ? 6 : 8;

    // Section content with theme styling
    doc.setFontSize(template === 'minimal' ? 9 : 10);
    doc.setTextColor(...themeConfig.colors.text);

    if (isSummary) {
        // Summary is just text
        const lines = doc.splitTextToSize(content, contentWidth);
        doc.text(lines, margin, yPosition);
        yPosition += (lines.length * 4) + 8;
    } else if (Array.isArray(content)) {
        // Regular sections with items
        content.forEach(item => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            if (item.title) {
                // Item title
                doc.setFont('helvetica', 'bold');
                doc.text(item.title, margin, yPosition);
                yPosition += 5;
            }

            if (item.meta) {
                // Item meta information
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 100, 100);
                const metaLines = doc.splitTextToSize(item.meta, contentWidth);
                doc.text(metaLines, margin, yPosition);
                yPosition += (metaLines.length * 4) + 2;
            }

            if (item.description) {
                // Item description
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
                const descLines = doc.splitTextToSize(item.description, contentWidth);
                doc.text(descLines, margin, yPosition);
                yPosition += (descLines.length * 4) + 2;
            }

            if (item.text) {
                // Simple text item (for skills, etc.)
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
                const textLines = doc.splitTextToSize(item.text, contentWidth);
                doc.text(textLines, margin, yPosition);
                yPosition += (textLines.length * 4) + 2;
            }

            yPosition += 4; // Space between items
        });
    }

    yPosition += 6; // Space between sections
    return yPosition;
}

// JSON Export functionality
function downloadResumeAsJSON(resumeData, filename = 'resume-data.json') {
    try {
        // Create complete resume data object
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '1.0',
                application: 'Interactive Resume Builder'
            },
            template: resumeData.currentTemplate || 'modern',
            theme: resumeData.currentTheme || 'dark-blue',
            data: resumeData.data || resumeData
        };

        // Convert to JSON string with formatting
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show success feedback
        showSuccessMessage('Resume data exported as JSON successfully!');
        
    } catch (error) {
        console.error('JSON Export Error:', error);
        showErrorMessage('Failed to export JSON. Please try again.');
        throw error;
    }
}

function showSuccessMessage(message) {
    // Create and show success notification
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showErrorMessage(message) {
    // Create and show error notification
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        </div>
    `;

    return notification;
}

// Alternative simpler PDF export for fallback
function downloadResumeAsSimplePDF(elementId, filename = 'resume.pdf') {
    try {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById(elementId);
        
        if (!element) {
            throw new Error('Element not found');
        }

        const doc = new jsPDF();
        const text = element.innerText || element.textContent || '';
        
        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(text, 180);
        
        // Add text to PDF
        doc.text(lines, 15, 15);
        
        // Save the PDF
        doc.save(filename);
        
        showSuccessMessage('Simple PDF downloaded successfully!');
        
    } catch (error) {
        console.error('Simple PDF generation failed:', error);
        showErrorMessage('PDF generation failed. Please try again.');
    }
}

// Export functions for global use
window.downloadResumeAsPDF = downloadResumeAsPDF;
window.downloadResumeAsSimplePDF = downloadResumeAsSimplePDF;
