const env = {
    PINATA_API_KEY: "pinataapikey",
    PINATA_API_SECRET: "pinataapisecret",
}

const pinataHeaders = {
    pinata_api_key: env.PINATA_API_KEY,
    pinata_secret_api_key: env.PINATA_API_SECRET,
}

module.exports = { env, pinataHeaders }
