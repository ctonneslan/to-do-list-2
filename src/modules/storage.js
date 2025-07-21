const Storage = (() => {
  const STORAGE_KEY = "todoAppData";

  const save = (projects) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const load = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
      return null;
    }
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    save,
    load,
    clear,
  };
})();

export { Storage };
