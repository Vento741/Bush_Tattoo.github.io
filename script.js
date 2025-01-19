// Обработка кнопки "Наверх"
const scrollTopButton = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
});

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Мобильное меню
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Закрываем меню при клике на пункт меню
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Закрываем меню при скролле
window.addEventListener('scroll', () => {
    if (navLinks.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Массив текстов для анимации
const texts = [
    "ИСКУССТВО ВЕЧНОСТИ",
    "ТВОЯ ИСТОРИЯ НА КОЖЕ",
    "УНИКАЛЬНЫЙ СТИЛЬ",
    "КАЧЕСТВО БЕЗ КОМПРОМИССОВ",
    "ТВОЙ ХАРАКТЕР В ТАТУИРОВКЕ"
];

const typingText = document.getElementById('typing-text');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

function typeText() {
    const currentText = texts[textIndex];
    
    if (!isWaiting) {
        if (!isDeleting) {
            // Печатаем текст
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            // Устанавливаем позицию курсора
            const textWidth = typingText.offsetWidth;
            typingText.style.setProperty('--cursor-position', `${textWidth}px`);

            if (charIndex === currentText.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                }, 2000); // Ждем 2 секунды перед удалением
            }
        } else {
            // Удаляем текст
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            // Обновляем позицию курсора
            const textWidth = typingText.offsetWidth;
            typingText.style.setProperty('--cursor-position', `${textWidth}px`);

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
    }

    // Скорость печати и удаления
    const typeSpeed = isDeleting ? 50 : 100;
    setTimeout(typeText, typeSpeed);
}

// Запускаем анимацию при загрузке страницы
document.addEventListener('DOMContentLoaded', typeText);

// Обновляем код для работы с портфолио
const portfolioTrack = document.querySelector('.portfolio-track');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioPrev = document.querySelector('.portfolio-nav.prev');
const portfolioNext = document.querySelector('.portfolio-nav.next');

// Клонируем элементы для бесконечной прокрутки
portfolioItems.forEach(item => {
    const clone = item.cloneNode(true);
    portfolioTrack.appendChild(clone);
});

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;

let autoScrollInterval;
let isInteracting = false;

function startAutoScroll() {
    // Очищаем предыдущий интервал перед созданием нового
    stopAutoScroll();
    
    autoScrollInterval = setInterval(() => {
        if (!isInteracting) {
            currentIndex++;
            if (currentIndex >= portfolioItems.length) {
                currentIndex = 0;
                // Плавный переход в начало
                currentTranslate = 0;
                prevTranslate = 0;
            } else {
                currentTranslate = currentIndex * -300;
                prevTranslate = currentTranslate;
            }
            setSliderPosition();
        }
    }, 3000); // Прокрутка каждые 3 секунды
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

function dragStart(event) {
    if (event.type === "touchstart") {
        startPos = event.touches[0].clientX;
    } else {
        event.preventDefault();
        startPos = event.clientX;
    }
    
    isInteracting = true;
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    portfolioTrack.style.cursor = 'grabbing';
    stopAutoScroll();
}

function drag(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function dragEnd() {
    isDragging = false;
    isInteracting = false;
    cancelAnimationFrame(animationID);
    portfolioTrack.style.cursor = 'grab';
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > 100) {
        if (movedBy < 0) {
            currentIndex += 1;
        } else {
            currentIndex -= 1;
        }
    }
    
    if (currentIndex >= portfolioItems.length) {
        currentIndex = 0;
    }
    if (currentIndex < 0) {
        currentIndex = portfolioItems.length - 1;
    }
    
    currentTranslate = currentIndex * -300;
    prevTranslate = currentTranslate;
    setSliderPosition();
    
    // Возобновляем автопрокрутку через 3 секунды после окончания взаимодействия
    setTimeout(startAutoScroll, 3000);
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    portfolioTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

// Обновляем код для модального окна
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-content');
const modalCounter = document.querySelector('.modal-counter');
const modalPrev = document.querySelector('.modal-nav.prev');
const modalNext = document.querySelector('.modal-nav.next');

let modalIndex = 0;

function updateModalCounter() {
    modalCounter.textContent = `${modalIndex + 1} / ${portfolioItems.length}`;
}

function openModal(index) {
    modalIndex = index;
    modal.classList.add('active');
    modalImg.src = portfolioItems[index].querySelector('img').src;
    document.body.style.overflow = 'hidden';
    updateModalCounter();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    modalIndex = (modalIndex + 1) % portfolioItems.length;
    modalImg.src = portfolioItems[modalIndex].querySelector('img').src;
    updateModalCounter();
}

function showPrevImage() {
    modalIndex = (modalIndex - 1 + portfolioItems.length) % portfolioItems.length;
    modalImg.src = portfolioItems[modalIndex].querySelector('img').src;
    updateModalCounter();
}

// Обработчики событий для модального окна
portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index % portfolioItems.length));
});

