(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    var words = document.querySelectorAll(".roles span");
    var index = 0;
    if (!reduce && words.length > 1) {
        window.setInterval(function () {
            words[index].classList.remove("on");
            index = (index + 1) % words.length;
            words[index].classList.add("on");
        }, 1700);
    }

    var items = document.querySelectorAll(".project, .role");
    if (reduce || !("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("in"); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
})();
