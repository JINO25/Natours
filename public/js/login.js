/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Assuming this code is running in a browser environment
const currentUrl = window.location.href;

// Extract the origin (protocol + hostname) from the current URL
const currentOrigin = new URL(currentUrl).origin;

// Combine the origin with the API path
const apiPath = '/api/v1';

// Combine the origin and API path to get the full API URL
const apiUrl = `${currentOrigin}`;
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${apiUrl}/api/v1/users/login`,
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        showAlert('err', error.response.data.message);

    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status = 'success') location.reload(true);
    } catch (error) {
        showAlert('error', 'Error logging out! Try again.');
    }
}

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Sign up successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        showAlert('err', error.response.data.message);
    }
}