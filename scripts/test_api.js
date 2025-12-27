import axios from 'axios';

async function testApi() {
    try {
        const tokenId = "42334954850219754195241248003172889699504912694714162671145392673031415571339";
        const intervals = ['1m', '1h', '1d'];

        for (const interval of intervals) {
            console.log(`--- Testing CLOB interval: ${interval} ---`);
            try {
                const response = await axios.get('https://clob.polymarket.com/prices-history', {
                    params: {
                        market: tokenId,
                        interval: interval
                    }
                });
                console.log(`Status: ${response.status}, History Length: ${response.data.history ? response.data.history.length : 'N/A'}`);
                if (response.data.history && response.data.history.length > 0) {
                    console.log('Sample:', response.data.history[0]);
                }
            } catch (e) {
                console.log(`Error with ${interval}: ${e.message}`);
            }
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

testApi();
