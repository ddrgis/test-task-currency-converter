'use strict';

const API_URL = 'https://api.exchangeratesapi.io';
const API_PATH = `${API_URL}/latest`;
const PRECISION = 4;
const LOCALE = 'en-US';
const API_CALL_INTERVAL_MS = 60 * 60 * 1000;

let rates = {};
const selectors = Array.from(document.getElementsByClassName('currency-selector'));
const loader = document.getElementById('loader');

const fetchRates = async () => {
    try {
        const response = await fetch(API_PATH);
        return await response.json();
    } catch (e) {
        console.error(e);
        loader.innerText = 'Can not get the rates data. Check your internet connection.';
    }
}

const calculateRates = baseCurrencyRates => {
    for (const currency of Object.keys(baseCurrencyRates)) {
        rates[currency] = {};
        const toBaseCurrencyRate = 1 / baseCurrencyRates[currency];
        for (const calculatingCurrency of Object.keys(baseCurrencyRates)) {
            rates[currency][calculatingCurrency] = Number((toBaseCurrencyRate * baseCurrencyRates[calculatingCurrency])
                .toFixed(PRECISION));
        }
    }
}

const addSelectorsOptions = currencies => {
    selectors.forEach(selector => {
        currencies.forEach(currency => {
            let option = document.createElement("option");
            option.text = currency;
            option.value = currency;
            selector.add(option);
        })
    })
}

const app = async () => {
    const data = await fetchRates();
    const {base: baseCurrency, rates: baseCurrencyRates} = data;
    rates = {[baseCurrency]: {...baseCurrencyRates, [baseCurrency]: 1}};

    calculateRates(baseCurrencyRates);
    addSelectorsOptions(Object.keys(baseCurrencyRates).sort());
    handle();
}

const handle = () => {
    const userInputValue = document.getElementById('amount-input').value;
    const parsedValue = parseFloat(userInputValue.replace(',', '.'));

    if (userInputValue.length === 0) {
        return;
    }
    if (isNaN(parsedValue)) {
        document.getElementById('result').innerText = 'Input value is incorrect. Please enter a correct value.';
        return;
    }

    const [fromSelector, toSelector] = selectors;
    const fromCurrency = fromSelector.value;
    const toCurrency = toSelector.value;
    const result = (parsedValue * rates[fromCurrency][toCurrency]);

    const fromFormatted = new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: fromCurrency
    }).format(parsedValue);
    const toFormatted = new Intl.NumberFormat(LOCALE, {style: 'currency', currency: toCurrency}).format(result);

    document.getElementById('result').innerText = `${fromFormatted} → ${toFormatted}`;
}

const submitHandler = e => {
    e.preventDefault();
    handle();
}

selectors.forEach(selector => {
    selector.addEventListener('change', e => {
        e.stopPropagation();
        handle();
    })
})

document.getElementById('amount-input').addEventListener('keyup', handle);
document.getElementById('convert-form').addEventListener('submit', submitHandler);

app().then(() => {
    loader.hidden = true;
    document.getElementById('convert-form').hidden = false;
});

setInterval(app, API_CALL_INTERVAL_MS);