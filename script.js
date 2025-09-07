// Auto-rotate to landscape on fullscreen for hero video (mobile)
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a small delay for a better feel, so it doesn't just flash on fast connections
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 300);
    }
});
// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation toggle for mobile
    initNavToggle();
    
    // Initialize animations
    initAnimations();
    
    // Initialize statistics counter
    initStatCounters();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize particle effect
    initParticles();
    
    // Initialize custom video controls
    initVideoControls();

    // Initialize donator modal
    initDonatorModal();

    // Initialize accordion for rules/tutorials page
    initAccordion();

    // Initialize tutorial page features
    initTutorialTabs();
    initVideoModal();
    initTextGuideNav(); 
    initVideoFilters();
    initImageLightbox();
    initLivePlayerCount(); // Now uses sampmonitoring.com API
    initMusicPlayer(); // Initialize the new music player

    // Call setActiveNavItem only on the homepage
    if (document.body.id === 'page-home') {
        setActiveNavItem();
    }
});

// Mobile Navigation Toggle with Dropdown Support
function initNavToggle() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    // Listener for the hamburger icon itself
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Listener for all clicks within the nav menu (for mobile)
    navMenu.addEventListener('click', function(e) {
        // Only run this logic on mobile
        const isMobile = window.getComputedStyle(navToggle).display !== 'none';
        if (!isMobile) return;
        
        // Find the link that was clicked
        const clickedLink = e.target.closest('a');
        if (!clickedLink) return;

        const isDropdownToggle = clickedLink.parentElement.classList.contains('dropdown') && clickedLink.nextElementSibling;

        if (isDropdownToggle) {
            // Clicked on a dropdown parent. Prevent default action and toggle the submenu.
            e.preventDefault();
            const submenu = clickedLink.nextElementSibling;
            const icon = clickedLink.querySelector('i');
            
            submenu.classList.toggle('open');
            icon.classList.toggle('rotated');
        } else {
            // Clicked on a regular link. Close the main mobile menu.
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');

            // Also ensure all dropdowns are reset
            document.querySelectorAll('.dropdown-menu.open').forEach(submenu => {
                submenu.classList.remove('open');
                const icon = submenu.previousElementSibling.querySelector('i');
                if (icon) {
                    icon.classList.remove('rotated');
                }
            });
        }
    });
}

