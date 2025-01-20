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
    const styleCards = document.querySelectorAll('.style-card');
    
    styleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.return-btn')) {
                styleCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('flipped');
                    }
                });
                card.classList.toggle('flipped');
            }
        });

        const returnBtn = card.querySelector('.return-btn');
        if (returnBtn) {
            returnBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('flipped');
            });
        }
    });

    // Инициализация компонентов
    initializeSkillsAnimation();
    initializePhoneMask();
    typeText();
    startAutoScroll();
});

function initializeSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills(skillBars);
            }
        });
    }, { threshold: 0.5 });

    const masterProfile = document.querySelector('.master-profile');
    if (masterProfile) {
        observer.observe(masterProfile);
    }
}

function animateSkills(skillBars) {
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        const progress = bar.querySelector('.skill-progress');
        progress.style.width = `${level}%`;
    });
}

function initializePhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        let prevValue = '';
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Если первая цифра 7 или 8, удаляем её
            if (value.length > 0 && (value[0] === '7' || value[0] === '8')) {
                value = value.substring(1);
            }
            
            // Ограничиваем длину до 10 цифр
            value = value.substring(0, 10);
            
            // Форматируем номер
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = '+7 ';
                if (value.length > 0) {
                    formattedValue += '(' + value.substring(0, 3);
                }
                if (value.length > 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formattedValue += '-' + value.substring(8, 10);
                }
            }
            
            // Обновляем значение только если оно изменилось
            if (formattedValue !== prevValue) {
                input.value = formattedValue;
                prevValue = formattedValue;
            }
        });

        // Обработка удаления символов
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                let value = input.value.replace(/\D/g, '');
                if (value.length <= 1) {
                    input.value = '';
                    prevValue = '';
                }
            }
        });
    });
}

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

// Добавляем функционал модального окна записи
const bookingBtn = document.getElementById('booking-btn');
const bookingModal = document.querySelector('.booking-modal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const bookingForm = document.querySelector('.booking-form');

// Открытие модального окна
if (bookingBtn) {
    bookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Закрытие модального окна
function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeBookingModal);
}

// Закрытие по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        closeBookingModal();
    }
});

// Предотвращаем закрытие при клике на форму
if (bookingForm) {
    bookingForm.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Маска для телефона
const bookingPhone = document.getElementById('booking-phone');

bookingPhone.addEventListener('input', function(e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, '');
    const cursorPosition = input.selectionStart;
    
    // Если первая цифра 7 или 8, убираем её
    if (value.startsWith('7') || value.startsWith('8')) {
        value = value.slice(1);
    }
    
    // Ограничиваем длину до 10 цифр (без учёта +7)
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    // Форматируем номер
    let formattedValue = '';
    if (value.length > 0) {
        // Всегда начинаем с +7
        formattedValue = '+7';
        
        // Добавляем скобку и первые 3 цифры
        if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, Math.min(3, value.length));
        }
        
        // Добавляем закрывающую скобку и следующие 3 цифры
        if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, Math.min(6, value.length));
        }
        
        // Добавляем первый дефис и следующие 2 цифры
        if (value.length > 6) {
            formattedValue += '-' + value.substring(6, Math.min(8, value.length));
        }
        
        // Добавляем второй дефис и последние 2 цифры
        if (value.length > 8) {
            formattedValue += '-' + value.substring(8, Math.min(10, value.length));
        }
    }
    
    // Обновляем значение поля
    input.value = formattedValue;
    
    // Вычисляем новую позицию курсора
    let newPosition = cursorPosition;
    
    // Корректируем позицию курсора после форматирования
    if (cursorPosition <= 2) newPosition = formattedValue.length;
    else if (cursorPosition <= 6) newPosition = cursorPosition + 1;
    else if (cursorPosition <= 10) newPosition = cursorPosition + 2;
    else if (cursorPosition <= 13) newPosition = cursorPosition + 3;
    else newPosition = cursorPosition + 4;
    
    // Устанавливаем курсор в правильную позицию
    setTimeout(() => {
        input.setSelectionRange(newPosition, newPosition);
    }, 0);
});

// Предотвращаем ввод букв и специальных символов
bookingPhone.addEventListener('keydown', function(e) {
    // Разрешаем: backspace, delete, tab и escape
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'Escape') {
        return;
    }
    // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey === true || e.metaKey === true) && 
        (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        return;
    }
    // Разрешаем: home, end, влево, вправо
    if (e.key === 'Home' || e.key === 'End' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        return;
    }
    // Блокируем ввод всего, кроме цифр
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

// Анимация отправки формы
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    
    // Анимация кнопки
    submitBtn.style.width = '50px';
    btnText.style.opacity = '0';
    btnIcon.style.opacity = '0';
    
    // Добавляем индикатор загрузки
    setTimeout(() => {
        submitBtn.innerHTML = '<div class="loader"></div>';
    }, 300);
    
    // Имитируем отправку
    setTimeout(() => {
        submitBtn.innerHTML = '✓';
        submitBtn.style.background = '#28a745';
        
        // Закрываем модальное окно
        setTimeout(() => {
            closeBookingModal();
            // Сбрасываем форму и кнопку
            bookingForm.reset();
            setTimeout(() => {
                submitBtn.style.width = '';
                submitBtn.style.background = '';
                submitBtn.innerHTML = `
                    <span class="btn-text">Отправить</span>
                    <span class="btn-icon">→</span>
                `;
            }, 300);
        }, 1000);
    }, 2000);
}); 