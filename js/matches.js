(function (App) {
  /**
   * Match simulado: estos ids "ya expresaron interés" en datos locales.
   * No representa un like de una persona real.
   */
  App.SIMULATED_MUTUAL_IDS = [1];
  App.SIMULATED_SUPER_LIKE_IDS = [2];

  App.getDecisions = function getDecisions() {
    const stored = App.loadJSON("decisions", {});
    return stored && typeof stored === "object" ? stored : {};
  };

  App.getMatches = function getMatches() {
    const stored = App.loadJSON("matches", []);
    return Array.isArray(stored) ? stored : [];
  };

  App.hasMatch = function hasMatch(profileId) {
    return App.getMatches().some(function (match) {
      return match.profileId === Number(profileId);
    });
  };

  App.willMatch = function willMatch(profileId, action) {
    const id = Number(profileId);
    if (action === "superlike") {
      return (
        App.SIMULATED_MUTUAL_IDS.indexOf(id) !== -1 ||
        App.SIMULATED_SUPER_LIKE_IDS.indexOf(id) !== -1
      );
    }
    if (action === "like") {
      return App.SIMULATED_MUTUAL_IDS.indexOf(id) !== -1;
    }
    return false;
  };

  App.recordDecision = function recordDecision(profileId, action) {
    const profile = App.getProfileById(profileId);
    if (!profile) return { matched: false };

    const decisions = App.getDecisions();
    if (decisions[profile.id]) {
      return {
        matched: App.hasMatch(profile.id),
        duplicate: true,
        profile: profile,
      };
    }

    decisions[profile.id] = { action: action, at: Date.now() };
    App.saveJSON("decisions", decisions);

    const matched = App.willMatch(profile.id, action);
    if (matched) {
      App.addMatch(profile);
    }

    App.pushUndo({
      profileId: profile.id,
      action: action,
      createdMatch: matched,
    });

    return { matched: matched, profile: profile };
  };

  App.addMatch = function addMatch(profile) {
    if (App.hasMatch(profile.id)) return App.getMatches();

    const matches = App.getMatches();
    matches.push({
      profileId: profile.id,
      name: profile.name,
      image: profile.image,
      age: profile.age,
      createdAt: Date.now(),
      conversationId: String(profile.id),
    });
    App.saveJSON("matches", matches);
    App.ensureConversation(profile);
    return matches;
  };

  App.removeMatch = function removeMatch(profileId) {
    const id = Number(profileId);
    const matches = App.getMatches().filter(function (match) {
      return match.profileId !== id;
    });
    App.saveJSON("matches", matches);
  };

  App.pushUndo = function pushUndo(entry) {
    const stack = App.loadJSON("undo", []);
    const list = Array.isArray(stack) ? stack : [];
    list.push(entry);
    App.saveJSON("undo", list);
  };

  App.undoLast = function undoLast() {
    const stack = App.loadJSON("undo", []);
    if (!Array.isArray(stack) || !stack.length) return false;

    const last = stack.pop();
    App.saveJSON("undo", stack);

    const decisions = App.getDecisions();
    delete decisions[last.profileId];
    App.saveJSON("decisions", decisions);

    if (last.createdMatch) {
      App.removeMatch(last.profileId);
    }
    return true;
  };
})(window.TinderApp = window.TinderApp || {});
