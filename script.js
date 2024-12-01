


// Labels and coordinates
const labels = [
    { name: "Coupler, Type F", coords: [154, 490, 247, 532] },
    { name: "Ditch Light", coords: [149, 443, 259, 486] },
    { name: "Electric Hand Brake", coords: [404, 297, 457, 453] },
    { name: "Front Headlight", coords: [324, 243, 366, 313] },
    { name: "Sand Fill", coords: [369, 213, 408, 243] },
    { name: "Number Board", coords: [440, 101, 498, 153] },
    { name: "Radio Antenna", coords: [504, 44, 578, 114] },
    { name: "Cab", coords: [537, 116, 751, 164] },
    { name: "Dust Bin Blower Assembly", coords: [840, 121, 1038, 204] },
    { name: "Traction / Companion Alternator", coords: [1079, 221, 1148, 346] },
    { name: "CAT 3516C Diesel Engine", coords: [1200, 177, 1533, 373] },
    { name: "Exhaust Assembly", coords: [1296, 50, 1382, 171] },
    { name: "3 Chime Air Horn", coords: [1393, 52, 1484, 147] },
    { name: "Auxiliary Generator", coords: [1545, 306, 1638, 377] },
    { name: "AC Cabinet", coords: [1700, 266, 1800, 335] },
    { name: "Cooling Fan Assembly", coords: [1620, 89, 2088, 137] },
    { name: "Radiator Bank Assembly", coords: [1619, 150, 2081, 243] },
    { name: "Rear Headlight", coords: [2145, 161, 2189, 213] },
    { name: "Number Board, Rear", coords: [2120, 214, 2179, 249] },
    { name: "Sand Fill (Rear)", coords: [2128, 108, 2170, 145] },
    { name: "Air Compressor Assembly", coords: [1816, 285, 1910, 440] },
    { name: "Sand Nozzle", coords: [2023, 574, 2098, 632] },
    { name: "Truck, R-End", coords: [1630, 492, 2016, 602] },
    { name: "Battery Compartment", coords: [1440, 502, 1562, 587] },
    { name: "Fuel Tank and Retention Tank", coords: [920, 495, 1415, 594] },
    { name: "HVAC Unit", coords: [765, 251, 951, 360] },
];




let currentIndex = 0;
const missedLabels = []; // Track missed labels
let correctCount = 0;
let incorrectCount = 0;

// Shuffle the labels array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle labels before starting the quiz
shuffle(labels);

// Set the initial question
function setQuestion() {
    if (currentIndex < labels.length) {
        document.getElementById("question").textContent = `Click on: ${labels[currentIndex].name}`;
    } else {
        endQuiz();
    }
}

// Add a highlight for correct or incorrect answers
function addHighlight(coords, container, color, label = null) {
    const diagram = document.getElementById("diagram");
    const scaleX = diagram.clientWidth / diagram.naturalWidth;
    const scaleY = diagram.clientHeight / diagram.naturalHeight;

    const x1 = coords[0] * scaleX;
    const y1 = coords[1] * scaleY;
    const x2 = coords[2] * scaleX;
    const y2 = coords[3] * scaleY;

    const highlight = document.createElement("div");
    highlight.classList.add("highlight");
    highlight.style.left = `${x1}px`;
    highlight.style.top = `${y1}px`;
    highlight.style.width = `${x2 - x1}px`;
    highlight.style.height = `${y2 - y1}px`;
    highlight.style.borderColor = color;
    highlight.style.backgroundColor = color === "green" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";

    if (label) {
        highlight.addEventListener("mouseover", () => {
            label.style.display = "block";
            label.style.left = `${x2 + 5}px`; // Position label to the right of the highlight
            label.style.top = `${y1}px`; // Align vertically
        });
        highlight.addEventListener("mouseout", () => {
            label.style.display = "none";
        });
    }

    container.appendChild(highlight);
    return highlight; // Return the highlight for additional controls
}

// End the quiz and display the summary
function endQuiz() {
    const questionElement = document.getElementById("question");
    const feedbackElement = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");

    const score = ((correctCount / labels.length) * 100).toFixed(2); // Calculate score percentage

    questionElement.textContent = "Quiz Completed!";
    feedbackElement.innerHTML = `
        <p>Score: ${score}%</p>
        <p>Correct: ${correctCount}</p>
        <p>Incorrect: ${incorrectCount}</p>
        <p>Missed Labels:</p>
        <ul>
            ${missedLabels
                .map(
                    (label) =>
                        `<li class="missed-label" data-label="${label.name}">${label.name}</li>`
                )
                .join("")}
        </ul>
    `;

    // Highlight missed areas in red when hovered and show labels
    const missedLabelElements = document.querySelectorAll(".missed-label");
    missedLabelElements.forEach((element) => {
        const label = labels.find((l) => l.name === element.dataset.label);
        let tempHighlight = null; // Track the temporary highlight
        let tempLabel = null; // Track the temporary label
        element.addEventListener("mouseover", () => {
            tempHighlight = addHighlight(label.coords, diagramContainer, "red");
            tempLabel = document.createElement("div");
            tempLabel.classList.add("label");
            tempLabel.textContent = label.name;
            tempLabel.style.left = `${tempHighlight.style.left}`;
            tempLabel.style.top = `${parseInt(tempHighlight.style.top) + 20}px`; // Below the highlight
            diagramContainer.appendChild(tempLabel);
        });
        element.addEventListener("mouseout", () => {
            if (tempHighlight) tempHighlight.remove(); // Remove the highlight
            if (tempLabel) tempLabel.remove(); // Remove the label
        });
    });
}

// Start the quiz
setQuestion();

function checkAnswer(isCorrect) {
    const feedback = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");
    const currentLabel = labels[currentIndex];

    if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        correctCount++;

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = currentLabel.name;
        label.style.display = "none";

        addHighlight(currentLabel.coords, diagramContainer, "green", label);
        diagramContainer.appendChild(label);
    } else {
        feedback.textContent = "Incorrect! Moving to the next label.";
        feedback.style.color = "red";
        incorrectCount++;
        missedLabels.push(currentLabel);
    }

    currentIndex++;
    setQuestion();
}

const diagram = document.getElementById("diagram");
diagram.addEventListener("click", (event) => {
    const scaleX = diagram.naturalWidth / diagram.clientWidth;
    const scaleY = diagram.naturalHeight / diagram.clientHeight;

    const x = Math.round(event.offsetX * scaleX);
    const y = Math.round(event.offsetY * scaleY);

    const coords = labels[currentIndex].coords;

    // Check if the click is within the bounds
    const isCorrect =
        x >= coords[0] && x <= coords[2] && y >= coords[1] && y <= coords[3];

    checkAnswer(isCorrect);
});
