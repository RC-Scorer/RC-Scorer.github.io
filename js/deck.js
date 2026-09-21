/* Horizontal deck: one panel at a time, stepped with the arrow buttons, the
   dots, the keyboard or a swipe.
 *
 * The track is a native scroll-snap container, so touch swiping, momentum and
 * the reduced-motion preference all come from the browser; the script only
 * moves the scroll position, mirrors it back into the dots and hides the arrow
 * that would do nothing. Decks whose panels are appended at runtime (the
 * scenario deck) are set up by calling initDecks() again after appending.
 */
(function (global) {
  "use strict";

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

    var bar = el("div", "deck__bar");
    var prev = el("button", "deck__arrow deck__arrow--prev");
    var next = el("button", "deck__arrow deck__arrow--next");
    prev.type = next.type = "button";
    prev.innerHTML = "<span aria-hidden=\"true\">←</span>";
    next.innerHTML = "<span aria-hidden=\"true\">→</span>";
    prev.setAttribute("aria-label", "Previous, " + label);
    next.setAttribute("aria-label", "Next, " + label);

    var caption = el("p", "deck__label");
    var dots = el("div", "deck__dots");

    slides.forEach(function (s, i) {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (i + 1) + " of " + slides.length + ": " +
        (s.getAttribute("data-title") || ""));
      var d = el("button", "deck__dot");
      d.type = "button";
      d.setAttribute("aria-label", "Show " + (s.getAttribute("data-title") || ("panel " + (i + 1))));
      d.addEventListener("click", function () { go(i); });
      dots.appendChild(d);
    });

    bar.appendChild(prev);
    bar.appendChild(caption);
    bar.appendChild(dots);
    bar.appendChild(next);
    deck.insertBefore(bar, view);

    function index() {
      return Math.round(view.scrollLeft / view.clientWidth);
    }
    var still = window.matchMedia("(prefers-reduced-motion: reduce)");
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      view.scrollTo({ left: i * view.clientWidth,
                      behavior: still.matches ? "auto" : "smooth" });
    }
    function sync() {
      var i = index();
      caption.textContent = (i + 1) + " / " + slides.length + " \u00b7 " +
        (slides[i].getAttribute("data-title") || "");
      [].forEach.call(dots.children, function (d, k) {
        d.classList.toggle("is-on", k === i);
        d.setAttribute("aria-current", k === i ? "true" : "false");
      });
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }

    prev.addEventListener("click", function () { go(index() - 1); });
    next.addEventListener("click", function () { go(index() + 1); });
    deck.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(index() - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(index() + 1); e.preventDefault(); }
    });

    var tick;
    view.addEventListener("scroll", function () {
      clearTimeout(tick);
      tick = setTimeout(sync, 60);
    });
    window.addEventListener("resize", function () {
      clearTimeout(tick);
      tick = setTimeout(sync, 120);
    });

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
