export const logout = () => {
    // ✅ LocalStorage clear
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    // ✅ Notify other tabs + React App (important!)
    window.dispatchEvent(new Event("logout"));

    // ✅ Redirect to home
    window.location.href = '/';
};
