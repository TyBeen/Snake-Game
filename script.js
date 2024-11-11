let welcomeMsg = document.querySelector('.welcomeMsg');
let welcomeBtn = document.querySelector('.start');
let scoreDot = document.getElementById('scoreDot');
let borderElement = document.querySelector('.border');

const snakeBallDistance = 30; // Distance between snake segments
const segmentStep = 10; // Distance each segment moves per key press

let scoreNumber = 10;

// Initialize the snake with one segment
let snakeArray = [{ top: 0, left: 0 }];
let positionHistory = []; // Tracks positions for each movement step of the head

let startLocation = snakeArray[0]; // Reference to the starting position of the snake
let currentDirection = ''; // Tracks the direction of the snake's movement (added for smoother movement)

welcomeBtn.addEventListener('click', function () {
    welcomeMsg.classList.add('hideButton'); // Hide the welcome message
    createNewSnakeDot(startLocation);  // Create the first snake dot
    positionScoreDot(); // Initial positioning of the scoreDot
    requestAnimationFrame(gameLoop); // Start the game loop (added)
});

let newSpanCounter = 1; // Start from 1 since the first snake dot is created

// Function to position the scoreDot randomly within the border
function positionScoreDot() {
    let rdmStartTopLocation = Math.floor(Math.random() * (borderElement.clientHeight - 50));
    let rdmStartLeftLocation = Math.floor(Math.random() * (borderElement.clientWidth - 50));

    scoreDot.style.left = rdmStartLeftLocation + "px";
    scoreDot.style.top = rdmStartTopLocation + "px";
}

function gameLoop() {
    snakeMove();  // Moves the snake in the current direction
    requestAnimationFrame(gameLoop);  // Calls `gameLoop` again for the next frame (added)
}

// Function to handle snake movement
function snakeMove() {
    let snakeDot = document.getElementById('snakeDot1');
    if (!snakeDot) return;

    const borderRect = borderElement.getBoundingClientRect();
    const snakeRect = snakeDot.getBoundingClientRect();

    // Calculate potential new position based on currentDirection
    let potentialLeft = startLocation.left;
    let potentialTop = startLocation.top;

    switch (currentDirection) {
        case "left":
            if (startLocation.left > 0) potentialLeft -= segmentStep;
            break;
        case "right":
            if (startLocation.left + snakeRect.width < borderRect.width) potentialLeft += segmentStep;
            break;
        case "down":
            if (startLocation.top + snakeRect.height < borderRect.height) potentialTop += segmentStep;
            break;
        case "up":
            if (startLocation.top > 0) potentialTop -= segmentStep;
            break;
    }

    startLocation.left = potentialLeft;
    startLocation.top = potentialTop;

    // Add the new position of the head to positionHistory
    positionHistory.unshift({ top: startLocation.top, left: startLocation.left });

    // Update the position of the head segment
    snakeDot.style.left = startLocation.left + 'px';
    snakeDot.style.top = startLocation.top + 'px';

    // Check collision with the score dot
    const snakeDotRect = snakeDot.getBoundingClientRect();
    const scoreDotRect = scoreDot.getBoundingClientRect();

    if (
        snakeDotRect.right > scoreDotRect.left &&
        snakeDotRect.left < scoreDotRect.right &&
        snakeDotRect.bottom > scoreDotRect.top &&
        snakeDotRect.top < scoreDotRect.bottom
    ) {
        positionScoreDot(); // Reposition scoreDot
        addPoints();
        addNewSnakeDot();   // Add a new snake segment
    }

    // Update positions of other snake segments based on positionHistory
    for (let i = 1; i < snakeArray.length; i++) {
        const positionIndex = i * (snakeBallDistance / segmentStep);

        if (positionHistory[positionIndex]) {
            snakeArray[i].top = positionHistory[positionIndex].top;
            snakeArray[i].left = positionHistory[positionIndex].left;

            const snakeSection = document.getElementById("snakeDot" + (i + 1));
            if (snakeSection) {
                snakeSection.style.top = snakeArray[i].top + "px";
                snakeSection.style.left = snakeArray[i].left + "px";
            }
        }
    }

    // Limit positionHistory to the length of snakeArray
    while (positionHistory.length > snakeArray.length * (snakeBallDistance / segmentStep)) {
        positionHistory.pop();
    }
}

// Listen for keydown events to set the currentDirection
window.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (currentDirection !== "right") currentDirection = "left"; // Prevent reverse direction (added)
            break;
        case "ArrowRight":
            if (currentDirection !== "left") currentDirection = "right"; // Prevent reverse direction (added)
            break;
        case "ArrowDown":
            if (currentDirection !== "up") currentDirection = "down"; // Prevent reverse direction (added)
            break;
        case "ArrowUp":
            if (currentDirection !== "down") currentDirection = "up"; // Prevent reverse direction (added)
            break;
    }
});

// Function to add a new segment to the snake
function addNewSnakeDot() {
    let lastSegment = snakeArray[snakeArray.length - 1];
    let newSegment = {
        top: lastSegment.top,
        left: lastSegment.left
    };

    snakeArray.push(newSegment);
    createNewSnakeDot(newSegment);
}

// Function to create a new DOM element for the snake segment
function createNewSnakeDot(position) {
    const newSpan = document.createElement("span");
    newSpan.className = "snakeDot";
    newSpan.id = "snakeDot" + newSpanCounter;

    newSpan.style.top = position.top + 'px';
    newSpan.style.left = position.left + 'px';

    newSpanCounter++;
    borderElement.append(newSpan);
}

function addPoints() {
    const divScore = document.getElementById("scoreNumber");
    divScore.textContent = scoreNumber;
    scoreNumber = scoreNumber + 10;
}
