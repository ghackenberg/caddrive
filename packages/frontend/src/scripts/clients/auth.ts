export const auth = {
    headers: {
        Authorization: localStorage.getItem('jwt') ? `Bearer ${localStorage.getItem('jwt')}` : ''
    }
}