/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const reviewAndRating = async (rating, review, user, tour) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/reviews',
            data: {
                rating,
                review,
                tour,
                user
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Review was successfully!');
        }
    } catch (error) {
        showAlert('err', 'You can only write one review for every tours');
    }
}