
/* ========================================
        DOM ELEMENTS
======================================== */

const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

const navLinks =
    document.querySelectorAll(".navbar a");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productItems =
    document.querySelectorAll(".product-item");

const currentYear =
    document.querySelector("#currentYear");

const header =
    document.querySelector(".header");


/* ========================================
        MOBILE MENU
======================================== */

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("show");

        menuBtn.classList.toggle("active");

    });


    /* Close menu after clicking a link */

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navbar.classList.remove("show");

            menuBtn.classList.remove("active");

        });

    });

}


/* ========================================
        PRODUCTS FILTER
======================================== */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        /* Remove active */

        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        /* Add active */

        button.classList.add("active");


        const filterValue =
            button.dataset.filter;


        /* Filter products */

        productItems.forEach((item) => {

            const category =
                item.dataset.category;


            if (
                filterValue === "all" ||
                category === filterValue
            ) {

                item.style.display = "block";


                requestAnimationFrame(() => {

                    item.style.opacity = "1";

                    item.style.transform =
                        "translateY(0)";

                });

            } else {

                item.style.opacity = "0";

                item.style.transform =
                    "translateY(15px)";


                setTimeout(() => {

                    item.style.display = "none";

                }, 250);

            }

        });

    });

});


/* ========================================
        CURRENT YEAR
======================================== */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* ========================================
        HEADER SCROLL
======================================== */

