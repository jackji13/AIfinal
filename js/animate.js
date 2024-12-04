gsap.registerPlugin(ScrollTrigger);

const h1Element = document.querySelector('#title');
gsap.to(h1Element, {
    opacity: 0,
    scale: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#title',
        start: 'bottom 80%',
        end: 'bottom 30%',
        scrub: true,
    },
});

const introElement = document.querySelector('#intro');
gsap.to(introElement, {
    opacity: 0,
    scale: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#intro',
        start: 'bottom 80%',
        end: 'bottom 30%',
        scrub: true,
    },
});

const threejsElement1 = document.querySelector('#threejs-container');
gsap.to(threejsElement1, {
    left: '-25vw',
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#intro',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
    },
});

gsap.to(threejsElement1, {
    x: '25vw',
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#info',
        start: 'top bottom',
        end: 'top 20%',
        scrub: true,
    },
});

gsap.to(threejsElement1, {
    opacity: 0,
    scale: 2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#aimodel-container',
        start: 'top bottom',
        end: 'top 20%',
        scrub: true,
    },
});

gsap.from('.info-text p', {
    x: '-50vw',
    opacity: 0,
    ease: 'power2.out',
    duration: 1.5,
    stagger: 0.5,
    scrollTrigger: {
        trigger: '#info',
        start: 'top 70%',
        end: 'top top',
        scrub: true,
    },
});

gsap.to('#info', {
    opacity: 0,
    scale: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#info',
        start: 'bottom 80%',
        end: 'bottom 30%',
        scrub: true,
    },
});

gsap.from('.training-text', {
    opacity: 0,
    x: '-250px',
    ease: 'power2.out',
    duration: 1.5,
    scrollTrigger: {
        trigger: '#training',
        start: 'top 40%',
        end: 'top top',
        scrub: true,
    },
});

gsap.to('#training', {
    opacity: 0,
    scale: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#training',
        start: 'bottom 80%',
        end: 'bottom 30%',
        scrub: true,
    },
});

gsap.from('#aimodel-container', {
    opacity: 0,
    ease: 'power2.out',
    duration: 1.5,
    scrollTrigger: {
        trigger: '#aimodel-container',
        start: 'top 75%',
        end: 'top 20%',
        scrub: true,
    },
});