(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    document.documentElement.classList.add("js");

    var shows = [
        {
            theme: "software",
            line: "Built alone. The caregiver and the patient each have their own site. A study with 25 people scored 76.4 and 78.7, and the written comments changed the interface.",
            links: [
                ["https://neuroease-dashboard.onrender.com/", "Caregiver site", false],
                ["https://neuroease-patient.onrender.com/", "Patient site", true]
            ]
        },
        {
            theme: "data",
            line: "Cleaned about 1.1 million Metropolitan Police records and compared two models. The forest reached MAE 3.47 and R² 0.93, against 4.93 and 0.92 for linear regression.",
            links: [
                ["https://nno3.github.io/street-crime/", "Live", false],
                ["https://github.com/nno3/street-crime", "Code", true]
            ]
        },
        {
            theme: "ai",
            line: "Uneven light was hiding the vessels. Removing it lifted vessel IoU from 0.14 to 0.54. One fixed pipeline then reached 0.67, including on images it was not tuned on.",
            links: [
                ["retina.html", "Read the result", false]
            ]
        },
        {
            theme: "cyber",
            line: "Four teaching captures. Each one is a normal protocol, then the weakness in the packets. A sample file is returned only after the server can verify who is asking. Pair work with Muhammad Abdullah Malik.",
            links: [
                ["https://nno3.github.io/network-security/", "Network security", false],
                ["https://nno3.github.io/file-recovery/", "File recovery", true]
            ]
        }
    ];

    var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
    var prompts = Array.prototype.slice.call(document.querySelectorAll("[data-show]"));
    var studio = document.getElementById("studio");
    var orbit = document.getElementById("orbit");
    var line = document.getElementById("stage-line");
    var linkRow = document.getElementById("stage-links");
    var meter = document.getElementById("meter");
    var index = 0;
    var dragged = false;

    function mod(n) {
        return (n % scenes.length + scenes.length) % scenes.length;
    }

    function slotFor(n, active) {
        var d = n - active;
        var len = scenes.length;
        d = ((d % len) + len) % len;
        if (d > len / 2) d -= len;
        return d;
    }

    function countUp(root) {
        root.querySelectorAll("[data-count]").forEach(function (el) {
            var raw = el.getAttribute("data-count");
            var target = parseFloat(raw);
            var decimals = (raw.split(".")[1] || "").length;
            if (reduce) {
                el.textContent = raw;
                return;
            }
            var start = performance.now();
            function frame(now) {
                var t = Math.min(1, (now - start) / 900);
                var eased = 1 - Math.pow(1 - t, 3);
                el.textContent = (target * eased).toFixed(decimals);
                if (t < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        });
    }

    function paintLinks(item) {
        linkRow.textContent = "";
        item.links.forEach(function (pair) {
            var a = document.createElement("a");
            a.href = pair[0];
            a.textContent = pair[1];
            a.className = pair[2] ? "text-link" : "btn";
            linkRow.appendChild(a);
        });
    }

    function arm() {
        if (reduce || !meter) return;
        meter.classList.remove("run");
        void meter.offsetWidth;
        meter.classList.add("run");
    }

    function paint(i) {
        index = mod(i);
        var item = shows[index];
        scenes.forEach(function (el, n) {
            var slot = slotFor(n, index);
            el.dataset.slot = String(slot);
            el.classList.toggle("is-on", slot === 0);
            if (slot === 0) countUp(el);
        });
        prompts.forEach(function (btn, n) {
            btn.setAttribute("aria-selected", n === index ? "true" : "false");
        });
        if (studio) studio.dataset.theme = item.theme;
        if (line) {
            line.textContent = item.line;
            line.classList.remove("swap");
            void line.offsetWidth;
            line.classList.add("swap");
        }
        paintLinks(item);
        arm();
    }

    prompts.forEach(function (btn, n) {
        btn.addEventListener("click", function () { paint(n); });
        btn.addEventListener("keydown", function (e) {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            var next = e.key === "ArrowRight" ? n + 1 : n - 1;
            var target = prompts[mod(next)];
            target.focus();
            paint(next);
        });
    });

    scenes.forEach(function (el, n) {
        el.addEventListener("click", function () {
            if (dragged) {
                dragged = false;
                return;
            }
            if (el.dataset.slot !== "0") paint(n);
        });
    });

    if (orbit) {
        var startX = 0;
        orbit.addEventListener("pointerdown", function (e) { startX = e.clientX; });
        orbit.addEventListener("pointerup", function (e) {
            var dx = e.clientX - startX;
            if (Math.abs(dx) > 48) {
                dragged = true;
                paint(index + (dx < 0 ? 1 : -1));
                window.setTimeout(function () { dragged = false; }, 350);
            }
        });
        if (fine && !reduce) {
            orbit.addEventListener("pointermove", function (e) {
                var rect = orbit.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                var win = orbit.querySelector('[data-slot="0"] .window');
                if (!win) return;
                win.style.setProperty("--rx", (x * -10) + "deg");
                win.style.setProperty("--ry", (y * 8) + "deg");
            });
            orbit.addEventListener("pointerleave", function () {
                var win = orbit.querySelector('[data-slot="0"] .window');
                if (!win) return;
                win.style.setProperty("--rx", "0deg");
                win.style.setProperty("--ry", "0deg");
            });
        }
    }

    if (meter) {
        meter.addEventListener("animationend", function (e) {
            if (e.animationName !== "fill") return;
            paint(index + 1);
        });
    }
    function pauseMeter() {
        if (meter) meter.style.animationPlayState = "paused";
    }
    function runMeter() {
        if (meter && !document.hidden) meter.style.animationPlayState = "running";
    }
    if (studio && fine) {
        studio.addEventListener("mouseenter", pauseMeter);
        studio.addEventListener("mouseleave", runMeter);
    }
    if (studio) {
        studio.addEventListener("focusin", pauseMeter);
        studio.addEventListener("focusout", function (e) {
            if (!studio.contains(e.relatedTarget)) runMeter();
        });
    }
    document.addEventListener("visibilitychange", function () {
        if (!meter) return;
        meter.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    paint(0);

    var skillButtons = Array.prototype.slice.call(document.querySelectorAll("[data-skill]"));
    var demos = Array.prototype.slice.call(document.querySelectorAll("[data-demo]"));
    var indicator = document.querySelector(".indicator");

    function placeIndicator(btn) {
        if (!indicator || !btn) return;
        indicator.style.setProperty("--t", btn.offsetTop + "px");
        indicator.style.setProperty("--h", btn.offsetHeight + "px");
    }
    function showSkill(n) {
        skillButtons.forEach(function (btn, i) {
            btn.setAttribute("aria-selected", i === n ? "true" : "false");
        });
        demos.forEach(function (demo, i) {
            demo.classList.toggle("is-on", i === n);
        });
        placeIndicator(skillButtons[n]);
    }
    skillButtons.forEach(function (btn, n) {
        btn.addEventListener("click", function () { showSkill(n); });
        if (fine) btn.addEventListener("mouseenter", function () { showSkill(n); });
    });
    showSkill(0);
    window.addEventListener("resize", function () {
        placeIndicator(document.querySelector("[data-skill][aria-selected='true']"));
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            placeIndicator(document.querySelector("[data-skill][aria-selected='true']"));
        });
    }

    var eduButtons = Array.prototype.slice.call(document.querySelectorAll("[data-edu]"));
    var bead = document.querySelector(".bead");
    var eduTimers = [];
    var eduPlayed = false;
    function clearEdu() {
        eduTimers.forEach(function (id) { window.clearTimeout(id); });
        eduTimers = [];
    }
    function showEdu(n, instant) {
        eduButtons.forEach(function (btn, i) {
            var on = i === n;
            btn.classList.toggle("is-on", on);
            btn.setAttribute("aria-selected", on ? "true" : "false");
        });
        if (!bead) return;
        if (instant) bead.style.transition = "none";
        bead.style.setProperty("--p", ["16.6%", "50%", "83.3%"][n]);
        if (instant) {
            void bead.offsetWidth;
            bead.style.transition = "";
        }
    }
    eduButtons.forEach(function (btn, n) {
        btn.addEventListener("click", function () {
            clearEdu();
            showEdu(n);
        });
    });

    var roleButtons = Array.prototype.slice.call(document.querySelectorAll("[data-role]"));
    var rolePanels = Array.prototype.slice.call(document.querySelectorAll(".roles .role"));
    function showRole(n) {
        roleButtons.forEach(function (btn, i) {
            btn.setAttribute("aria-selected", i === n ? "true" : "false");
        });
        rolePanels.forEach(function (panel, i) {
            panel.classList.toggle("is-on", i === n);
        });
    }
    roleButtons.forEach(function (btn, n) {
        btn.addEventListener("click", function () { showRole(n); });
    });

    var filters = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll(".pcard");
    filters.forEach(function (filter) {
        filter.addEventListener("click", function () {
            var kind = filter.getAttribute("data-filter");
            filters.forEach(function (item) {
                item.setAttribute("aria-selected", item === filter ? "true" : "false");
            });
            cards.forEach(function (card) {
                var show = kind === "all" || card.getAttribute("data-kind") === kind;
                card.classList.toggle("hide", !show);
                if (show) {
                    card.classList.remove("pop");
                    void card.offsetWidth;
                    card.classList.add("pop");
                }
            });
        });
    });

    var contact = document.getElementById("contact");
    document.querySelectorAll(".tilt").forEach(function (card) {
        if (reduce) return;
        card.addEventListener("pointermove", function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = "rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 6) + "deg) translateY(-6px)";
        });
        card.addEventListener("pointerleave", function () {
            card.style.transform = "";
        });
    });

    if (contact && fine) {
        contact.addEventListener("pointermove", function (e) {
            var rect = contact.getBoundingClientRect();
            contact.style.setProperty("--x", (e.clientX - rect.left) + "px");
            contact.style.setProperty("--y", (e.clientY - rect.top) + "px");
        });
    }

    if ("IntersectionObserver" in window) {
        var seen = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in");
                if (entry.target.id === "education" && !eduPlayed) {
                    eduPlayed = true;
                    if (reduce) {
                        showEdu(2);
                    } else {
                        showEdu(0, true);
                        eduTimers.push(window.setTimeout(function () { showEdu(1); }, 650));
                        eduTimers.push(window.setTimeout(function () { showEdu(2); }, 1500));
                    }
                }
                seen.unobserve(entry.target);
            });
        }, { threshold: 0.18 });
        document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
    } else {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
        showEdu(2);
    }
})();
