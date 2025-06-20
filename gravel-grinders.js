// Script File
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('gravel-carousel');
  if (!carousel) return;

  const slideSelector = '.gravel-grinders__slide';
  const originalSlides = Array.from(carousel.querySelectorAll(slideSelector));
  if (originalSlides.length === 0) return;

  // Clone all original slides and append them
  const clones = originalSlides.map(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });
  clones.forEach(clone => carousel.appendChild(clone));

  const slideWidth = originalSlides[0].offsetWidth + 10;
  const totalSlides = originalSlides.length;
  const resetPoint = slideWidth * totalSlides;

  // Set initial scroll to 0
  carousel.scrollLeft = 0;

  // Auto-scroll settings
  const speed = 1; // pixels per tick
  let autoScroll;

  function startAutoScroll() {
    stopAutoScroll();
    autoScroll = requestAnimationFrame(step);
  }

  function stopAutoScroll() {
    cancelAnimationFrame(autoScroll);
  }

  function step() {
    if (carousel.scrollLeft >= resetPoint) {
      carousel.scrollLeft = 0;
    } else {
      carousel.scrollLeft += speed;
    }
    autoScroll = requestAnimationFrame(step);
  }

  // Drag handling
  let isDragging = false;
  let startX, scrollStart;

  carousel.addEventListener('mousedown', (e) => {
    stopAutoScroll();
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollStart = carousel.scrollLeft;
    carousel.classList.add('dragging');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollStart - walk;
  });

  ['mouseup', 'mouseleave'].forEach(evt =>
    carousel.addEventListener(evt, () => {
      if (isDragging) {
        isDragging = false;
        carousel.classList.remove('dragging');
        startAutoScroll();
      }
    })
  );

  // Pause auto-scroll on wheel
  carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    stopAutoScroll();
    carousel.scrollLeft += e.deltaY * 2;
    clearTimeout(carousel._wheelTimeout);
    carousel._wheelTimeout = setTimeout(startAutoScroll, 1000);
  });

  // Start everything
  startAutoScroll();
});