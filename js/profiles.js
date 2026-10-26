(function (App) {
  const PREFIX = "tinder-mvp:";

  App.loadJSON = function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  };

  App.saveJSON = function saveJSON(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      /* almacenamiento lleno o bloqueado */
    }
  };

  App.PROFILES = [
    {
      id: 1,
      name: "Leila",
      age: 27,
      location: "Bucaramanga",
      description: "Ejemplo: me gusta el arte, el café y conocer gente nueva.",
      interests: ["Arte", "Café", "Viajes"],
      image: "./imagenes/1.webp",
    },
    {
      id: 2,
      name: "Álex",
      age: 25,
      location: "Medellín",
      description: "Ejemplo: entreno, juego y busco planes al aire libre.",
      interests: ["Fitness", "Gaming", "Música"],
      image: "./imagenes/2.webp",
    },
  ];

  App.getProfileById = function getProfileById(id) {
    return App.PROFILES.find(function (profile) {
      return profile.id === Number(id);
    });
  };

  App.getAvailableProfiles = function getAvailableProfiles() {
    const decisions = App.getDecisions();
    return App.PROFILES.filter(function (profile) {
      return !decisions[profile.id];
    });
  };

  App.getCurrentProfile = function getCurrentProfile() {
    const available = App.getAvailableProfiles();
    return available.length ? available[0] : null;
  };

  App.formatInterests = function formatInterests(interests) {
    if (!interests || !interests.length) return "";
    return interests.join(" · ");
  };
})(window.TinderApp = window.TinderApp || {});