// Custom Video Controls
function initVideoControls() {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;
    
    const video = document.getElementById('heroVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const seekBar = document.getElementById('seekBar');
    const timeDisplay = document.getElementById('timeDisplay');

    if (!video) return;

    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';
    const volumeUpIcon = '<i class="fas fa-volume-up"></i>';
    const volumeMuteIcon = '<i class="fas fa-volume-mute"></i>';
    
    let controlsTimeout;

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function showControls() {
        videoContainer.classList.add('controls-visible');
        clearTimeout(controlsTimeout);
        if (!video.paused) {
            controlsTimeout = setTimeout(() => {
                videoContainer.classList.remove('controls-visible');
            }, 3000);
        }
    }

    function hideControls() {
        if (!video.paused) {
             videoContainer.classList.remove('controls-visible');
        }
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
        return `${minutes}:${formattedSeconds}`;
    }

    // Event Listeners
    video.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
        playPauseBtn.innerHTML = pauseIcon;
        videoContainer.classList.remove('paused');
        hideControls();
    });

    video.addEventListener('pause', () => {
        playPauseBtn.innerHTML = playIcon;
        videoContainer.classList.add('paused');
        showControls();
    });

    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('mouseleave', hideControls);

    // Rewind & Forward
    rewindBtn.addEventListener('click', () => {
        video.currentTime -= 10;
    });
    forwardBtn.addEventListener('click', () => {
        video.currentTime += 10;
    });

    // Volume
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
    });

    video.addEventListener('volumechange', () => {
        if (video.muted || video.volume === 0) {
            muteBtn.innerHTML = volumeMuteIcon;
            volumeSlider.value = 0;
        } else {
            muteBtn.innerHTML = volumeUpIcon;
            volumeSlider.value = video.volume;
        }
    });
    
    volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value;
        video.muted = e.target.value === 0;
    });

    // Time & Seek Bar
    video.addEventListener('loadedmetadata', () => {
        seekBar.max = video.duration;
        timeDisplay.textContent = `${formatTime(0)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        const progressPercent = (video.currentTime / video.duration) * 100;
        seekBar.style.backgroundSize = `${progressPercent}% 100%`;
    });
    
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) { // Safari
            document.webkitExitFullscreen();
        } else if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) { // Safari
            videoContainer.webkitRequestFullscreen();
        }
    });

    // Auto-rotate to landscape on fullscreen for mobile
    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement === videoContainer || document.webkitFullscreenElement === videoContainer;
        if (isFullscreen && screen.orientation && typeof screen.orientation.lock === 'function') {
            if (/Mobi|Android/i.test(navigator.userAgent)) {
                screen.orientation.lock('landscape').catch(() => {});
            }
        } else if (!isFullscreen && screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
        }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}


// Smooth Scrolling for Navigation Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is on the current page
            const targetId = this.getAttribute('href');
            if (document.querySelector(targetId)) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkElementsInViewport);
    
    function checkElementsInViewport() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // How much of the element needs to be visible
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle && heroSubtitle && heroCta) {
        setTimeout(() => {
            heroTitle.classList.add('visible');
            
            setTimeout(() => {
                heroSubtitle.classList.add('visible');
                
                setTimeout(() => {
                    heroCta.classList.add('visible');
                }, 300);
            }, 300);
        }, 300);
    }
}

// Statistics Counter Animation
function initStatCounters() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    // A smoother animation function using requestAnimationFrame
    const animateCounter = (element) => {
        // Skip the live player count element
        if (element.id === 'live-player-count') return;

        const target = parseInt(element.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        let startTime = null;
        const duration = 2000; // Animation duration in milliseconds

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const current = Math.min(Math.floor((progress / duration) * target), target);
            element.textContent = current.toLocaleString();
            if (progress < duration) {
                window.requestAnimationFrame(animationStep);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        window.requestAnimationFrame(animationStep);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = statsSection.querySelectorAll('.stat-value');
                statValues.forEach(animateCounter);
                observer.unobserve(statsSection); // Animate only once
            }
        });
    }, {
        root: null, // relative to document viewport 
        threshold: 0.1 // trigger when 10% of the target is visible
    });

    observer.observe(statsSection);
}

// Live Player Count using sampmonitoring.com API
function initLivePlayerCount() {
    const playerCountElement = document.getElementById('live-player-count');
    if (!playerCountElement) return;
    
    const SCRIPT_ID = 'samp-monitoring-api-script';

    function refreshStats() {
        // Remove the old script tag if it exists to force a reload
        const oldScript = document.getElementById(SCRIPT_ID);
        if (oldScript) {
            oldScript.remove();
        }

        // Create a new script tag
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        
        // Add a cache-busting parameter to ensure we get fresh data
        script.src = `https://sampmonitoring.com/web/api/59/?_=${new Date().getTime()}`;

        // Handle successful script load
        script.onload = () => {
            // The script defines a global 'api' object
            if (window.api && window.api.status === '1') {
                playerCountElement.textContent = window.api.players;
            } else {
                playerCountElement.textContent = 'Offline';
            }
        };

        // Handle script loading errors
        script.onerror = () => {
            console.error('Failed to load server statistics from sampmonitoring.com.');
            playerCountElement.textContent = 'Offline';
        };
        
        // Append the script to the head to trigger the request
        document.head.appendChild(script);
    }

    // Initial call
    refreshStats();
    // Refresh every 30 seconds
    setInterval(refreshStats, 30000);
}


