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

    var tabs = document.querySelectorAll("[data-tab]");
    var panels = document.querySelectorAll("[data-panel]");
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            var name = tab.getAttribute("data-tab");
            tabs.forEach(function (item) {
                item.setAttribute("aria-selected", item === tab ? "true" : "false");
            });
            panels.forEach(function (panel) {
                panel.hidden = panel.getAttribute("data-panel") !== name;
            });
        });
    });

    var scene = document.querySelector(".scene");
    if (scene && !reduce && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", function (event) {
            var x = (event.clientX / window.innerWidth - 0.5) * 16;
            var y = (event.clientY / window.innerHeight - 0.5) * 12;
            scene.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
        });
    }

    var items = document.querySelectorAll(".expert, .extra, .feature, .role");
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
