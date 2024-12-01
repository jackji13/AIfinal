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

gsap.to(threejsElement1, {
    opacity: 0, // Return to its original position
    scale: 2, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#aimodel-container', // Trigger animation on the intro section
        start: 'top bottom', // Start when the intro's top reaches near the bottom of the viewport
        end: 'top 20%', // End when the intro is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

gsap.from('.info-text p', {
    x: '-50vw', // Start position off-screen to the left
    opacity: 0, // Initially hidden
    ease: 'power2.out', // Smooth easing effect
    duration: 1.5, // Duration of each animation
    stagger: 0.5, // Delay between each paragraph animation
    scrollTrigger: {
        trigger: '#info', // Trigger animation when #info section is visible
        start: 'top 70%', // Start animation when #info is 75% in viewport
        end: 'top top', // End animation when #info is 25% in viewport
        scrub: true, // Smoothly ties animation to scroll progress
    },
});

gsap.to('#info', {
    opacity: 0, // Fade out
    scale: 0.5, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#info', // Trigger animation when scrolling the .title section
        start: 'bottom 80%', // Start when .title reaches the top of the viewport
        end: 'bottom 30%', // End when .title is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

// Animate the training section text
gsap.from('.training-text', {
    opacity: 0, // Fade in
    x: '-250px', // Slide into position
    ease: 'power2.out', // Smooth easing
    duration: 1.5, // Animation duration
    scrollTrigger: {
        trigger: '#training', // Trigger animation when #training is visible
        start: 'top 40%', // Start animation when #training is 75% in viewport
        end: 'top top', // End animation when it is 25% in viewport
        scrub: true, // Smoothly ties animation to scroll progress
    },
});

gsap.to('#training', {
    opacity: 0, // Fade out
    scale: 0.5, // Scale down to 50%
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#training', // Trigger animation when scrolling the .title section
        start: 'bottom 80%', // Start when .title reaches the top of the viewport
        end: 'bottom 30%', // End when .title is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

gsap.from('#aimodel-container', {
    opacity: 0, // Fade in
    ease: 'power2.out', // Smooth easing
    duration: 1.5, // Animation duration
    scrollTrigger: {
        trigger: '#aimodel-container', // Trigger animation when #training is visible
        start: 'top 75%', // Start animation when #training is 75% in viewport
        end: 'top 20%', // End animation when it is 25% in viewport
        scrub: true, // Smoothly ties animation to scroll progress
    },
});