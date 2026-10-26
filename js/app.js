(function (App) {
  const DECISION_THRESHOLD = 75;
  let isAnimating = false;
  let pullDeltaX = 0;

  function topCard() {
    const cards = document.querySelectorAll("#cards article");
    return cards.length ? cards[cards.length - 1] : null;
  }

  function startDrag(event) {
    if (isAnimating || App.state.view !== "discover") return;
    if (event.target.closest("button, a, input, textarea")) return;

    const actualCard = event.target.closest("article");
    if (!actualCard) return;

    const startX = event.pageX ?? event.touches[0].pageX;

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });

    function onMove(moveEvent) {
      const currentX = moveEvent.pageX ?? moveEvent.touches[0].pageX;
      pullDeltaX = currentX - startX;
      if (pullDeltaX === 0) return;

      isAnimating = true;
      const deg = pullDeltaX / 14;
      actualCard.style.transform = "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)";
      actualCard.style.cursor = "grabbing";

      const opacity = Math.abs(pullDeltaX) / 100;
      const isRight = pullDeltaX > 0;
      const choiceEl = isRight
        ? actualCard.querySelector(".choice.like")
        : actualCard.querySelector(".choice.nope");

      actualCard.querySelectorAll(".choice").forEach(function (choice) {
        choice.style.opacity = 0;
      });
      if (choiceEl) choiceEl.style.opacity = opacity;
    }

    function onEnd() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);

      const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

      if (decisionMade) {
        const goRight = pullDeltaX >= 0;
        finishCard(actualCard, goRight ? "like" : "dislike");
        return;
      }

      actualCard.classList.add("reset");
      actualCard.classList.remove("go-right", "go-left", "go-up");
      actualCard.querySelectorAll(".choice").forEach(function (choice) {
        choice.style.opacity = 0;
      });
      actualCard.addEventListener(
        "transitionend",
        function () {
          actualCard.removeAttribute("style");
          actualCard.classList.remove("reset");
          pullDeltaX = 0;
          isAnimating = false;
        },
        { once: true }
      );
    }
  }

  function finishCard(card, action) {
    if (!card || App.state.busy) return;

    const profileId = Number(card.dataset.id);
    App.state.busy = true;
    isAnimating = true;

    const stamp = card.querySelector(
      action === "superlike" ? ".choice.super" : action === "like" ? ".choice.like" : ".choice.nope"
    );
    if (stamp) stamp.style.opacity = 1;

    if (action === "superlike") card.classList.add("go-up");
    else if (action === "like") card.classList.add("go-right");
    else card.classList.add("go-left");

    let completed = false;
    function complete() {
      if (completed) return;
      completed = true;
      if (card.isConnected) card.remove();
      pullDeltaX = 0;
      isAnimating = false;
      App.state.busy = false;

      const result = App.recordDecision(profileId, action);
      App.renderCards();
      if (result && result.matched && result.profile) {
        App.showMatchModal(result.profile);
      }
    }

    card.addEventListener("transitionend", complete, { once: true });
    setTimeout(complete, 400);
  }

  App.decideFromButton = function decideFromButton(action) {
    if (App.state.busy || isAnimating) return;
    const card = topCard();
    if (!card) return;
    finishCard(card, action);
  };

  function bindActions() {
    const undo = document.querySelector("button.is-undo");
    const remove = document.querySelector("button.is-remove");
    const star = document.querySelector("button.is-star");
    const fav = document.querySelector("button.is-fav");
    const zap = document.querySelector("button.is-zap");

    if (undo) {
      undo.addEventListener("click", function () {
        if (App.state.busy || isAnimating) return;
        if (App.undoLast()) App.renderCards();
      });
    }
    if (remove) {
      remove.addEventListener("click", function () {
        App.decideFromButton("dislike");
      });
    }
    if (star) {
      star.addEventListener("click", function () {
        App.decideFromButton("superlike");
      });
    }
    if (fav) {
      fav.addEventListener("click", function () {
        App.decideFromButton("like");
      });
    }
    if (zap) {
      zap.addEventListener("click", function () {
        const current = App.getCurrentProfile();
        if (current) App.openProfileDetail(current.id);
      });
    }
  }

  function bindNav() {
    document.querySelectorAll(".bottom-nav button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        App.switchView(btn.dataset.view);
      });
    });
  }

  function bindChat() {
    const form = App.el("chat-form");
    const back = App.el("chat-back");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = App.el("chat-input");
        if (!input || !App.state.chatId) return;
        const saved = App.addOwnMessage(App.state.chatId, input.value);
        if (!saved) return;
        input.value = "";
        App.renderChat(App.state.chatId);
      });
    }
    if (back) {
      back.addEventListener("click", function () {
        App.state.chatId = null;
        App.renderMessages();
      });
    }
  }

  function bindProfileForm() {
    const form = App.el("own-profile-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = {
        name: String(form.elements.name.value || "").trim(),
        age: String(form.elements.age.value || "").trim(),
        location: String(form.elements.location.value || "").trim(),
        description: String(form.elements.description.value || "").trim(),
        interests: String(form.elements.interests.value || "").trim(),
      };
      const feedback = App.el("profile-feedback");
      const errors = App.validateOwnProfile(data);
      if (errors.length) {
        feedback.className = "feedback is-error";
        feedback.textContent = errors[0];
        return;
      }
      App.saveJSON("ownProfile", {
        name: data.name,
        age: Number(data.age),
        location: data.location,
        description: data.description,
        interests: data.interests,
      });
      feedback.className = "feedback is-ok";
      feedback.textContent = "Perfil guardado en este navegador. No es una cuenta ni un inicio de sesión.";
      App.renderOwnProfile();
    });
  }

  function bindModals() {
    document.querySelectorAll("dialog").forEach(function (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  document.addEventListener("mousedown", startDrag);
  document.addEventListener("touchstart", startDrag, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    bindActions();
    bindNav();
    bindChat();
    bindProfileForm();
    bindModals();
    App.switchView("discover");
  });
})(window.TinderApp = window.TinderApp || {});
