const https = require('https');

https.get('https://gamma-api.polymarket.com/tags', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const tags = JSON.parse(data);
            const targetTags = ['Politics', 'Crypto', 'Finance', 'Tech', 'Economy', 'Trump', 'Trending', 'Business', 'Technology'];
            const found = {};

            tags.forEach(t => {
                targetTags.forEach(target => {
                    if (t.label.toLowerCase() === target.toLowerCase() || t.slug.toLowerCase() === target.toLowerCase()) {
                        found[target] = t.id;
                    }
                });
                if (t.label.toLowerCase() === 'cryptocurrency') found['Crypto'] = t.id;
            });
            console.log("Found Tags:", JSON.stringify(found, null, 2));
        } catch (e) {
            console.error("Parse error", e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
