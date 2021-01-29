
const digits = ["ноль","один","два","тру","четыре","пять","шесть","семь","восемь","девять"];
const comboParts = new Map([
    [0, ["","один","два","три","четыре","пять","шесть","семь","восемь","девять"]],
    [1, ["","десять","двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"]],
    [2, ["","сто","двести","триста","четыреста","пятьсот","шестьсот","семьсот","восемьсот","девятьсот"]]
]);
const exceptions = new Map([
    [11, "одиннадцать"],
    [12, "двенадцать"],
    [13, "тринадцать"],
    [14, "четырнадцать"],
    [15, "пятнадцать"],
    [16, "шестнадцать"],
    [17, "семнадцать"],
    [18, "восемнадцать"],
    [19, "девятнадцать"]
])

export const literate = (number) => {
    if (number < 0) return "";
    if (number >= 0 && number <= 9) return digits[number];
    if (exceptions.has(number)) return exceptions.get(number);
    const parts = number.toString().split("");
    const result = [];
    let index = parts.length - 1;
    while (parts.length > 0) {
        const current = parts.shift();
        const word = comboParts.get(index)[parseInt(current, 10)];
        result.push(word);
        index--;
        const leftover = parseInt(parts.join(""), 10);
        if (exceptions.has(leftover)) {
            result.push(exceptions.get(leftover));
            break;
        }
    }
    return result.filter(x => x !== "").join(" ");
}

export const say = (number) => {
    const word = literate(number);
    const message = new SpeechSynthesisUtterance(word);
    message.lang = 'ru';
    window.speechSynthesis.speak(message);
}
