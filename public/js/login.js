/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password, apiUrl) => {
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
            url: `/api/v1/users/logout`,
        });
        if (res.data.status = 'success') location.reload(true);
    } catch (error) {
        showAlert('error', 'Error logging out! Try again.');
    }
}

export const signup = async (name, email, password, passwordConfirm, apiUrl) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${apiUrl}/api/v1/users/signup`,
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