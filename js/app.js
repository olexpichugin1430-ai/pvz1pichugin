// Перевірка підключення файлу до сторінки
console.log('app.js підключено');

// Видаляє статичні картки прогнозу з розмітки: далі їх створює JavaScript
const staticCards = document.querySelectorAll('#forecast .card');
staticCards.forEach(card => card.remove());
console.log(`Видалено статичних карток: ${staticCards.length}`);

// Дані прогнозу погоди на 7 днів (день тижня, температура в °C та опис погоди)
const forecast = [
    { day: 'Вівторок', temp: 18, description: 'хмарно' },
    { day: 'Середа', temp: 16, description: 'дощ' },
    { day: 'Четвер', temp: 17, description: 'мінлива хмарність' },
    { day: 'П’ятниця', temp: 19, description: 'сонячно' },
    { day: 'Субота', temp: 15, description: 'дощ' },
    { day: 'Неділя', temp: 20, description: 'ясно' },
    { day: 'Понеділок', temp: 17, description: 'хмарно' }
];

// Контейнер для карток і елемент підсумку
const listContainer = document.querySelector('#forecast .cards');
const avgTempElement = document.querySelector('#avg-temp');

// Переводить температуру з градусів Цельсія в градуси Фаренгейта
const toFahrenheit = c => c * 9 / 5 + 32;

// Класифікує температуру: нижче 0°C — «морозно», інакше — «без морозу»
function frostLabel(temp) {
    if (temp < 0) {
        return 'морозно';
    } else {
        return 'без морозу';
    }
}

// Перебирає масив прогнозу циклом for...of, виводить кожен день у консоль
// і повертає середню температуру за період
function printForecast(days) {
    let sum = 0;

    for (const item of days) {
        const fahrenheit = toFahrenheit(item.temp).toFixed(1);
        console.log(`${item.day}: ${item.temp}°C (${fahrenheit}°F) — ${frostLabel(item.temp)}`);
        sum += item.temp;
    }

    return sum / days.length;
}

console.log('--- ПРОГНОЗ ПОГОДИ ---');
const averageTemp = printForecast(forecast);
console.log(`Середня температура: ${averageTemp.toFixed(1)}°C`);

// Перевірка умови на тестовому значенні нижче нуля
console.log(`Перевірка: -3°C → ${frostLabel(-3)}; ${toFahrenheit(-3).toFixed(1)}°F`);

// Формує текст температури: додатні значення зі знаком «+», наприклад +18°C
const formatTemp = temp => (temp > 0 ? '+' : '') + temp + '°C';

// Повертає клас температурного діапазону (збігається з легендою на сторінці)
function tempRangeClass(temp) {
    if (temp <= 5) {
        return 'temp--cold';
    } else if (temp <= 15) {
        return 'temp--cool';
    } else if (temp <= 24) {
        return 'temp--warm';
    } else {
        return 'temp--hot';
    }
}

// Виводить прогноз на сторінку: для кожного дня створює картку article з h3 (день)
// та двома абзацами (температура й опис), додає data-атрибут і клас cold для морозних днів,
// а наприкінці оновлює підсумковий елемент із середньою температурою
function renderForecast(days) {
    listContainer.innerHTML = '';
    let sum = 0;

    for (const item of days) {
        const card = document.createElement('article');
        card.classList.add('card');

        const title = document.createElement('h3');
        title.textContent = item.day;

        const temp = document.createElement('p');
        temp.classList.add('temp', tempRangeClass(item.temp));
        temp.textContent = formatTemp(item.temp);

        const desc = document.createElement('p');
        desc.classList.add('desc');
        desc.textContent = item.description;

        card.append(title, temp, desc);

        card.dataset.temp = item.temp;
        if (item.temp < 0) {
            card.classList.add('cold');
        }

        listContainer.append(card);
        sum += item.temp;
    }

    avgTempElement.textContent = `Середня температура за період: ${(sum / days.length).toFixed(1)}°C`;
}

renderForecast(forecast);

const form = document.querySelector('#day-form');
const dayInput = document.querySelector('#day-input');
const tempInput = document.querySelector('#temp-input');
const descriptionInput = document.querySelector('#description-input');
const hottestBtn = document.querySelector('#hottest-btn');
const hottestResult = document.querySelector('#hottest-result');

form.addEventListener('submit', event => {
    event.preventDefault();

    const day = dayInput.value.trim();
    const temp = Number(tempInput.value);
    const description = descriptionInput.value.trim();

    if (day === '') {
        dayInput.value = '';
        dayInput.reportValidity();
        return;
    }

    forecast.push({ day, temp, description: description || 'без опису' });
    renderForecast(forecast);
    hottestResult.textContent = '—';
    form.reset();
    dayInput.focus();
});

tempInput.addEventListener('input', () => {
    const value = Number(tempInput.value);
    if (tempInput.value !== '' && (value < -50 || value > 50)) {
        tempInput.setCustomValidity('Температура поза реалістичним діапазоном');
    } else {
        tempInput.setCustomValidity('');
    }
});

function findHottest(days) {
    let hottest = days[0];
    for (const item of days) {
        if (item.temp > hottest.temp) {
            hottest = item;
        }
    }
    return hottest;
}

hottestBtn.addEventListener('click', () => {
    const hottest = findHottest(forecast);
    hottestResult.textContent =
        `Найтепліший день: ${hottest.day} (${formatTemp(hottest.temp)})`;
});