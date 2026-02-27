export const API = import.meta.env.VITE_API_URL;
export const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});
