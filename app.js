/* eslint-disable prettier/prettier */
/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Global MIDDLEWARES

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
// app.use(helmet());
const scriptSrcUrls = ['https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://cdnjs.cloudflare.com',
    'https://*.cloudflare.com',
    'https://*.stripe.com',
    'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
    'https://cdnjs.cloudflare.com',
    'https:', 'unsafe-inline', 'http:'
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

//set security http headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'http://127.0.0.1:3000/*'],
            connectSrc: ["'self'", 'http://127.0.0.1:3000',
                'https://js.stripe.com/v3/',
                'https://bundle.js:*',
                'ws://127.0.0.1:3000/',
                `ws://localhost:3000/`, ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            frameSrc: ["'self'", 'https://*.stripe.com'],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: ["'none'"],
            childSrc: ["'self'", 'blob:'],
            upgradeInsecureRequests: [],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
);
app.use(cors());

// Optional: You can configure CORS options if needed. For example, to restrict which origins are allowed:
app.use(cors({
    origin: 'http://127.0.0.1:3000/', // Change this to match your client's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or authentication headers
}));

//Development logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


//Limit requests from the same API
const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

app.use(compression());

//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//run for all the verb like post,get,delete,..
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;