// Particle Effect
function initParticles() {
    if (typeof tsParticles === 'undefined' || !document.getElementById('particles-js')) {
        return;
    }

    tsParticles.load("particles-js", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 0.5,
                random: false,
            },
            size: {
                value: 3,
                random: true,
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
            }
        },
        retina_detect: true
    });
}


// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    }
});

// Add active class to current navigation item (Homepage only)
function setActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            if (section.id) { // Ensure section has an ID
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            // Check href attribute which could be complex
            const href = item.getAttribute('href');
            if (href === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Donator Modal
function initDonatorModal() {
    const modal = document.getElementById('donator-modal');
    const openBtn = document.getElementById('viewDonatorsBtn');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Close with escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Accordion for Rules/Tutorials Page
function initAccordion() {
    // Use event delegation to handle clicks on accordion headers
    document.body.addEventListener('click', function(event) {
        const header = event.target.closest('.accordion-header');
        if (!header) return; // Exit if the click wasn't on a header

        const accordion = header.closest('.accordion');
        if (!accordion) return; // Exit if it's not part of an accordion

        const item = header.parentElement;
        const content = header.nextElementSibling;
        const wasActive = item.classList.contains('active');

        // Optional: Close other items in the same accordion
        // To allow multiple open, remove this block
        const allItems = accordion.querySelectorAll('.accordion-item');
        allItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            }
        });

        // Toggle the clicked item
        if (!wasActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            content.style.maxHeight = null;
        }
    });
}


// New functions for tutorials page
function initTutorialTabs() {
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.getElementById(tab.dataset.tab);

            // Deactivate all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Activate the clicked tab and its content
            tab.classList.add('active');
            if(target) {
                target.classList.add('active');
            }
        });
    });
}

function initVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close-btn');
    const videoPlayer = document.getElementById('video-player');

    const openModal = (videoId) => {
        if(videoPlayer) {
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        if(videoPlayer) {
            videoPlayer.src = ''; // Stop the video
        }
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    };
    
    // Event delegation for video cards
    document.body.addEventListener('click', (event) => {
        const card = event.target.closest('.tutorial-card[data-video-id]');
        if (card) {
            const videoId = card.dataset.videoId;
            if (videoId) {
                openModal(videoId);
            }
        }
    });
    
    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (event) => {
        // Close if clicked on the background, not the content
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Scoped navigation for Text Guides and Manuals
function initTextGuideNav() {
    const contentArea = document.querySelector('.tutorials-content');
    if (!contentArea) return;

    contentArea.addEventListener('click', (event) => {
        const link = event.target.closest('.guide-nav-link');
        if (!link) return;

        const layout = link.closest('.text-guide-layout');
        if (!layout) return;

        // Handle accordion toggles for manual navigation
        if (link.classList.contains('guide-nav-parent')) {
            event.preventDefault();
            const parentItem = link.closest('.guide-nav-item');
            if (parentItem) {
                // Simplified logic: Just toggle the class. CSS will handle the animation.
                parentItem.classList.toggle('open');
            }
            return; // Stop further execution for parent toggles
        }

        // Handle content switching for regular links
        if (link.dataset.target) {
            const navLinks = layout.querySelectorAll('.guide-nav-link');
            const guideArticles = layout.querySelectorAll('.guide-article');
            const targetId = link.dataset.target;
            const targetArticle = layout.querySelector(`#${targetId}`);

            // Update nav links within this specific layout
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Highlight parent categories
            let current = link;
            while(current.closest('.guide-nav-submenu')) {
                const parentSubmenu = current.closest('.guide-nav-submenu');
                const parentLink = parentSubmenu.previousElementSibling;
                if(parentLink && parentLink.classList.contains('guide-nav-parent')) {
                    parentLink.classList.add('active');
                }
                current = parentLink;
            }

            // Update content articles within this specific layout
            guideArticles.forEach(article => article.classList.remove('active'));
            if (targetArticle) {
                targetArticle.classList.add('active');
            }
             // --- MOBILE-SPECIFIC UX IMPROVEMENT ---
            const isMobile = window.matchMedia("(max-width: 992px)").matches;
            if (isMobile) {
                const contentContainer = layout.querySelector('.guide-content');
                if (contentContainer) {
                    // Use a short timeout to let the DOM reflow before calculating position
                    setTimeout(() => {
                        const headerOffset = 80; // Height of the fixed header
                        const elementPosition = contentContainer.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 50);
                }

                // Collapse all accordions in this layout
                const openItems = layout.querySelectorAll('.guide-nav-item.open');
                openItems.forEach(item => {
                    item.classList.remove('open');
                });
            }
        }
    });
}


// Video Category Filter
function initVideoFilters() {
    const filters = document.querySelectorAll('.video-filters .filter-btn');
    const cards = document.querySelectorAll('.tutorials-grid .tutorial-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
        btn.addEventListener('click', function() {
            filters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

// Image Lightbox for Feature Highlights
function initImageLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const gallery = document.querySelector('.feature-gallery');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    if (!gallery || !lightboxImg || !closeBtn) return;

    const openLightbox = (imgSrc) => {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.classList.add('modal-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Check if no other modals are open before removing class
        if (document.querySelectorAll('.modal.active, .lightbox.active').length === 0) {
            document.body.classList.remove('modal-open');
        }
        // Delay clearing the src to avoid image disappearing before fade out
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    // Use event delegation for the gallery
    gallery.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            const img = galleryItem.querySelector('img');
            if (img) {
                openLightbox(img.src);
            }
        }
    });
    
    closeBtn.addEventListener('click', closeLightbox);

    // Close when clicking on the background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Background Music Player
function initMusicPlayer() {
    const musicControl = document.getElementById('music-control');
    if (!musicControl) return;

    const songs = [
        'https://l.top4top.io/m_3532ai8qb1.mp3',
        'https://a.top4top.io/m_3532nptye1.mp3',
        'https://b.top4top.io/m_3532mwchj2.mp3',
        'https://c.top4top.io/m_35324hprt3.mp3',
        'https://d.top4top.io/m_3532sqnf64.mp3',
        'https://e.top4top.io/m_3532vwms35.mp3'
    ];

    let playedSongs = [];
    const audio = new Audio();
    audio.volume = 0.4; // A comfortable default volume

    // Load mute state from localStorage
    let isMuted = localStorage.getItem('valriseMusicMuted') === 'true';

    function updateMuteIcon() {
        const icon = musicControl.querySelector('i');
        if (isMuted) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            audio.muted = true;
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            audio.muted = false;
        }
    }

    function playRandomSong() {
        if (playedSongs.length >= songs.length) {
            playedSongs = []; // Reset playlist once all songs have been played
        }

        let availableSongs = songs.filter(song => !playedSongs.includes(song));
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        const nextSong = availableSongs[randomIndex];
        
        playedSongs.push(nextSong);
        audio.src = nextSong;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser. Waiting for user interaction.");
            });
        }
    }

    audio.addEventListener('ended', playRandomSong);

    musicControl.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('valriseMusicMuted', isMuted);
        updateMuteIcon();
        
        // If music hasn't started yet because of autoplay policy, this click can start it
        if (audio.paused && !isMuted && audio.src === '') {
             playRandomSong();
        }
    });
    
    // Handle browser autoplay policies: play on the first user interaction
    function startMusicOnInteraction() {
        if (audio.paused && !isMuted && audio.src === '') {
            playRandomSong();
        }
        // This listener only needs to run once
        document.body.removeEventListener('click', startMusicOnInteraction, { once: true });
        document.body.removeEventListener('keydown', startMusicOnInteraction, { once: true });
    }

    document.body.addEventListener('click', startMusicOnInteraction, { once: true });
    document.body.addEventListener('keydown', startMusicOnInteraction, { once: true });

    // Set initial icon state
    updateMuteIcon();
}