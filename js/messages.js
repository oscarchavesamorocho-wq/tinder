(function (App) {
  App.getConversations = function getConversations() {
    const stored = App.loadJSON("conversations", {});
    return stored && typeof stored === "object" ? stored : {};
  };

  App.ensureConversation = function ensureConversation(profile) {
    const all = App.getConversations();
    const id = String(profile.id);
    if (!all[id]) {
      all[id] = {
        id: id,
        profileId: profile.id,
        messages: [],
        unread: 0,
        updatedAt: Date.now(),
      };
      App.saveJSON("conversations", all);
    }
    return all[id];
  };

  App.getConversation = function getConversation(profileId) {
    const all = App.getConversations();
    return all[String(profileId)] || null;
  };

  App.getSortedConversations = function getSortedConversations() {
    const matches = App.getMatches();
    return matches
      .map(function (match) {
        const profile = App.getProfileById(match.profileId);
        const convo = App.getConversation(match.profileId);
        return { match: match, profile: profile, convo: convo };
      })
      .filter(function (row) {
        return row.profile && row.convo;
      })
      .sort(function (a, b) {
        return (b.convo.updatedAt || 0) - (a.convo.updatedAt || 0);
      });
  };

  App.addOwnMessage = function addOwnMessage(profileId, text) {
    const clean = String(text || "").trim();
    if (!clean) return null;
    if (!App.hasMatch(profileId)) return null;

    const profile = App.getProfileById(profileId);
    if (!profile) return null;

    const all = App.getConversations();
    const id = String(profileId);
    if (!all[id]) {
      App.ensureConversation(profile);
    }
    const latest = App.getConversations();
    latest[id].messages.push({
      id: Date.now() + "-" + Math.random().toString(16).slice(2),
      from: "me",
      text: clean.slice(0, 500),
      at: Date.now(),
    });
    latest[id].updatedAt = Date.now();
    latest[id].unread = 0;
    App.saveJSON("conversations", latest);
    return latest[id];
  };

  App.markConversationRead = function markConversationRead(profileId) {
    const all = App.getConversations();
    const id = String(profileId);
    if (!all[id]) return;
    all[id].unread = 0;
    App.saveJSON("conversations", all);
  };

  App.lastMessagePreview = function lastMessagePreview(convo) {
    if (!convo || !convo.messages.length) return "Sin mensajes todavía";
    const last = convo.messages[convo.messages.length - 1];
    return last.text;
  };

  App.formatTime = function formatTime(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString("es", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return "";
    }
  };
})(window.TinderApp = window.TinderApp || {});
