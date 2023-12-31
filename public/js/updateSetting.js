/* eslint-disable */

import { showAlert } from './alerts';
import axios from 'axios';

// export const updateData = async (name, email) => {
//     try {
//         const res = await axios({
//             method: 'PATCH',
//             url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
//             data: {
//                 name,
//                 email
//             }
//         });
//         if (res.data.status === 'success') {
//             showAlert('success', 'Data updated successfully');
//         }
//     } catch (error) {
//         showAlert('err', error.response.data.message);

//     }
// }

export const updateSettings = async (data, type, apiUrl) => {
    try {
        const url = type === 'password'
            ? `${apiUrl}/api/v1/users/updatePassword`
            : `${apiUrl}/api/v1/users/updateMe`

        const res = await axios({
            method: 'PATCH',
            url,
            data
        })
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
        }
        if (type === 'photo') {
            return res.data.data.user.photo;
        }
    } catch (error) {
        showAlert('err', error.response.data.message);

    }
}