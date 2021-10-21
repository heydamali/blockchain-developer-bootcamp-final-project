export function useLocalStorage() {
  const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  const getItem = (key) => {
    return localStorage.getItem(key);
  };

  return { setItem, removeItem, getItem };
}
