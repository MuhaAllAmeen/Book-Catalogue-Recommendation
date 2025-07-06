import dotenv from 'dotenv'

// Load environment variables first

//uncomment the local if running in local environment
dotenv.config({ path: '.env.local' })
// dotenv.config({ path: '/etc/secrets/.env' })

// Export environment variables for use in other files
export const config = {
    FIREBASE_ADMIN: process.env.FIREBASE_ADMIN,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    NODE_ENV: process.env.NODE_ENV || 'development' // Default to development if not set
}

// Validate required environment variables
const requiredEnvVars = ['FIREBASE_ADMIN', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE']
for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`)
        process.exit(1)
    }
}

// Log the current environment
console.log(`Running in ${config.NODE_ENV} mode`) 