console.log('app.js підключено');

const forecast = [
    { day: 'Вівторок', temp: 18 },
    { day: 'Середа', temp: 16 },
    { day: 'Четвер', temp: 17 },
    { day: 'П’ятниця', temp: 19 },
    { day: 'Субота', temp: 15 },
    { day: 'Неділя', temp: 20 },
    { day: 'Понеділок', temp: 17 }
];

const toFahrenheit = c => c * 9 / 5 + 32;

function frostLabel(temp) {
    if (temp < 0) {
        return 'морозно';
    } else {
        return 'без морозу';
    }
}

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

console.log(`Перевірка: -3°C → ${frostLabel(-3)}; ${toFahrenheit(-3).toFixed(1)}°F`);