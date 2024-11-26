// Ensure GSAP's ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Select the <h1> element
const h1Element = document.querySelector('#title');
gsap.to(h1Element, {
    opacity: 0, // Fade out
    scale: 0.5, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#title', // Trigger animation when scrolling the .title section
        start: 'bottom 80%', // Start when .title reaches the top of the viewport
        end: 'bottom 30%', // End when .title is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

const introElement = document.querySelector('#intro');
gsap.to(introElement, {
    opacity: 0, // Fade out
    scale: 0.5, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#intro', // Trigger animation when scrolling the .title section
        start: 'bottom 80%', // Start when .title reaches the top of the viewport
        end: 'bottom 30%', // End when .title is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

const threejsElement1 = document.querySelector('#threejs-container');

gsap.to(threejsElement1, {
    left: '-25vw', // Move 25% of the viewport width to the left
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#intro', // Trigger animation when scrolling the #intro section
        start: 'top bottom', // Start when #intro reaches the bottom of the viewport
        end: 'top top', // End when #intro is fully in view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

// Return #threejs-container to its original position
gsap.to(threejsElement1, {
    x: '25vw', // Return to its original position
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#info', // Trigger animation on the intro section
        start: 'top bottom', // Start when the intro's top reaches near the bottom of the viewport
        end: 'top 20%', // End when the intro is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});
