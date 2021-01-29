import { create, el, thumbsUp, createTracker } from './ui.js'
import { say, literate } from './speech.js'
import { spawnFx } from './fx.js'

const sounds = {
    _ok: (() => { const a = document.createElement("audio"); a.src = 'sound/ding.mp3'; return a; })(),
    ok: () => {
        sounds._ok.play();
    },
    _error: (() => { const a = document.createElement("audio"); a.src = 'sound/error.mp3'; return a; })(),
    error: () => {
        sounds._error.play();
    }
}

const runtime = {
    range: {
        from: 0,
        to: 10,
    },
    variants: 4,
    totalScore: 0,
    trackRecord: [],
    current: {
        number: 0,
        attempts: 0,
        variants: [],
    }
}

const showError = (msg) => {
    const errMessage = create("div", "error", msg);
    document.body.appendChild(errMessage);
    return false;
}

const initRuntime = () => {
    const search = new URLSearchParams(location.search);
    if (search.has("from")) runtime.range.from = parseInt(search.get("from"), 10)
    if (search.has("to")) runtime.range.to = parseInt(search.get("to"), 10)
    if (search.has("variants")) runtime.variants = parseInt(search.get("variants"), 10)
    if (runtime.range.from > runtime.range.to) {
        const temp = runtime.range.from;
        runtime.range.from = runtime.range.to;
        runtime.range.to = temp;
    }
    // Check for stupid
    if (runtime.range.to <= 0 || runtime.range.from < 0) {
        return showError("TO and FROM must positive numbers; TO must be non-zero");
    }
    if (runtime.range.to === runtime.range.from) {
        return showError("TO and FROM must differ");
    }
    runtime.variants = Math.max(1, Math.min(runtime.variants, 20, runtime.range.to - runtime.range.from));
    runtime.totalScore = 0
    runtime.trackRecord = []
    return true;
}

const handleVariant = (index, event) => {
    const chosen = runtime.current.variants[index];
    runtime.current.attempts++;
    if (chosen === runtime.current.number) {
        // Win
        sounds.ok();
        const fx = create("div", null, thumbsUp, { className: "correct fx" });
        spawnFx(fx, event.clientX, event.clientY);
        runtime.trackRecord.push({...runtime.current});
        playRound();
    } else {
        sounds.error();
        const fx = create("div", null, "x", { className: "wrong fx" });
        spawnFx(fx, event.clientX, event.clientY);
        updateVariants();
    }
    say(runtime.current.number);
    trackProgress([runtime.current, ...runtime.trackRecord]);
}

let sayButton, numberTitle, trackProgress;
const variants = [];
const createScene = () => {
    numberTitle = create("div", "title");
    document.body.appendChild(numberTitle);
    sayButton = create("button", "sayButton", "<img src='img/speaker.png' />",null, () => {
        say(runtime.current.number);
    });
    document.body.appendChild(sayButton);
    const variantCollection = create("div", "variants");
    for (let i = 0; i < runtime.variants; i++) {
        const variant = create("button", `variant${i}`, "", null, (event) => handleVariant(i, event));
        variants.push(variant);
        variantCollection.appendChild(variant);
    }
    document.body.appendChild(variantCollection);
    const { container, track } = createTracker();
    document.body.appendChild(container);
    trackProgress = track;
}

const updateUI = () => {
    numberTitle.innerHTML = literate(runtime.current.number).toUpperCase();
    for (let i = 0; i < runtime.variants; i++) {
        const varButton = el(`variant${i}`);
        varButton.innerHTML = runtime.current.variants[i];
        const angle = Math.round(Math.random() * 10) * (Math.random() > 0.5 ? -1 : 1);
        varButton.style.transform = `rotate(${angle}deg)`;
    }
}

const randomInRange = () => runtime.range.from + Math.floor(Math.random() * (runtime.range.to - runtime.range.from));

const updateVariants = () => {
    const newVariants = [runtime.current.number];
    for (let i = 0; i < runtime.variants - 1; i++) {
        const variant = randomInRange();
        if (newVariants.includes(variant)) {
            i--;
            continue;
        }
        if (Math.random() < 0.5) newVariants.push(variant); else newVariants.unshift(variant);
    }
    runtime.current.variants = newVariants;
    updateUI();
}

const playRound = () => {
    runtime.current.number = randomInRange();
    runtime.current.attempts = 0;
    updateVariants();
}

window.addEventListener("DOMContentLoaded", () => {
    if (!initRuntime()) return;
    createScene();
    playRound();
})