window.addEventListener("scroll", () => {

    if (!header) return;


    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* ========================================
        SCROLL REVEAL
======================================== */

const revealElements =
    document.querySelectorAll(
        ".service-card, " +
        ".why-card, " +
        ".product-item, " +
        ".step-item, " +
        ".about-content, " +
        ".about-visual, " +
        ".contact-info, " +
        ".contact-card"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* ========================================
        ACTIVE NAVIGATION
======================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener("scroll", () => {

    let currentSection = "";


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");


        const target =
            link.getAttribute("href");


        if (
            target === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});

/* ========================================
        PAGE LOADER
======================================== */

window.addEventListener("load", () => {

    const pageLoader =
        document.querySelector("#pageLoader");

    if (!pageLoader) return;


    setTimeout(() => {

        pageLoader.classList.add("loaded");

    }, 1000);

});

/* ========================================
        NANCY AI ASSISTANT
======================================== */

const aiFloat = document.querySelector("#aiFloat");
const aiChat = document.querySelector("#aiChat");
const aiClose = document.querySelector("#aiClose");
const aiInput = document.querySelector("#aiInput");
const aiSend = document.querySelector("#aiSend");
const aiMessages = document.querySelector("#aiMessages");
const aiQuickButtons =
    document.querySelectorAll(".ai-quick-actions button");


/* ========================================
        OPEN / CLOSE AI — FIXED PREMIUM POSITION
======================================== */

// NOTE: STEP 11 — The launcher is intentionally fixed in the bottom-right corner.
// Dragging was removed because it caused awkward movement and inconsistent panel placement.
function setAIChatOpen(shouldOpen) {
    if (!aiChat || !aiFloat) return;

    aiChat.classList.toggle("open", shouldOpen);
    aiFloat.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen && aiInput) {
        window.setTimeout(() => aiInput.focus({ preventScroll: true }), 120);
    }
}

// NOTE: Clicking the launcher toggles the chat: first click opens, second click closes.
if (aiFloat && aiChat) {
    aiFloat.addEventListener("click", () => {
        setAIChatOpen(!aiChat.classList.contains("open"));
    });
}

if (aiClose && aiChat) {
    aiClose.addEventListener("click", () => setAIChatOpen(false));
}

/* ========================================
        ADD MESSAGE
======================================== */

/* NOTE: AI MESSAGE RENDERING — STEP 2
   User messages are inserted with textContent, never interpreted as HTML.
   Bot HTML is limited to this locally authored knowledge base and fixed templates. */
function addAIMessage(message, type = "bot") {
    if (!aiMessages) return;

    const messageWrapper = document.createElement("div");
    messageWrapper.className = `ai-message ${type}`;

    if (type === "bot") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "✦";

        const content = document.createElement("div");
        content.className = "message-content";
        // NOTE: Only trusted, hard-coded assistant responses use this HTML path.
        content.innerHTML = String(message);

        messageWrapper.append(avatar, content);
    } else {
        const content = document.createElement("div");
        content.className = "message-content";
        // NOTE: Treat everything typed by a visitor as plain text to prevent HTML injection.
        content.textContent = String(message);
        messageWrapper.appendChild(content);
    }

    aiMessages.appendChild(messageWrapper);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

/* ========================================
        NANCY AI ASSISTANT
        SMART FRONTEND VERSION
======================================== */


/* ========================================
        NANCY AI
        CONTEXT + INTENT + SMART MATCHING
======================================== */


/* ========================================
        AI MEMORY
======================================== */

let aiContext = {
    intent: null,
    topic: null,
    lastQuestion: null
};


/* ========================================
        KNOWLEDGE BASE — WEBSITE-VERIFIED FACTS
======================================== */

/* NOTE: Keep assistant answers limited to facts explicitly shown in index.html.
   If the website does not confirm a detail (price, stock, deadline, paper type,
   custom request, or exact opening time), the assistant must not guess. */
const nancyKnowledge = [

    {
        id: "services",
        intent: "services",

        keywords: [
            "خدمات",
            "بتقدموا",
            "بتعملوا",
            "بتوفروا ايه",
            "عندكم ايه",
            "ايه اللي عندكم",
            "ايه الخدمات المتاحه",
            "الخدمات"
        ],

        answer: `
            أكيد 👋<br><br>

            في نانسي بنقدم لك:
            <br><br>

            🖨️ <strong>خدمات الطباعة والدعاية</strong><br>
            🎓 <strong>خدمات الطلاب والمذكرات</strong><br>
            ✏️ <strong>الأدوات المكتبية والمدرسية</strong><br>
            🏷️ <strong>الاستيكرات والفلايرات والبروشورات</strong><br>
            📚 <strong>التجليد والتكعيب والبشر</strong>
        `
    },


    {
        id: "products",
        intent: "products",

        keywords: [
            "منتجات",
            "المنتجات",
            "بتبيعوا",
            "موجود ايه",
            "ايه الموجود",
            "المتاح"
        ],

        answer: `
            📦 عندنا مجموعة متنوعة من المنتجات والخدمات، منها:
            <br><br>

            ✏️ أدوات مدرسية ومكتبية<br>
            📒 دفاتر وكراسات<br>
            🖨️ خدمات الطباعة<br>
            🏷️ استيكرات<br>
            🎨 فلايرات وبروشورات
        `
    },


    {
        id: "printing",
        intent: "printing",

        keywords: [
            "طباعة",
            "مطبوع",
            "مذكرات",
            "مذكرات الطباعة",
            "ملازم",
            "كتب",
            "اطبع ملف",
            "طباعة ملف",
            "ليزر",
            "اوفست",
            "انك جيت"
        ],

        answer: `
            🖨️ أيوه، عندنا خدمات طباعة متنوعة جدًا.
            <br><br>

            • طباعة المذكرات والملازم<br>
            • طباعة الكتب والمشروعات<br>
            • طباعة ليزر<br>
            • طباعة أوفست<br>
            • طباعة إنك جيت<br>
            • طباعة الدفاتر
        `
    },


    {
        id: "binding",
        intent: "binding",

        keywords: [
            "تجليد",
            "هارد كافر",
            "تكعيب",
            "بشر"
        ],

        answer: `
            📚 أيوه طبعًا.
            <br><br>

            بنوفر:
            <br>
            ✓ تجليد هارد كافر<br>
            ✓ تكعيب<br>
            ✓ بشر
            <br><br>

            ولو عندك نوع تجليد معين، ابعتلنا التفاصيل.
        `
    },


    {
        id: "stickers",
        intent: "stickers",

        keywords: [
            "استيكر",
            "ستيكر",
            "ملصقات"
        ],

        answer: `
            🏷️ أيوه، بنعمل استيكرات بأحجام واستخدامات مختلفة.
            <br><br>

            الموقع بيذكر إن الاستيكرات متاحة بأحجام واستخدامات مختلفة.
            <br><br>
            لمعرفة المقاسات المتاحة والسعر، تواصل مع المكتبة مباشرة.
        `
    },


    {
        id: "advertising",
        intent: "advertising",

        keywords: [
            "فلاير",
            "فلايرات",
            "بروشور",
            "بروشورات",
            "دعاية",
            "اعلان",
            "اعلانات"
        ],

        answer: `
            🎨 عندنا خدمات الدعاية والإعلان.
            <br><br>

            منها:
            <br>
            • فلايرات<br>
            • بروشورات<br>
            • استيكرات<br>
            • مطبوعات دعائية مختلفة
        `
    },


    {
        id: "stationery",
        intent: "stationery",

        keywords: [
            "ادوات",
            "مدرسية",
            "مكتبية",
            "اقلام",
            "الوان",
            "دفاتر",
            "كراسات"
        ],

        answer: `
            ✏️ عندنا تشكيلة متنوعة من الأدوات المكتبية والمدرسية.
            <br><br>

            أقلام وألوان، دفاتر وكراسات،
            منظمات ولوازم مكتبية ومدرسية.
        `
    },


    {
        id: "students",
        intent: "students",

        keywords: [
            "طلاب",
            "طالب",
            "مدرس",
            "جامعة",
            "جامعيه",
            "جامعية",
            "مذكرات مدرسين"
        ],

        answer: `
            🎓 بنوفر خدمات مناسبة للطلاب والمدرسين.
            <br><br>

            زي طباعة المذكرات والكتب الجامعية،
            التجليد، التكعيب، البشر والطباعة بأنواعها.
        `
    },


    /* NOTE: Removed the previous experience answer because the current page does not state a verifiable number of years. */

    {
        id: "workingHours",
        intent: "workingHours",

        keywords: [
            "مواعيد العمل",
            "مواعيد الفتح",
            "مواعيد القفل",
            "بتفتحوا امتى",
            "بتقفلوا امتى",
            "ساعات العمل"
        ],

        answer: `
            ◷ الموقع بيذكر إن العمل يوميًا حسب مواعيد العمل، لكنه لا يحدد ساعات فتح وإغلاق دقيقة.
            <br><br>
            عشان تتأكد من المواعيد الحالية، تواصل مع المكتبة على الرقم <strong>01004202450</strong>.
        `
    },

    {
        id: "prices",
        intent: "prices",

        keywords: [
            "سعر",
            "اسعار",
            "بكام",
            "سعرها",
            "سعره",
            "تكلفه",
            "تكلفة",
            "فلوس",
            "السعر",
            "السعر كام"
        ],

        answer: `
            💰 الأسعار التفصيلية مش موضحة في الموقع حاليًا.
            <br><br>
            عشان تاخد سعر دقيق، تواصل مع نانسي من رقم الهاتف أو زر واتساب الموجودين في الموقع.
        `
    },


    {
        id: "order",
        intent: "order",

        keywords: [
            "اعمل طلب",
            "ازاي اطلب",
            "ازاي اطبع",
            "عايز اطبع",
            "طريقة الطلب",
            "اطلب خدمة"
        ],

        answer: `
            📩 الموقع بيذكر إن التواصل وطلب الخدمات متاح عن طريق واتساب أو الهاتف.
            <br><br>
            الموقع بيوضح إنك تقدر تبعت الملفات أو الصور وتحدد الكمية والمقاسات المطلوبة.
            <br><br>
            تفاصيل التنفيذ والموعد النهائي لازم تتأكد منها مع المكتبة مباشرة.
        `
    },


    {
        id: "contact",
        intent: "contact",

        keywords: [
            "رقم",
            "تليفون",
            "هاتف",
            "موبايل",
            "اتصال",
            "اكلمكم",
            "التواصل"
        ],

        answer: `
            📞 تقدر تتواصل معانا على:
            <br><br>

            <strong>01004202450</strong>
            <br><br>

            أو تستخدم زر الواتساب الموجود في الموقع.
        `
    },


    {
        id: "whatsapp",
        intent: "whatsapp",

        keywords: [
            "واتساب",
            "واتس",
            "whatsapp"
        ],

        answer: `
            💬 تقدر تكلمنا مباشرة على واتساب.
            <br><br>

            استخدم زر الواتساب الموجود أسفل الموقع
            وهتقدر تبعتلنا طلبك مباشرة.
        `
    },


    {
        id: "location",
        intent: "location",

        keywords: [
            "عنوان",
            "مكان",
            "فين",
            "مكانكم",
            "موجودين فين",
            "دمياط"
        ],

        answer: `
            📍 مكتبة ومطبعة نانسي موجودة في:
            <br><br>

            <strong>دمياط - مصر</strong>
        `
    }

    

];


/* ========================================
        NORMALIZE
======================================== */

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[ًٌٍَُِّْـ]/g, "")
        .replace(/[؟?!.,،]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


/* ========================================
        STOP WORDS
======================================== */

const aiStopWords = [

    "ايه",
    "اي",
    "ازاي",
    "هل",
    "ممكن",
    "عايز",
    "عاوزه",
    "عندي",
    "عندكم",
    "لو",
    "انا",
    "انت",
    "هو",
    "هي",
    "في",
    "من",
    "على",
    "عن",
    "لي",
    "يا"

];

/* ========================================
        WORDS
======================================== */

function getWords(text) {

    return normalizeText(text)
        .split(" ")
        .filter(word =>
            word.length > 1 &&
            !aiStopWords.includes(word)
        );

}


/* ========================================
        SMART MATCHING
======================================== */

/* NOTE: STEP 4 — Matching remains keyword-based, not generative AI.
   Business answers must come from this local knowledge base; unknown details are not guessed. */

/* NOTE: STEP 6 — SMARTER KEYWORD MATCHING
   Match complete normalized phrases instead of arbitrary substrings, and count
   each keyword once. This reduces accidental matches from short words such as
   "هارد" inside unrelated words and prevents repeated keywords inflating scores.
   This is still a local rules-based assistant, not a generative AI model. */
function calculateMatch(message, item) {
    const normalizedMessage = ` ${normalizeText(message)} `;
    const messageWords = getWords(message);
    const seenKeywords = new Set();
    let score = 0;
    let specificity = 0;

    item.keywords.forEach((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        if (!normalizedKeyword || seenKeywords.has(normalizedKeyword)) return;
        seenKeywords.add(normalizedKeyword);

        const paddedKeyword = ` ${normalizedKeyword} `;
        const phraseMatched = normalizedMessage.includes(paddedKeyword);
        const keywordWords = getWords(normalizedKeyword);
        const matchedWords = keywordWords.filter(word => messageWords.includes(word));

        if (phraseMatched) {
            score += normalizedKeyword.length >= 5 ? 5 : 3;
            specificity = Math.max(specificity, normalizedKeyword.length + keywordWords.length * 2);
        } else if (matchedWords.length > 0) {
            score += matchedWords.length * 2;
            specificity = Math.max(specificity, matchedWords.join(" ").length + matchedWords.length * 2);
        }
    });

    return { score, specificity };
}

/* ========================================
        INTENT DETECTION
======================================== */

function detectIntent(message) {
    let bestIntent = null;
    let bestScore = 0;
    let bestSpecificity = 0;

    nancyKnowledge.forEach((item) => {
        const match = calculateMatch(message, item);
        if (
            match.score > bestScore ||
            (match.score === bestScore && match.specificity > bestSpecificity)
        ) {
            bestScore = match.score;
            bestSpecificity = match.specificity;
            bestIntent = item;
        }
    });

    return {
        intent: bestIntent,
        score: bestScore,
        specificity: bestSpecificity
    };
}

/* ========================================
        CONTEXT HELP
======================================== */

function applyContext(message) {

    const normalized =
        normalizeText(message);


    /*
        لو المستخدم قال:
        "طب بكام؟"
        بعد ما كان بيتكلم عن الطباعة
    */

    const contextWords = {

        price: [
            "بكام",
            "السعر",
            "السعر كام",
            "تكلفه"
        ],

        details: [
            "تفاصيل",
            "اكتر",
            "المزيد",
            "وضح",
            "اشرح"
        ],

        this: [
            "ده",
            "دي",
            "ده بكام",
            "دي بكام",
            "هو ده",
            "هي دي"
        ]

    };


    /* Price + previous topic */

    if (
        contextWords.price.some(word =>
            normalized.includes(
                normalizeText(word)
            )
        ) &&
        aiContext.topic
    ) {

        // NOTE: STEP 4 — Keep price follow-ups tied to the previous service.
        // The website does not publish detailed prices, so never calculate or invent one.
        const previousTopic = nancyKnowledge.find(
            item => item.id === aiContext.topic
        );

        if (previousTopic && previousTopic.id !== "prices") {
            return {
                id: "prices",
                intent: "prices",
                answer: `
                    💰 بتسأل عن سعر <strong>${getTopicName(previousTopic.id)}</strong>، صح؟<br><br>
                    السعر التفصيلي للخدمة دي مش منشور على الموقع، ومش هخمن رقم ممكن يكون غلط.<br><br>
                    تقدر تتأكد من السعر الحالي عن طريق رقم الهاتف <strong>01004202450</strong> أو زر واتساب الموجود في الموقع.
                `
            };
        }

        return nancyKnowledge.find(item => item.id === "prices");

    }


    /* Details + previous topic */

    if (
        contextWords.details.some(word =>
            normalized.includes(
                normalizeText(word)
            )
        ) &&
        aiContext.topic
    ) {

        return nancyKnowledge.find(
            item =>
                item.id === aiContext.topic
        );

    }


    return null;

}


/* ========================================
        NANCY AI PERSONALITY
======================================== */

const nancyConversation = {

    lastIntent: null,
    lastQuestion: null,
    lastAnswer: null

};


/* ========================================
        CASUAL CONVERSATION
======================================== */

const casualResponses = [

    {
        keywords: [
            "السلام عليكم",
            "السلام عليكم ورحمة الله",
            "سلام عليكم"
        ],

        answers: [
            "وعليكم السلام ورحمة الله وبركاته 👋",
            "وعليكم السلام 🤍 أهلاً بيك في نانسي!",
            "وعليكم السلام 👋 نورت نانسي."
        ]
    },


    {
        keywords: [
            "اهلا",
            "أهلا",
            "اهلا بيك",
            "هاي",
            "hello",
            "hi"
        ],

        answers: [
            "أهلاً بيك 👋 نورت نانسي!",
            "يا أهلاً وسهلاً 🤍 إزاي أقدر أساعدك؟",
            "أهلاً بيك 😎 قولّي محتاج إيه؟"
        ]
    },


    {
        keywords: [
            "عامل ايه",
            "عامل اي",
            "اخبارك",
            "أخبارك",
            "ازيك",
            "إزيك"
        ],

        answers: [
            "تمام الحمد لله 😎 ومستعد أساعدك. محتاج تعرف إيه؟",
            "كويس جدًا 🤖 خصوصًا إنك جيت تسألني 😄 قولّي محتاج إيه.",
            "الحمد لله تمام 👌 إيه اللي أقدر أساعدك فيه؟"
        ]
    },


    {
        keywords: [
            "شكرا",
            "شكراً",
            "متشكر",
            "تسلم",
            "ميرسي"
        ],

        answers: [
            "العفو 🤍 تحت أمرك في أي وقت.",
            "ولا يهمك 😎 أنا موجود عشان أساعدك.",
            "العفو يا باشا 👌 لو محتاج أي حاجة تانية قولّي."
        ]
    },


    {
        keywords: [
            "تمام",
            "ماشي",
            "حلو",
            "تمام كده",
            "اوكي",
            "okay",
            "ok"
        ],

        answers: [
            "تمام 👌 لو محتاج حاجة تانية أنا معاك.",
            "حلو جدًا 😎 قولّي نكمل في إيه؟",
            "تمام يا سيدي 🤝 تحب تعرف حاجة تانية؟"
        ]
    },


    {
        keywords: [
            "اه",
            "ايوه",
            "أيوه",
            "نعم"
        ],

        answers: [
            "تمام 👌 قولّي بس محتاج إيه بالظبط.",
            "تمام 😎 أنا معاك.",
            "حاضر 🤝 كمل كلامك وأنا أساعدك."
        ]
    }

];


/* ========================================
        GET CASUAL RESPONSE
======================================== */

function getCasualResponse(message) {

    const text =
        normalizeText(message);


    for (const item of casualResponses) {

        for (const keyword of item.keywords) {

            const normalizedKeyword =
                normalizeText(keyword);


            // NOTE: Avoid substring matches such as the short word "اه" inside unrelated questions.
            if (
                text === normalizedKeyword ||
                (normalizedKeyword.length >= 6 && text.startsWith(normalizedKeyword + " "))
            ) {

                const answers =
                    item.answers;

                return answers[
                    Math.floor(
                        Math.random() * answers.length
                    )
                ];

            }

        }

    }


    return null;

}

/* ========================================
        STEP 7 — VERIFIED AVAILABILITY GUARD
======================================== */

/* NOTE: STEP 7 — If a visitor asks whether a specific item/service is available,
   only confirm items explicitly represented in the website content. A generic
   keyword such as "طباعة" must not confirm an unlisted custom material/service. */
function getUnverifiedAvailabilityAnswer(message) {
    const normalized = normalizeText(message);

    const availabilitySignals = [
        "عندكم", "متوفر", "متوفره", "موجود", "بتبيعوا", "بتعملوا",
        "بتوفروا", "هل يوجد", "هل عندكم", "هل بتعملوا", "هل بتوفروا"
    ];
    const asksAvailability = availabilitySignals.some(signal =>
        (` ${normalized} `).includes(` ${normalizeText(signal)} `)
    );

    if (!asksAvailability) return null;

    // NOTE: Broad questions about the overall catalogue should use the normal services/products answer.
    const generalQuestions = [
        "عندكم ايه", "ايه عندكم", "ايه الخدمات", "الخدمات المتاحه",
        "بتقدموا ايه", "بتوفروا ايه", "ايه المنتجات", "موجود ايه"
    ];
    if (generalQuestions.some(phrase => normalized.includes(normalizeText(phrase)))) return null;

    // NOTE: These are specific offers visibly named in the current website content.
    const verifiedOffers = [
        "طباعة المذكرات", "طباعة مذكره", "طباعة الكتب", "طباعة كتاب",
        "الملازم", "ملازم", "طباعة الدفاتر", "طباعة ليزر", "طباعة اوفست",
        "طباعة انك جيت", "هارد كافر", "تجليد", "تكعيب", "بشر",
        "استيكر", "ستيكر", "فلاير", "بروشور", "ادوات مدرسيه",
        "ادوات مكتبيه", "دفاتر", "كراسات", "دعايه", "اعلان"
    ];

    const hasVerifiedOffer = verifiedOffers.some(offer =>
        (` ${normalized} `).includes(` ${normalizeText(offer)} `)
    );

    // NOTE: A custom material/format is not confirmed just because printing is offered.
    const customRequestSignals = [
        "طباعة على", "اطبع على", "طبع على", "حسب الطلب", "مقاس خاص",
        "تيشيرت", "تي شيرت", "مج", "كوب", "خشب", "معدن", "قماش",
        "توصيل", "شحن", "دليفري"
    ];
    const asksUnlistedCustom = customRequestSignals.some(signal => {
        const normalizedSignal = normalizeText(signal);
        // NOTE: Short signals such as "مج" must match whole words, not pieces of unrelated words.
        if (normalizedSignal.length <= 3) {
            return (` ${normalized} `).includes(` ${normalizedSignal} `);
        }
        return normalized.includes(normalizedSignal);
    });

    if (hasVerifiedOffer && !asksUnlistedCustom) return null;

    return `
        🤔 الموقع مش بيأكد إن الخدمة أو المنتج المحدد ده متاح، ومش هأكد لك حاجة من غير معلومة واضحة.<br><br>
        تقدر تتواصل مع نانسي على <strong>01004202450</strong> أو من خلال زر واتساب الموجود في الموقع للتأكد مباشرة.
    `;
}

/* ========================================
        FINAL AI ANSWER
======================================== */

function getAIAnswer(userMessage) {

    const message =
        normalizeText(userMessage);


    /* ====================================
            CASUAL CONVERSATION
    ==================================== */

    const casualAnswer =
        getCasualResponse(userMessage);


    if (casualAnswer) {

        nancyConversation.lastQuestion =
            userMessage;

        nancyConversation.lastAnswer =
            casualAnswer;

        return casualAnswer;

    }

    // NOTE: STEP 7 — Check specific availability before broad keyword matching to avoid false confirmations.
    const unverifiedAvailabilityAnswer = getUnverifiedAvailabilityAnswer(userMessage);
    if (unverifiedAvailabilityAnswer) {
        // NOTE: STEP 8 — Do not let a previous topic leak into follow-up questions
        // after the visitor asks about an unverified product or custom service.
        aiContext.intent = null;
        aiContext.topic = null;
        aiContext.lastQuestion = userMessage;
        return unverifiedAvailabilityAnswer;
    }

    let bestMatch = null;
    let bestScore = 0;


    /* Save question */

    aiContext.lastQuestion =
        userMessage;


    /*
        1. Try Context
    */

    const contextAnswer =
        applyContext(message);


    if (contextAnswer) {

        aiContext.intent =
            contextAnswer.intent;

        aiContext.topic =
            contextAnswer.id;

        return contextAnswer.answer;

    }


    /*
        2. Detect Intent
    */

    const result =
        detectIntent(message);


    /*
        3. Strong match
    */

    // NOTE: STEP 6 — Require a clear match; phrase specificity breaks equal-score ties.
    if (
        result.intent &&
        result.score >= 4
    ) {

        aiContext.intent =
            result.intent.intent;

        aiContext.topic =
            result.intent.id;


        return result.intent.answer;

    }


    /*
        4. Weak match + previous context
    */

    if (aiContext.topic) {

        const previousTopic =
            nancyKnowledge.find(
                item =>
                    item.id === aiContext.topic
            );


        if (previousTopic) {

            return `
                🤔 محتاج توضيح بسيط عشان ما أديكش معلومة غير دقيقة.
                <br><br>
                آخر موضوع كنا بنتكلم عنه هو <strong>${getTopicName(aiContext.topic)}</strong>.
                اكتب سؤالك بشكل أوضح، وهجاوبك بالمعلومات الموجودة في الموقع فقط.
            `;

        }

    }


    /*
        5. Nothing matched
    */

    return `
        🤔 مش لاقي إجابة مؤكدة لسؤالك في المعلومات الموجودة على الموقع، ومش هخمن.
        <br><br>
        تقدر تسألني عن الخدمات المعروضة، الطباعة، التجليد، الاستيكرات، الأدوات المكتبية، الأسعار، رقم التواصل أو الموقع.
        <br><br>
        لو محتاج معلومة مش مكتوبة هنا، تواصل مع نانسي مباشرة من بيانات الاتصال الموجودة بالموقع.
    `;

}


/* ========================================
        TOPIC NAME
======================================== */

function getTopicName(topic) {

    const names = {

        services: "الخدمات",

        products: "المنتجات",

        printing: "الطباعة",

        binding: "التجليد",

        stickers: "الاستيكرات",

        advertising: "الدعاية والإعلان",

        stationery: "الأدوات المكتبية والمدرسية",

        students: "الخدمات الطلابية",

        prices: "الأسعار",

        workingHours: "مواعيد العمل",

        order: "طريقة الطلب",

        contact: "التواصل",

        whatsapp: "الواتساب",

        location: "العنوان"

    };


    return names[topic] || "الخدمة";

}

/* NOTE: The shared normalizeText() function above is reused here; no duplicate definition. */

/* ========================================
        TYPING INDICATOR
======================================== */

function showAITyping() {

    if (!aiMessages) return;


    const typing =
        document.createElement("div");

    typing.className =
        "ai-message bot ai-typing";

    typing.id =
        "aiTyping";


    typing.innerHTML = `

        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <span></span>
            <span></span>
            <span></span>

        </div>

    `;


    aiMessages.appendChild(typing);

    aiMessages.scrollTop =
        aiMessages.scrollHeight;

}


/* ========================================
        REMOVE TYPING
======================================== */

function removeAITyping() {

    const typing =
        document.querySelector("#aiTyping");

    if (typing) {

        typing.remove();

    }

}


/* ========================================
        SEND AI MESSAGE
======================================== */

// NOTE: Request lock prevents double submissions from Enter, the send button, and quick topics.
let isAISending = false;

function setAISendingState(isSending) {
    isAISending = isSending;
    if (aiSend) {
        aiSend.disabled = isSending;
        aiSend.setAttribute("aria-busy", String(isSending));
    }
    if (aiInput) aiInput.disabled = isSending;
    aiQuickButtons.forEach((button) => { button.disabled = isSending; });
    if (aiChat) aiChat.classList.toggle("is-sending", isSending);
}

function submitAIQuestion(question, clearInput = true) {
    if (isAISending || !question) return;
    if (question.length > 600) {
        addAIMessage("الرسالة طويلة جدًا. اختصر سؤالك في 600 حرف أو أقل عشان أقدر أساعدك بدقة.", "bot");
        return;
    }

    setAISendingState(true);
    addAIMessage(question, "user");
    if (clearInput && aiInput) aiInput.value = "";
    showAITyping();

    const thinkingTime = 500 + Math.random() * 700;
    window.setTimeout(() => {
        removeAITyping();
        let answer;
        try {
            answer = getAIAnswer(question);
        } catch (error) {
            answer = "حصلت مشكلة بسيطة وأنا بجهز الرد. جرّب تاني أو تواصل معانا مباشرة.";
        }
        addAIMessage(answer, "bot");
        setAISendingState(false);
        if (aiInput && aiChat?.classList.contains("open")) aiInput.focus({ preventScroll: true });
    }, thinkingTime);
}

function sendAIMessage() {
    if (!aiInput || isAISending) return;
    submitAIQuestion(aiInput.value.trim(), true);
}

/* ========================================
        SEND BUTTON
======================================== */

if (aiSend) {

    aiSend.addEventListener(
        "click",
        sendAIMessage
    );

}


/* ========================================
        ENTER KEY
======================================== */

if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendAIMessage();

            }

        }
    );

}


/* ========================================
        QUICK QUESTIONS
======================================== */

aiQuickButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.dataset.question;
        if (!question || isAISending) return;
        submitAIQuestion(question, false);
    });
});

