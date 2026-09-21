/* Horizontal deck: one panel at a time, stepped with the arrows beside the
 * panel, the dots under it, the keyboard or a swipe.
 *
 * The track is a native scroll-snap container, so touch swiping, momentum and
 * the reduced-motion preference all come from the browser; the script only
 * moves the scroll position and mirrors it back into the dots. Stepping wraps
 * around, so neither arrow is ever dead — a greyed-out arrow reads as broken
 * rather than as "you are at the end".
 *
 * Decks whose panels are appended at runtime (the scenario deck) are set up by
 * calling initDecks() again after appending.
 */
(function (global) {
  "use strict";

  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" ' +
              'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function setup(deck) {
    var view = deck.querySelector(".deck__viewport");
    var slides = view ? [].slice.call(view.children) : [];
    if (!view || slides.length < 2) return;

    var label = deck.getAttribute("data-deck-label") || "Figures";
    deck.setAttribute("role", "group");
    deck.setAttribute("aria-roledescription", "carousel");
    deck.setAttribute("aria-label", label);

    var stage = el("div", "deck__stage");
    view.parentNode.insertBefore(stage, view);
    stage.appendChild(view);

    var prev = el("button", "deck__arrow deck__arrow--prev");
    var next = el("button", "deck__arrow deck__arrow--next");
    prev.type = next.type = "button";
    prev.innerHTML = ARROW;
    next.innerHTML = ARROW;
    prev.setAttribute("aria-label", "Previous, " + label);
    next.setAttribute("aria-label", "Next, " + label);
    stage.insertBefore(prev, view);
    stage.appendChild(next);

    var foot = el("div", "deck__foot");
    var caption = el("p", "deck__label");
    var dots = el("div", "deck__dots");

    slides.forEach(function (s, i) {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (i + 1) + " of " + slides.length + ": " +
        (s.getAttribute("data-title") || ""));
      var d = el("button", "deck__dot");
      d.type = "button";
      d.setAttribute("aria-label",
        "Show " + (s.getAttribute("data-title") || ("panel " + (i + 1))));
      d.addEventListener("click", function () { go(i); });
      dots.appendChild(d);
    });

    foot.appendChild(dots);
    foot.appendChild(caption);
    deck.appendChild(foot);

    var still = window.matchMedia("(prefers-reduced-motion: reduce)");

    function index() {
      return Math.round(view.scrollLeft / view.clientWidth);
    }
    function go(i) {
      i = (i + slides.length) % slides.length;          // wrap at both ends
      view.scrollTo({ left: i * view.clientWidth,
                      behavior: still.matches ? "auto" : "smooth" });
    }
    function sync() {
      var i = index();
      caption.textContent = (i + 1) + " / " + slides.length + " · " +
        (slides[i].getAttribute("data-title") || "");
      [].forEach.call(dots.children, function (d, k) {
        d.classList.toggle("is-on", k === i);
        d.setAttribute("aria-current", k === i ? "true" : "false");
      });
    }

    prev.addEventListener("click", function () { go(index() - 1); });
    next.addEventListener("click", function () { go(index() + 1); });
    deck.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(index() - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(index() + 1); e.preventDefault(); }
    });

    var tick;
    function later(ms) { clearTimeout(tick); tick = setTimeout(sync, ms); }
    view.addEventListener("scroll", function () { later(60); });
    window.addEventListener("resize", function () { later(120); });

    deck.setAttribute("data-deck-ready", "");
    sync();
  }

  function initDecks() {
    [].forEach.call(document.querySelectorAll("[data-deck]:not([data-deck-ready])"), setup);
  }

  global.initDecks = initDecks;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDecks);
  } else {
    initDecks();
  }
})(window);
