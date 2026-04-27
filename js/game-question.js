/* ===== ИГРА «ЗНАТОК УЛЬЯНОВСКА» — ЛОГИКА ТЕСТА ===== */

const QUESTIONS = [
    {
        question: 'Как изначально назывался Ульяновск?',
        img: 'img/game/1.png',
        options: ['Симбирск', 'Ульяновск', 'Приволжск', 'Сибирск'],
        correct: 0
    },
    {
        question: 'Какой вид динозавра был обнаружен на раскопках в Ульяновской области и назван в честь Симбирска?',
        img: 'img/game/2.png',
        options: [
            'Volgatitan simbirskiensis — титанозавр',
            'Simbirskosaurus uljanovi — хищный карнозавр',
            'Pavlovtiitan lenini — травоядный саврозавр',
            'Ulyanovenator gazovi — мелкий теропод'
        ],
        correct: 0
    },
    {
        question: 'В Ульяновске находится единственный в мире музей',
        img: 'img/game/3.png',
        options: ['Языкова', 'Гончарова', 'Д. Давыдова', 'Аксакова'],
        correct: 1
    },
    {
        question: 'Сказка «Аленький цветочек» написана',
        img: 'img/game/4.png',
        options: ['Садовниковым', 'Аксаковым', 'Языковым', 'Карамзиным'],
        correct: 1
    },
    {
        question: 'В каком году основан Ульяновск?',
        img: 'img/game/5.png',
        options: ['1820', '1648', '1712', '1550'],
        correct: 1
    },
    {
        question: 'На территории Ульяновской области добывают красивые поделочные камни',
        img: 'img/game/6.png',
        options: ['Агат', 'Симбирцит', 'Опал', 'Сенгилит'],
        correct: 1
    },
    {
        question: 'Какое прозвище получил УАЗ-469 благодаря своей проходимости?',
        img: 'img/game/7.png',
        options: ['Буханка', 'Танк на колёсах', 'Симбирский монстр', 'Ульяновский трактор'],
        correct: 0
    },
    {
        question: 'В каком году был открыт Головной отраслевой музей истории гражданской авиации в Ульяновске?',
        img: 'img/game/8.png',
        options: ['2012', '1961', '1983', '1990'],
        correct: 2
    },
    {
        question: 'Чем примечателен Президентский мост в Ульяновске?',
        img: 'img/game/9.png',
        options: [
            'Это один из самых широких мостов России',
            'Это один из самых коротких мостов России',
            'Это один из самых длинных мостов России',
            'Ничем не примечателен'
        ],
        correct: 2
    },
    {
        question: 'Чем наиболее известен Ульяновск?',
        img: 'img/game/10.png',
        options: [
            'Как родина Владимира Ильича Ленина',
            'Как место, в которое в годы Великой Отечественной войны была эвакуирована Московская Патриархия',
            'Как место, в котором 10 лет прожила царевна Тамара',
            'Как столица авиации'
        ],
        correct: 0
    }
];

/* ── DOM-элементы ── */
const elCounter  = document.getElementById('quiz-counter');
const elImg      = document.getElementById('quiz-img');
const elQuestion = document.getElementById('quiz-question');
const elOptions  = document.getElementById('quiz-options');
const elNext     = document.getElementById('quiz-next');
const elBlock    = document.getElementById('quiz-block');
const elResult   = document.getElementById('quiz-result');
const elScore    = document.getElementById('quiz-result-score');
const elSubtitle = document.getElementById('quiz-result-subtitle');
const elText     = document.getElementById('quiz-result-text');

let currentIdx   = 0;
let score        = 0;
let answered     = false;

/* ── Отрисовка текущего вопроса ── */
function renderQuestion(idx) {
    const q = QUESTIONS[idx];
    answered = false;

    elCounter.textContent  = `${idx + 1}/${QUESTIONS.length}`;
    elImg.src              = q.img;
    elImg.alt              = q.question;
    elQuestion.textContent = q.question;

    /* Очищаем старые варианты */
    elOptions.innerHTML = '';
    q.options.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className        = 'quiz-option';
        btn.dataset.idx      = i;
        btn.textContent      = text;
        btn.addEventListener('click', onOptionClick);
        elOptions.appendChild(btn);
    });

    elNext.disabled = true;
}

/* ── Клик по варианту ── */
function onOptionClick(e) {
    /* Снимаем выделение со всех, ставим на выбранный */
    elOptions.querySelectorAll('.quiz-option').forEach(btn => {
        btn.classList.remove('quiz-option--selected');
    });
    e.currentTarget.classList.add('quiz-option--selected');

    answered = true;
    elNext.disabled = false;
}

/* ── Клик «Дальше» ── */
elNext.addEventListener('click', () => {
    /* Считаем очко по финальному выбору */
    const selectedBtn = elOptions.querySelector('.quiz-option--selected');
    if (selectedBtn) {
        const selected = parseInt(selectedBtn.dataset.idx, 10);
        if (selected === QUESTIONS[currentIdx].correct) score++;
    }

    currentIdx++;

    if (currentIdx < QUESTIONS.length) {
        renderQuestion(currentIdx);
    } else {
        showResult();
    }
});

/* ── Экран результата ── */
function showResult() {
    elBlock.hidden  = true;
    elResult.hidden = false;

    elScore.textContent = `${score}/${QUESTIONS.length}`;

    let subtitle, text;
    if (score === QUESTIONS.length) {
        subtitle = 'Вы знаток!';
        text     = 'Это вы должны были писать этот тест — есть чему у вас поучиться.';
    } else if (score >= 7) {
        subtitle = 'Отличный результат!';
        text     = 'Вы хорошо знаете Ульяновск. Совсем немного до звания настоящего знатока!';
    } else if (score >= 4) {
        subtitle = 'Неплохо!';
        text     = 'Есть что открыть для себя в Ульяновске — изучите маршруты и историю города.';
    } else {
        subtitle = 'Есть куда расти!';
        text     = 'Самое время познакомиться с городом поближе — прогуляйтесь по маршрутам и загляните в раздел истории.';
    }
    elSubtitle.textContent = subtitle;
    elText.textContent     = text;
}

/* ── Старт ── */
renderQuestion(0);
