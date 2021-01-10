const API_URL = 'https://api.exchangeratesapi.io';
const LATEST_API_URL = `${API_URL}/latest`;
const PRECISION = 4;


const fn = async () => {
    const response = await fetch(LATEST_API_URL);
    const data = await response.json();
    const baseCurrency = data.base;
    const {rates: baseCurrencyRates} = data;
    let rates = {[baseCurrency]: {...baseCurrencyRates, [baseCurrency]: 1}};
    for (const currency of Object.keys(baseCurrencyRates)){
        rates[currency] = {};
        const toBaseCurrencyRate = 1 / baseCurrencyRates[currency];
        for (const calculatingCurrency of Object.keys(baseCurrencyRates)) {
            const currencyRate = Number((toBaseCurrencyRate * baseCurrencyRates[calculatingCurrency]).toFixed(PRECISION));
            rates[currency][calculatingCurrency] = currencyRate;
        }
    }

    console.log(rates);
}

fn();
setInterval(fn, 100000)