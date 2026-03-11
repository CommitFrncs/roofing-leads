// ========== GOOGLE SHEETS FORM HANDLING ==========
const GOOGLE_SCRIPT_URL = '';

// ========== UTM PARAMETER CAPTURE ==========
function captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get UTM params or set defaults
    const utmSource = document.getElementById('utm_source');
    const utmMedium = document.getElementById('utm_medium');
    const utmCampaign = document.getElementById('utm_campaign');
    const utmContent = document.getElementById('utm_content');
    const pageUrl = document.getElementById('page_url');
    
    if (utmSource) utmSource.value = urlParams.get('utm_source') || 'organic';
    if (utmMedium) utmMedium.value = urlParams.get('utm_medium') || 'search';
    if (utmCampaign) utmCampaign.value = urlParams.get('utm_campaign') || 'none';
    if (utmContent) utmContent.value = urlParams.get('utm_content') || 'none';
    if (pageUrl) pageUrl.value = window.location.href;
    
    console.log('%c📊 UTM Parameters Captured', 'color: #8b5cf6;');
}

// ========== MAIN INIT FUNCTION ==========
function initScripts() {
    console.log('%c🔧 SYSTEM CHECK: Initializing...', 'color: #3b82f6; font-weight: bold;');
    
    // Capture UTM params on page load
    captureUTMParams();
    
    // Initialize status tracking
    const status = {
        mobileMenu: false,
        navbarScroll: false,
        stickyCta: false,
        formHandling: false,
        resetFunction: false
    };
    
    // Small delay to ensure everything is rendered
    setTimeout(() => {
        
        // ========== MOBILE MENU TOGGLE ==========
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        
        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
                const icon = btn.querySelector('i');
                if (icon) {
                    if (menu.classList.contains('hidden')) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    } else {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-xmark');
                    }
                }
            });
            
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.add('hidden');
                    const icon = btn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                });
            });
            
            status.mobileMenu = true;
            console.log('%c✅ Mobile Menu: LOADED', 'color: #22c55e;');
        } else {
            console.log('%c❌ Mobile Menu: NOT FOUND', 'color: #ef4444;');
            if (!btn) console.log('   - Missing element: #mobile-menu-btn');
            if (!menu) console.log('   - Missing element: #mobile-menu');
        }
        
        // ========== NAVBAR SCROLL EFFECT ==========
        const navbar = document.getElementById('navbar');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    navbar.classList.add('shadow-md');
                } else {
                    navbar.classList.remove('shadow-md');
                }
            });
            
            status.navbarScroll = true;
            console.log('%c✅ Navbar Scroll: LOADED', 'color: #22c55e;');
        } else {
            console.log('%c❌ Navbar Scroll: NOT FOUND', 'color: #ef4444;');
            console.log('   - Missing element: #navbar');
        }
        
        // ========== MOBILE STICKY CTA VISIBILITY ==========
        const stickyCta = document.getElementById('mobile-sticky-cta');
        const footer = document.querySelector('footer');
        const contactSection = document.getElementById('contact');
        
        if (stickyCta && footer && contactSection) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const hideCtaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stickyCta.style.transform = 'translateY(100%)';
                    } else {
                        stickyCta.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            hideCtaObserver.observe(footer);
            hideCtaObserver.observe(contactSection);
            
            status.stickyCta = true;
            console.log('%c✅ Sticky CTA: LOADED', 'color: #22c55e;');
        } else {
            console.log('%c❌ Sticky CTA: NOT FOUND', 'color: #ef4444;');
            if (!stickyCta) console.log('   - Missing element: #mobile-sticky-cta');
            if (!footer) console.log('   - Missing element: footer');
            if (!contactSection) console.log('   - Missing element: #contact');
        }
        
        // ========== FORM HANDLING WITH GOOGLE SHEETS ==========
        const form = document.getElementById('leadForm');
        const submitBtn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMessage');
        
        if (form && submitBtn && successMsg) {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            // Real-time validation removal
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const errorEl = document.getElementById(`error-${input.id}`);
                    if (errorEl) errorEl.classList.add('hidden');
                    input.classList.remove('border-red-500');
                    input.classList.add('border-slate-300');
                });
                
                input.addEventListener('change', () => {
                    const errorEl = document.getElementById(`error-${input.id}`);
                    if (errorEl) errorEl.classList.add('hidden');
                    input.classList.remove('border-red-500');
                    input.classList.add('border-slate-300');
                });
            });
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                let isValid = true;
                
                const validateField = (id, condition) => {
                    const el = document.getElementById(id);
                    const errorEl = document.getElementById(`error-${id}`);
                    if (!condition) {
                        isValid = false;
                        if (el) {
                            el.classList.remove('border-slate-300');
                            el.classList.add('border-red-500');
                        }
                        if(errorEl) errorEl.classList.remove('hidden');
                    }
                };
                
                // Validate all fields
                const nameField = document.getElementById('name');
                const phoneField = document.getElementById('phone');
                const emailField = document.getElementById('email');
                const addressField = document.getElementById('address');
                const urgencyField = document.getElementById('urgency');
                const zipField = document.getElementById('zip');
                const issueField = document.getElementById('issue');
                
                if (nameField) validateField('name', nameField.value.trim().length > 1);
                if (phoneField) {
                    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                    validateField('phone', phoneRegex.test(phoneField.value));
                }
                if (emailField) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    validateField('email', emailRegex.test(emailField.value));
                }
                if (addressField) validateField('address', addressField.value.trim().length > 3);
                if (urgencyField) validateField('urgency', urgencyField.value && urgencyField.value !== "");
                if (zipField) validateField('zip', /^\d{5}$/.test(zipField.value));
                if (issueField) validateField('issue', issueField.value.trim().length > 5);
                
                if (!isValid) {
                    console.log('%c⚠️ Form: VALIDATION FAILED', 'color: #eab308;');
                    return;
                }
                
                // Refresh UTM params before submission (in case they changed)
                captureUTMParams();
                
                // Get UTM field values
                const utmSource = document.getElementById('utm_source');
                const utmMedium = document.getElementById('utm_medium');
                const utmCampaign = document.getElementById('utm_campaign');
                const utmContent = document.getElementById('utm_content');
                const pageUrl = document.getElementById('page_url');
                
                // Prepare form data
                const formData = new URLSearchParams();
                formData.append('name', nameField.value);
                formData.append('phone', phoneField.value);
                formData.append('email', emailField.value);
                formData.append('address', addressField.value);
                formData.append('urgency', urgencyField.value);
                formData.append('zip', zipField.value);
                formData.append('issue', issueField.value);
                
                // Append UTM data
                formData.append('utm_source', utmSource ? utmSource.value : 'organic');
                formData.append('utm_medium', utmMedium ? utmMedium.value : 'search');
                formData.append('utm_campaign', utmCampaign ? utmCampaign.value : 'none');
                formData.append('utm_content', utmContent ? utmContent.value : 'none');
                formData.append('page_url', pageUrl ? pageUrl.value : window.location.href);
                
                // Show loading state
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
                
                try {
                    // Send data to Google Sheets
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData
                    });
                    
                    // Show success message
                    console.log('%c📝 Form: SUBMISSION SUCCESSFUL', 'color: #22c55e;');
                    
                    // Log the data that was sent (for debugging)
                    console.log('Lead submitted:', {
                        name: nameField.value,
                        phone: phoneField.value,
                        email: emailField.value,
                        address: addressField.value,
                        urgency: urgencyField.value,
                        zip: zipField.value,
                        issue: issueField.value,
                        utm_source: utmSource ? utmSource.value : 'organic',
                        utm_medium: utmMedium ? utmMedium.value : 'search',
                        utm_campaign: utmCampaign ? utmCampaign.value : 'none',
                        page_url: pageUrl ? pageUrl.value : window.location.href
                    });
                    
                    // Hide form, show success message
                    form.style.display = 'none';
                    successMsg.classList.remove('hidden');
                    successMsg.classList.add('animate-fade-in-up');
                    
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('There was an error submitting your request. Please try again or email us directly at propertyserviceleads@gmail.com');
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                }
            });
            
            status.formHandling = true;
            console.log('%c✅ Form Handling: LOADED', 'color: #22c55e;');
        } else {
            console.log('%c❌ Form Handling: NOT FOUND', 'color: #ef4444;');
            if (!form) console.log('   - Missing element: #leadForm');
            if (!submitBtn) console.log('   - Missing element: #submitBtn');
            if (!successMsg) console.log('   - Missing element: #successMessage');
        }
        
        // ========== FINAL STATUS REPORT ==========
        console.log('%c📊 SYSTEM STATUS REPORT', 'color: #8b5cf6; font-weight: bold; font-size: 14px;');
        console.table(status);
        
        // Check if all systems are go
        const allSystemsGo = Object.values(status).every(value => value === true);
        
        if (allSystemsGo) {
            console.log('%c🚀 ALL SYSTEMS UP & RUNNING', 'color: #22c55e; font-weight: bold; font-size: 16px; background: #f0fdf4; padding: 4px 8px; border-radius: 4px;');
            console.log('%c✨ Ready to rock!', 'color: #3b82f6; font-style: italic;');
        } else {
            const failedCount = Object.values(status).filter(v => v === false).length;
            console.log('%c⚠️ PARTIAL SYSTEM FAILURE', 'color: #eab308; font-weight: bold; font-size: 16px; background: #fef9c3; padding: 4px 8px; border-radius: 4px;');
            console.log(`%c   ${failedCount} component(s) failed to load`, 'color: #ef4444;');
        }
        
    }, 100);
}

// ========== RESET FORM FUNCTION ==========
function resetForm() {
    const form = document.getElementById('leadForm');
    const successMsg = document.getElementById('successMessage');
    
    if (form && successMsg) {
        form.reset();
        successMsg.classList.add('hidden');
        form.style.display = 'block';
        form.classList.add('animate-fade-in-up');
        
        // Reset any validation styling
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove('border-red-500');
            input.classList.add('border-slate-300');
        });
        
        // Recapture UTM params (in case they changed)
        captureUTMParams();
        
        setTimeout(() => form.classList.remove('animate-fade-in-up'), 800);
        console.log('%c🔄 Reset Form: TRIGGERED', 'color: #3b82f6;');
    } else {
        console.log('%c❌ Reset Form: FAILED - Elements not found', 'color: #ef4444;');
    }
}

// ========== INITIALIZE EVERYTHING ==========
// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScripts);
} else {
    initScripts();
}