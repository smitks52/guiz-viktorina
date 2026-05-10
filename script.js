const questions = [
    { text: "Что означает HTML?", options: ["Hyper Text Markup Language", "Home Tool Markup", "Hyperlinks Text", "High Level Text"], correct: 0 },
    { text: "Какой тег для ссылки?", options: ["<a>", "<link>", "<href>", "<url>"], correct: 0 },
    { text: "CSS свойство для цвета текста?", options: ["text-color", "color", "font-color", "bgcolor"], correct: 1 },
    { text: "Как объявить переменную в JS?", options: ["var", "let", "const", "Все варианты"], correct: 3 },
    { text: "Метод массива для добавления в конец?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
    { text: "Что выведет typeof null?", options: ["null", "undefined", "object", "number"], correct: 2 },
    { text: "Селектор по id?", options: [".id", "#id", "id", "*id"], correct: 1 },
    { text: "Flexbox: display?", options: ["flex", "block", "inline", "grid"], correct: 0 },
    { text: "Тег для JavaScript?", options: ["<js>", "<javascript>", "<script>", "<code>"], correct: 2 },
    { text: "Что такое семантическая вёрстка?", options: ["Теги по смыслу", "Быстрая загрузка", "Без CSS", "Только div"], correct: 0 }
];

let current = 0;
let answers = new Array(questions.length).fill(null);
let finished = false;
let best = localStorage.getItem("bestScore");
if (best) best = parseInt(best); else best = null;

const quizDiv = document.getElementById("quizContainer");
const resultDiv = document.getElementById("resultContainer");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const bestDisplay = document.getElementById("bestScore");
const scoreSpan = document.getElementById("score");
const totalSpan = document.getElementById("total");
const messageSpan = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

function updateBestUI() {
    bestDisplay.innerText = best ? `🏆 Лучший: ${best}/${questions.length}` : "🏆 Лучший: --";
}

function saveBest(score) {
    if (best === null || score > best) {
        best = score;
        localStorage.setItem("bestScore", best);
        updateBestUI();
    }
}

function render() {
    if (finished) return;
    let q = questions[current];
    questionText.innerText = q.text;
    document.getElementById("questionCounter").innerText = `Вопрос ${current+1} из ${questions.length}`;
    optionsDiv.innerHTML = "";
    q.options.forEach((opt, idx) => {
        let btn = document.createElement("div");
        btn.className = "option";
        if (answers[current] === idx) btn.classList.add("selected");
        btn.innerText = String.fromCharCode(65+idx) + ". " + opt;
        if (answers[current] === null) {
            btn.onclick = () => select(idx);
        } else {
            btn.classList.add("disabled-option");
        }
        optionsDiv.appendChild(btn);
    });
    nextBtn.disabled = (answers[current] === null);
}

function select(idx) {
    if (finished) return;
    if (answers[current] !== null) return;
    answers[current] = idx;
    render();
}

function next() {
    if (nextBtn.disabled) return;
    if (current + 1 < questions.length) {
        current++;
        render();
    } else {
        finish();
    }
}

function finish() {
    finished = true;
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].correct) correct++;
    }
    saveBest(correct);
    scoreSpan.innerText = correct;
    totalSpan.innerText = questions.length;
    let msg = "";
    if (correct === questions.length) msg = "🎉 Превосходно! Вы эксперт!";
    else if (correct >= 8) msg = "👍 Отлично!";
    else if (correct >= 5) msg = "📚 Хорошо, но можно лучше.";
    else msg = "💪 Попробуйте ещё раз.";
    messageSpan.innerText = msg;
    quizDiv.classList.add("hidden");
    resultDiv.classList.remove("hidden");
}

function restart() {
    current = 0;
    answers.fill(null);
    finished = false;
    resultDiv.classList.add("hidden");
    quizDiv.classList.remove("hidden");
    render();
}

nextBtn.onclick = next;
restartBtn.onclick = restart;
updateBestUI();
render();
