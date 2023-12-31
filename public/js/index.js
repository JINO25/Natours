/* eslint-disable */

import '@babel/polyfill';
import { signup, login, logout } from './login';
import { displayMap } from './leaflet';
import { updateSettings } from './updateSetting';
import { bookTour } from './stripe';
import { reviewAndRating } from './review';

// Assuming this code is running in a browser environment
const currentUrl = window.location.href;
// Extract the origin (protocol + hostname) from the current URL
const currentOrigin = new URL(currentUrl).origin;
// Combine the origin and API path to get the full API URL
const apiUrl = `${currentOrigin}`;

const mapBox = document.getElementById('map');
const fileInput = document.querySelector('.form__upload');

if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

const signupForm = document.querySelector('.form--signup');

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(name, email, password, passwordConfirm, apiUrl);
    });
}


const loginForm = document.querySelector('.form--login');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password, apiUrl);
    });
}

const logOutBtn = document.querySelector('.nav__el.nav__el--logout');

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

const userDataForm = document.querySelector('.form-user-data');

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data', apiUrl);
    });
}

if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const form = new FormData();
        form.append('photo', document.getElementById('photo').files[0]);
        if (newImage) {
            document
                .querySelector('.nav__user-img')
                .setAttribute('src', `/img/users/${newImage}`);
            document
                .querySelector('.form__user-photo')
                .setAttribute('src', `/img/users/${newImage}`);
        }
    });
}

const userPasswordForm = document.querySelector('.form-user-password');

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password', apiUrl);
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}

const bookBtn = document.getElementById('book-tour');

if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        //destructuring
        const { tourId } = e.target.dataset;
        bookTour(tourId, apiUrl);
    })

const reviewForm = document.querySelector('.form--review');

if (reviewForm) {
    reviewForm.addEventListener('submit', async e => {
        e.preventDefault();
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        const { user, tour } = JSON.parse(reviewForm.dataset.ids);
        await reviewAndRating(rating, review, user, tour, apiUrl);

        document.getElementById('review').value = '';
        document.getElementById('rating').value = '';
    })
}