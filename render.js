const start_button = document.querySelector("#start");
const pause = document.querySelector("#pause");
const theme = document.querySelector("#theme");
const ok = document.querySelector("#ok");
const settings_button = document.querySelector("#settings");
const gray = document.querySelector(".gray");
const settings_box = document.querySelector("#settingsBox");
const reset = document.querySelector("#reset");
const clock = document.querySelector(".clock-container");
const hoursAdd = document.querySelector("#HA");
const hoursRemove = document.querySelector("#HR");
const minuteAdd = document.querySelector("#MA");
const minuteRemove = document.querySelector("#MR");
const secondAdd = document.querySelector("#SA");
const secondRemove = document.querySelector("#SR");
const get_var = window.getComputedStyle(document.documentElement);

// * audio
const audio = new Audio("D:\\Ali\\projects\\clock_app\\tick_tack.mp3");
const alarm = new Audio("D:\\Ali\\projects\\clock_app\\alarm_1.mp3");

alarm.loop = true;

var paused = false;
var this_alarm = "";
var timer = null;

function closeWindow() {
    window.electronBridge.sendToMain("close-window");
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".alarm_change").forEach(function (element) {
        element.addEventListener("click", (ev) => {
            if (this_alarm != "") {
                this_alarm.pause();
            }
            if (element.innerHTML == "▶️") {
                document.querySelector(".selected").classList.remove("selected");
                element.classList.add("selected");
                document
                    .querySelectorAll(".alarm_change")
                    .forEach(function (element_2) {
                        element_2.innerHTML = "▶️";
                    });
                alarm.pause();
                ok.style.display = "none";
                this_alarm = new Audio(
                    "D:\\Ali\\projects\\clock_app\\alarm_" +
                        ev.target.getAttribute("data-alarm") +
                        ".mp3"
                );
                this_alarm.loop = true;
                element.innerHTML = "⏸️";
                this_alarm.play();
            } else {
                element.innerHTML = "▶️";
                this_alarm.pause();
            }
        });
    });
    document.addEventListener("click", (event) => {
        if (
            !event.target.closest("#settings") &&
            !event.target.closest("#settingsBox")
        ) {
            settings_box.style.bottom = "";
            gray.style.display = "none";
        }
    });
    settings_button.addEventListener("click", () => {
        settings_box.style.bottom = "20px";
        gray.style.display = "inline-block";
    });
    hoursAdd.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-hours"))) + 1;
        if (_ != -1 && _ != 100) {
            document.documentElement.style.setProperty(
                "--timer-hours",
                "'" + _ + "'"
            );
        }
    });
    hoursRemove.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-hours"))) - 1;
        if (_ != -1 && _ != 100) {
            document.documentElement.style.setProperty(
                "--timer-hours",
                "'" + _ + "'"
            );
        }
    });
    minuteAdd.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-minutes"))) + 1;
        if (_ != -1 && _ != 60) {
            document.documentElement.style.setProperty(
                "--timer-minutes",
                "'" + _ + "'"
            );
        }
    });
    minuteRemove.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-minutes"))) - 1;
        if (_ != -1 && _ != 60) {
            document.documentElement.style.setProperty(
                "--timer-minutes",
                "'" + _ + "'"
            );
        }
    });
    secondAdd.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-seconds"))) + 1;
        if (_ != -1 && _ != 60) {
            document.documentElement.style.setProperty(
                "--timer-seconds",
                "'" + _ + "'"
            );
        }
    });
    secondRemove.addEventListener("click", () => {
        let _ = parseInt(eval(get_var.getPropertyValue("--timer-seconds"))) - 1;
        if (_ != -1 && _ != 60) {
            document.documentElement.style.setProperty(
                "--timer-seconds",
                "'" + _ + "'"
            );
        }
    });
});

const start = function () {
    alarm.pause();
    paused = false;
    let audio_played = false;
    pause.style.display = "inline-block";
    start_button.style.display = "none";
    ok.style.display = "none";
    hoursAdd.style.display = "none";
    hoursRemove.style.display = "none";
    minuteAdd.style.display = "none";
    minuteRemove.style.display = "none";
    secondAdd.style.display = "none";
    secondRemove.style.display = "none";
    clock.style.transform = "";

    let targetTime = new Date();
    targetTime.setHours(
        targetTime.getHours() +
            parseInt(eval(get_var.getPropertyValue("--timer-hours")))
    );
    targetTime.setMinutes(
        targetTime.getMinutes() +
            parseInt(eval(get_var.getPropertyValue("--timer-minutes")))
    );
    targetTime.setSeconds(
        targetTime.getSeconds() +
            parseInt(eval(get_var.getPropertyValue("--timer-seconds"))) +
            1
    );

    timer = setInterval(() => {
        const now = new Date();
        const timeRemaining = Math.max(targetTime - now, 0);

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor(
            (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        if (!hours && !minutes && seconds <= 10) {
            audio.play();
        }

        document.documentElement.style.setProperty(
            "--timer-hours",
            "'" + hours + "'"
        );
        document.documentElement.style.setProperty(
            "--timer-minutes",
            "'" + minutes + "'"
        );
        document.documentElement.style.setProperty(
            "--timer-seconds",
            "'" + seconds + "'"
        );

        if (!hours && !minutes && !seconds) {
            clearInterval(timer);
            endOfTimer();
        }
    }, 1000);
};

start_button.addEventListener("click", start);
pause.addEventListener("click", () => {
    if (paused) {
        seconds =
            parseInt(eval(get_var.getPropertyValue("--timer-seconds"))) + 1;
        start();
        reset.style.display = "none";
    } else {
        audio_played = false;
        audio.pause();
        clearInterval(timer);
        paused = true;
        reset.style.display = "inline-block";
    }
});

var endOfTimer = function (x = false) {
    audio.pause();
    if (!x) {
        alarm.play();
        ok.style.display = "inline-block";
    }
    document.documentElement.style.setProperty("--timer-hours", "'" + 0 + "'");
    document.documentElement.style.setProperty(
        "--timer-minutes",
        "'" + 0 + "'"
    );
    document.documentElement.style.setProperty(
        "--timer-seconds",
        "'" + 0 + "'"
    );

    paused = false;
    pause.style.display = "none";
    start_button.style.display = "inline-block";
    hoursAdd.style.display = "inline-block";
    hoursRemove.style.display = "inline-block";
    minuteAdd.style.display = "inline-block";
    minuteRemove.style.display = "inline-block";
    secondAdd.style.display = "inline-block";
    secondRemove.style.display = "inline-block";
    clock.style.transform = "scale(.8)";

    reset.style.display = "none";
    pause.style.display = "none";
    start_button.style.display = "inline-block";
};
reset.addEventListener("click", () => {
    endOfTimer(true);
});
ok.addEventListener("click", () => {
    alarm.pause();
    ok.style.display = "none";
});
theme.addEventListener("click", () => {
    if (get_var.getPropertyValue("--main-color") == "black") {
        document.documentElement.style.setProperty("--main-color", "white");
        document.documentElement.style.setProperty("--m-main-color", "black");
        theme.innerHTML = "🌙";
    } else {
        document.documentElement.style.setProperty("--main-color", "black");
        document.documentElement.style.setProperty("--m-main-color", "white");
        theme.innerHTML = "☀️";
    }
});
