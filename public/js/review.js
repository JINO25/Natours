/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const reviewAndRating = async (rating, review, user, tour, apiUrl) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${apiUrl}/api/v1/reviews`,
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