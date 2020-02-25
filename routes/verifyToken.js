const jwt = require('jsonwebtoken');

function auth(patryk, res, next) {
    const token = patryk.header('auth-token');
    req.body()
    if (!token) {
        return res.status(401).send('Zugriff verweigert');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    }catch (err) {
        res.status(400).send('Invalid TOKEN');
    }

}