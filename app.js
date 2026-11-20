(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    var shows = [
        {
            kicker: "Software",
            title: "Two interfaces",
            line: "NeuroEase has a site for the caregiver and a site for the patient. A study with 25 people scored 76.4 and 78.7.",
            face: "app"
        },
        {
            kicker: "Data",
            title: "1.1 million records",
            line: "Street crime, 2023. A random forest reached MAE 3.47 and R² 0.93, against 4.93 and 0.92 for linear regression.",
            face: "chart"
        },
        {
            kicker: "AI",
            title: "A measured pipeline",
            line: "Retinal vessels. Illumination removal lifted vessel IoU from 0.14 to 0.54. The final pipeline reached 0.67.",
            face: "model"
        },
        {
            kicker: "Cyber",
            title: "Check, then return",
            line: "Four packet captures, and a sample file returned only after the server can verify who is asking.",
            face: "lock"
        }
    ];
    var index = 0;
    var timer = null;
    var card = document.getElementById("stage-card");
    var pills = document.querySelectorAll("[data-show]");

    function paint(i) {
        index = i;
        var item = shows[i];
        var prev = shows[(i + shows.length - 1) % shows.length];
        var next = shows[(i + 1) % shows.length];
        card.classList.remove("swap");
        void card.offsetWidth;
        card.classList.add("swap");
        card.querySelector("[data-kicker]").textContent = item.kicker;
        card.querySelector("[data-title]").textContent = item.title;
        card.querySelector("[data-line]").textContent = item.line;
        card.dataset.face = item.face;
        document.querySelector(".wing.left").dataset.face = prev.face;
        document.querySelector(".wing.right").dataset.face = next.face;
        pills.forEach(function (pill, n) {
            pill.setAttribute("aria-selected", n === i ? "true" : "false");
        });
    }

    function start() {
        if (reduce) return;
        stop();
        timer = window.setInterval(function () {
            paint((index + 1) % shows.length);
        }, 4200);
    }
    function stop() {
        if (timer) window.clearInterval(timer);
        timer = null;
    }

    pills.forEach(function (pill, n) {
        pill.addEventListener("click", function () {
            paint(n);
            start();
        });
    });
    var stage = document.querySelector(".showcase");
    if (stage) {
        stage.addEventListener("mouseenter", stop);
        stage.addEventListener("mouseleave", start);
    }
    paint(0);
    start();

    var filters = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll(".pcard");
    filters.forEach(function (filter) {
        filter.addEventListener("click", function () {
            var kind = filter.getAttribute("data-filter");
            filters.forEach(function (item) {
                item.setAttribute("aria-selected", item === filter ? "true" : "false");
            });
            cards.forEach(function (cardEl) {
                var show = kind === "all" || cardEl.getAttribute("data-kind") === kind;
                cardEl.classList.toggle("hide", !show);
            });
        });
    });
})();
