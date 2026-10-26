(function (App) {
  App.state = {
    view: "discover",
    chatId: null,
    busy: false,
  };

  function $(id) {
    return document.getElementById(id);
  }

  App.el = $;

  App.setHeader = function setHeader(title) {
    const node = $("app-title");
    if (node) node.textContent = title;
  };

  App.switchView = function switchView(view) {
    App.state.view = view;
    if (view !== "messages") App.state.chatId = null;

    document.querySelectorAll(".view").forEach(function (section) {
      const active = section.dataset.view === view;
      section.classList.toggle("is-active", active);
      section.hidden = !active;
    });

    document.querySelectorAll(".bottom-nav button").forEach(function (btn) {
      const isCurrent = btn.dataset.view === view;
      if (isCurrent) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    const titles = {
      discover: "Descubrir",
      matches: "Matches",
      messages: "Mensajes",
      profile: "Mi perfil",
    };
    App.setHeader(titles[view] || "Descubrir");

    if (view === "discover") App.renderCards();
    if (view === "matches") App.renderMatches();
    if (view === "messages") App.renderMessages();
    if (view === "profile") App.renderOwnProfile();
  };

  App.renderCards = function renderCards() {
    const root = $("cards");
    if (!root) return;

    root.querySelectorAll("article").forEach(function (card) {
      card.remove();
    });

    const available = App.getAvailableProfiles().slice().reverse();
    available.forEach(function (profile) {
      root.appendChild(App.createCard(profile));
    });

    const empty = $("cards-empty");
    if (empty) empty.hidden = available.length > 0;

    const disable = available.length === 0 || App.state.busy;
    document.querySelectorAll(".actions button").forEach(function (btn) {
      if (btn.classList.contains("is-undo")) {
        const stack = App.loadJSON("undo", []);
        btn.disabled = App.state.busy || !stack.length;
      } else {
        btn.disabled = disable;
      }
    });
  };

  App.createCard = function createCard(profile) {
    const article = document.createElement("article");
    article.dataset.id = String(profile.id);
    article.setAttribute("aria-label", profile.name + ", " + profile.age);

    const img = document.createElement("img");
    img.src = profile.image;
    img.alt = profile.name + ", " + profile.age + " años";

    const info = document.createElement("div");
    info.className = "card-info";

    const title = document.createElement("h2");
    title.appendChild(document.createTextNode(profile.name + " "));
    const age = document.createElement("span");
    age.textContent = String(profile.age);
    title.appendChild(age);

    const location = document.createElement("p");
    location.className = "card-location";
    location.textContent = profile.location;

    const bio = document.createElement("p");
    bio.className = "card-bio";
    bio.textContent = profile.description;

    const interests = document.createElement("p");
    interests.className = "card-interests";
    interests.textContent = App.formatInterests(profile.interests);

    info.appendChild(title);
    info.appendChild(location);
    info.appendChild(bio);
    info.appendChild(interests);

    const nope = document.createElement("div");
    nope.className = "choice nope";
    nope.textContent = "NOPE";
    const like = document.createElement("div");
    like.className = "choice like";
    like.textContent = "LIKE";
    const superLike = document.createElement("div");
    superLike.className = "choice super";
    superLike.textContent = "SUPER";

    article.appendChild(img);
    article.appendChild(info);
    article.appendChild(nope);
    article.appendChild(like);
    article.appendChild(superLike);
    return article;
  };

  App.renderMatches = function renderMatches() {
    const list = $("matches-list");
    const empty = $("matches-empty");
    if (!list || !empty) return;

    list.replaceChildren();
    const matches = App.getMatches();
    empty.hidden = matches.length > 0;
    list.hidden = matches.length === 0;

    matches.forEach(function (match) {
      const profile = App.getProfileById(match.profileId);
      if (!profile) return;
      list.appendChild(App.createMatchItem(profile));
    });
  };

  App.createMatchItem = function createMatchItem(profile) {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = profile.image;
    img.alt = "";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.appendChild(document.createTextNode(profile.name + ", "));
    const age = document.createElement("span");
    age.textContent = String(profile.age);
    title.appendChild(age);

    const loc = document.createElement("p");
    loc.textContent = profile.location;

    const desc = document.createElement("p");
    desc.textContent = profile.description;

    const actions = document.createElement("div");
    actions.className = "list-actions";

    const detailBtn = document.createElement("button");
    detailBtn.type = "button";
    detailBtn.textContent = "Ver perfil";
    detailBtn.addEventListener("click", function () {
      App.openProfileDetail(profile.id);
    });

    const chatBtn = document.createElement("button");
    chatBtn.type = "button";
    chatBtn.textContent = "Mensaje";
    chatBtn.addEventListener("click", function () {
      App.openChat(profile.id);
    });

    actions.appendChild(detailBtn);
    actions.appendChild(chatBtn);
    body.appendChild(title);
    body.appendChild(loc);
    body.appendChild(desc);
    body.appendChild(actions);

    const row = document.createElement("article");
    row.className = "list-item";
    row.appendChild(img);
    row.appendChild(body);
    li.appendChild(row);
    return li;
  };

  App.renderMessages = function renderMessages() {
    const listView = $("inbox");
    const chatView = $("chat");
    if (!listView || !chatView) return;

    if (App.state.chatId) {
      listView.hidden = true;
      chatView.hidden = false;
      App.renderChat(App.state.chatId);
      return;
    }

    listView.hidden = false;
    chatView.hidden = true;

    const list = $("inbox-list");
    const empty = $("inbox-empty");
    list.replaceChildren();

    const rows = App.getSortedConversations();
    empty.hidden = rows.length > 0;
    list.hidden = rows.length === 0;

    rows.forEach(function (row) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "list-item";

      const img = document.createElement("img");
      img.src = row.profile.image;
      img.alt = "";

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = row.profile.name;
      if (row.convo.unread) {
        const badge = document.createElement("span");
        badge.className = "unread";
        badge.textContent = String(row.convo.unread);
        title.appendChild(badge);
      }

      const preview = document.createElement("p");
      preview.textContent = App.lastMessagePreview(row.convo);

      const time = document.createElement("p");
      time.textContent = App.formatTime(row.convo.updatedAt);

      body.appendChild(title);
      body.appendChild(preview);
      body.appendChild(time);
      btn.appendChild(img);
      btn.appendChild(body);
      btn.addEventListener("click", function () {
        App.openChat(row.profile.id);
      });
      list.appendChild(btn);
    });
  };

  App.renderChat = function renderChat(profileId) {
    const profile = App.getProfileById(profileId);
    const convo = App.getConversation(profileId);
    const thread = $("chat-thread");
    const name = $("chat-name");
    const photo = $("chat-photo");
    if (!profile || !convo || !thread) return;

    App.markConversationRead(profileId);
    name.textContent = profile.name;
    photo.src = profile.image;
    photo.alt = profile.name;

    thread.replaceChildren();
    if (!convo.messages.length) {
      const note = document.createElement("p");
      note.className = "bubble is-note";
      note.textContent =
        "Chat de demostración local. Los mensajes no se envían a nadie y se guardan solo en este navegador.";
      thread.appendChild(note);
    }

    convo.messages.forEach(function (msg) {
      const bubble = document.createElement("div");
      bubble.className = "bubble is-me";
      const text = document.createElement("p");
      text.textContent = msg.text;
      const time = document.createElement("time");
      time.textContent = App.formatTime(msg.at);
      bubble.appendChild(text);
      bubble.appendChild(time);
      thread.appendChild(bubble);
    });

    thread.scrollTop = thread.scrollHeight;
    const input = $("chat-input");
    if (input) input.focus();
  };

  App.openChat = function openChat(profileId) {
    if (!App.hasMatch(profileId)) return;
    App.state.chatId = Number(profileId);
    App.switchView("messages");
  };

  App.openProfileDetail = function openProfileDetail(profileId) {
    const profile = App.getProfileById(profileId) || App.getCurrentProfile();
    const dialog = $("profile-modal");
    const body = $("profile-modal-body");
    if (!profile || !dialog || !body) return;

    body.replaceChildren();

    const img = document.createElement("img");
    img.className = "detail-photo";
    img.src = profile.image;
    img.alt = profile.name;

    const title = document.createElement("h2");
    title.textContent = profile.name + ", " + profile.age;

    const loc = document.createElement("p");
    loc.textContent = profile.location;

    const desc = document.createElement("p");
    desc.textContent = profile.description;

    const pills = document.createElement("div");
    pills.className = "pill-row";
    (profile.interests || []).forEach(function (tag) {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = tag;
      pills.appendChild(pill);
    });

    const actions = document.createElement("div");
    actions.className = "modal-actions";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ghost-btn";
    closeBtn.textContent = "Cerrar";
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });

    if (App.hasMatch(profile.id)) {
      const chatBtn = document.createElement("button");
      chatBtn.type = "button";
      chatBtn.className = "primary-btn";
      chatBtn.textContent = "Enviar mensaje";
      chatBtn.addEventListener("click", function () {
        dialog.close();
        App.openChat(profile.id);
      });
      actions.appendChild(chatBtn);
    } else if (App.getCurrentProfile() && App.getCurrentProfile().id === profile.id) {
      const likeBtn = document.createElement("button");
      likeBtn.type = "button";
      likeBtn.className = "primary-btn";
      likeBtn.textContent = "Like";
      likeBtn.addEventListener("click", function () {
        dialog.close();
        App.decideFromButton("like");
      });
      actions.appendChild(likeBtn);
    }

    actions.appendChild(closeBtn);
    body.appendChild(img);
    body.appendChild(title);
    body.appendChild(loc);
    body.appendChild(desc);
    body.appendChild(pills);
    body.appendChild(actions);
    dialog.showModal();
  };

  App.showMatchModal = function showMatchModal(profile) {
    const dialog = $("match-modal");
    const body = $("match-modal-body");
    if (!dialog || !body || !profile) return;

    body.replaceChildren();
    const badge = document.createElement("p");
    badge.className = "badge";
    badge.textContent = "Match simulado (datos locales)";

    const img = document.createElement("img");
    img.src = profile.image;
    img.alt = profile.name;

    const title = document.createElement("h2");
    title.textContent = "¡Match con " + profile.name + "!";

    const text = document.createElement("p");
    text.textContent =
      "Esto no significa que una persona real haya correspondido. El match se guardó en este navegador.";

    const actions = document.createElement("div");
    actions.className = "modal-actions";

    const chatBtn = document.createElement("button");
    chatBtn.type = "button";
    chatBtn.className = "primary-btn";
    chatBtn.textContent = "Iniciar conversación";
    chatBtn.addEventListener("click", function () {
      dialog.close();
      App.openChat(profile.id);
    });

    const laterBtn = document.createElement("button");
    laterBtn.type = "button";
    laterBtn.className = "ghost-btn";
    laterBtn.textContent = "Seguir descubriendo";
    laterBtn.addEventListener("click", function () {
      dialog.close();
    });

    actions.appendChild(chatBtn);
    actions.appendChild(laterBtn);
    body.appendChild(badge);
    body.appendChild(img);
    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(actions);
    dialog.showModal();
  };

  App.DEFAULT_OWN_PROFILE = {
    name: "Tú",
    age: 21,
    location: "Bucaramanga",
    description: "Edita tu perfil. Se guarda solo en este navegador.",
    interests: "Música, Cine",
  };

  App.getOwnProfile = function getOwnProfile() {
    const stored = App.loadJSON("ownProfile", null);
    if (!stored || typeof stored !== "object") return Object.assign({}, App.DEFAULT_OWN_PROFILE);
    return {
      name: stored.name || App.DEFAULT_OWN_PROFILE.name,
      age: stored.age || App.DEFAULT_OWN_PROFILE.age,
      location: stored.location || App.DEFAULT_OWN_PROFILE.location,
      description: stored.description || "",
      interests: stored.interests || "",
    };
  };

  App.renderOwnProfile = function renderOwnProfile() {
    const data = App.getOwnProfile();
    const form = $("own-profile-form");
    const avatar = $("own-avatar");
    if (!form) return;
    form.elements.name.value = data.name;
    form.elements.age.value = data.age;
    form.elements.location.value = data.location;
    form.elements.description.value = data.description;
    form.elements.interests.value = data.interests;
    if (avatar) {
      avatar.textContent = (data.name || "T").trim().charAt(0).toUpperCase();
    }
  };

  App.validateOwnProfile = function validateOwnProfile(data) {
    const errors = [];
    if (data.name.length < 2 || data.name.length > 40) {
      errors.push("El nombre debe tener entre 2 y 40 caracteres.");
    }
    const age = Number(data.age);
    if (!Number.isInteger(age) || age < 18 || age > 99) {
      errors.push("La edad debe ser un número entero entre 18 y 99.");
    }
    if (data.location.length < 2 || data.location.length > 40) {
      errors.push("La ubicación debe tener entre 2 y 40 caracteres.");
    }
    if (data.description.length > 280) {
      errors.push("La descripción no puede superar 280 caracteres.");
    }
    if (data.interests.length > 80) {
      errors.push("Los intereses no pueden superar 80 caracteres.");
    }
    return errors;
  };
})(window.TinderApp = window.TinderApp || {});
