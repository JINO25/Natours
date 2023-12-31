/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, apiUrl) => {
    const stripe = Stripe('pk_test_oKhSR5nslBRnBZpjO6KuzZeX');
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `${apiUrl}/api/v1/bookings/checkout-session/${tourId}`
        );
        // console.log(session);

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};