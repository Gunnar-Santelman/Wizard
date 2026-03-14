const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

export const API = {
    USER: `${API_BASE}/user`,
    AUTH: `${API_BASE}/auth`,
    PROFILE_PICTURE: `${API_BASE}/profile-picture`,
    GAME: `${API_BASE}/game`
};

export default API_BASE;