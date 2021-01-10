const API_URL = 'https://api.exchangeratesapi.io';
const LATEST_API_URL = `${API_URL}/latest`;
const PRECISION = 4;
const API_CALL_INTERVAL = 60 * 60 * 1000;
const LOCALE = 'en-US';

let rates = {};
const selectors = document.getElementsByClassName('currency-selector');

const fn = async () => {
    const response = await fetch(LATEST_API_URL);
    const data = await response.json();
    const baseCurrency = data.base;
    const {rates: baseCurrencyRates} = data;
    rates = {[baseCurrency]: {...baseCurrencyRates, [baseCurrency]: 1}};
    for (const currency of Object.keys(baseCurrencyRates)){
        rates[currency] = {};
        const toBaseCurrencyRate = 1 / baseCurrencyRates[currency];
        for (const calculatingCurrency of Object.keys(baseCurrencyRates)) {
            const currencyRate = Number((toBaseCurrencyRate * baseCurrencyRates[calculatingCurrency]).toFixed(PRECISION));
            rates[currency][calculatingCurrency] = currencyRate;
        }
    }

    for (const selector of selectors) {
        for (const currency of Object.keys(baseCurrencyRates)) {
            let option = document.createElement("option");
            option.text = currency;
            option.value = currency;
            selector.add(option);
        }
    }
}

const submitHandler = e => {
    e.preventDefault();
    const value = document.getElementById('amount-input').value;
    const fromCurrency = selectors[0].value;
    const toCurrency = selectors[1].value;
    const result = (value * rates[fromCurrency][toCurrency]).toPrecision(PRECISION);

    const from = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: fromCurrency }).format(value);
    const to = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: toCurrency }).format(result);

    document.getElementById('result').innerText = `${from} -> ${to}`;
}

for(const selector of selectors) {
    selector.addEventListener('change', e => {
        e.stopPropagation();
        console.log('changed')
    })
}
document.getElementById('convert-form').addEventListener('submit', submitHandler);

fn();
setInterval(fn, API_CALL_INTERVAL)