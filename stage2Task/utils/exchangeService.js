class ExchangeService {
    static calculateEstimatedGDP(population, exchangeRate) {
        if (!exchangeRate) return 0;
        
        const randomMultiplier = Math.random() * 1000 + 1000; // Random between 1000-2000
        return (population * randomMultiplier) / exchangeRate;
    }
}

module.exports = ExchangeService;