modalPrev.addEventListener('click', showPrevImage);
modalNext.addEventListener('click', showNextImage);
document.querySelector('.modal-close').addEventListener('click', closeModal);

// Навигация с клавиатуры
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
});

// Обновляем обработчики для кнопок навигации
portfolioPrev.addEventListener('click', () => {
    isInteracting = true;
    stopAutoScroll();
    currentIndex--;
    if (currentIndex < 0) currentIndex = portfolioItems.length - 1;
    currentTranslate = currentIndex * -300;
    prevTranslate = currentTranslate;
    setSliderPosition();
    
    // Возобновляем автопрокрутку через 3 секунды
    setTimeout(() => {
        isInteracting = false;
        startAutoScroll();
    }, 3000);
});

portfolioNext.addEventListener('click', () => {
    isInteracting = true;
    stopAutoScroll();
    currentIndex++;
    if (currentIndex >= portfolioItems.length) currentIndex = 0;
    currentTranslate = currentIndex * -300;
    prevTranslate = currentTranslate;
    setSliderPosition();
    
    // Возобновляем автопрокрутку через 3 секунды
    setTimeout(() => {
        isInteracting = false;
        startAutoScroll();
    }, 3000);
});

// Обновляем обработчики для портфолио
portfolioTrack.addEventListener('mouseenter', () => {
    isInteracting = true;
    stopAutoScroll();
});

portfolioTrack.addEventListener('mouseleave', () => {
    isInteracting = false;
    startAutoScroll();
});

portfolioTrack.addEventListener('touchstart', dragStart, { passive: true });
portfolioTrack.addEventListener('touchend', dragEnd);
portfolioTrack.addEventListener('touchmove', drag, { passive: true });

// Обновляем код анимации прогресс-баров
document.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            const progress = bar.querySelector('.skill-progress');
            progress.style.width = `${level}%`;
        });
    };

    // Запускаем анимацию при появлении секции в поле зрения
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    });

    // Изменяем селектор на .master-profile
    const masterProfile = document.querySelector('.master-profile');
    if (masterProfile) {
        observer.observe(masterProfile);
    }
});

// Добавляем маску для телефона
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    
    function maskPhone(event) {
        const value = event.target.value.replace(/\D+/g, '');
        const numberLength = 11;
        
        let result = '+7 (';
        
        for (let i = 0; i < value.length && i < numberLength; i++) {
            switch (i) {
                case 3:
                    result += ') ';
                    break;
                case 6:
                    result += '-';
                    break;
                case 8:
                    result += '-';
                    break;
                default:
                    break;
            }
            result += value[i];
        }
        
        event.target.value = result;
    }
    
    phoneInput.addEventListener('input', maskPhone);
});

// Добавляем анимацию для социальных иконок
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
        link.querySelector('.icon').style.transform = 'scale(1.2)';
    });
    
    link.addEventListener('mouseout', () => {
        link.querySelector('.icon').style.transform = 'scale(1)';
    });
});

// Обновляем анимацию прокрутки портфолио для мобильных устройств
function updatePortfolioScroll() {
    const portfolioTrack = document.querySelector('.portfolio-track');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const scrollWidth = portfolioTrack.scrollWidth / 2; // Делим на 2, так как у нас клонированные элементы
        portfolioTrack.style.animation = `scroll ${scrollWidth * 0.02}s linear infinite`; // Адаптируем скорость
    } else {
        portfolioTrack.style.animation = 'scroll 40s linear infinite';
    }
}

// Добавляем слушатель изменения размера окна
window.addEventListener('resize', updatePortfolioScroll);
window.addEventListener('load', updatePortfolioScroll);

// Обновляем обработчик модального окна для мобильных устройств
modal.addEventListener('touchmove', (e) => {
    if (modal.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false }); 