// Ensure GSAP's ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Select the <h1> element
const h1Element = document.querySelector('.title');

// GSAP animation for <h1>
gsap.to(h1Element, {
    opacity: 0, // Fade out
    scale: 0.5, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '.title', // Trigger animation when scrolling the .title section
        start: 'top top', // Start when .title reaches the top of the viewport
        end: 'bottom top', // End when .title is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});
