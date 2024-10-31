let welcomeMsg = document.querySelector('.welcomeMsg');
let welcomeBtn = document.querySelector('.start');
let scoreDot = document.getElementById('scoreDot');
let borderElement = document.querySelector('.border');

const snakeBallDistance = 50; // Distance between snake segments

// Initialize the snake with one segment
let snakeArray = [{ top: 0, left: 0 }];

let startLocation = snakeArray[0]; // Reference to the starting position of the snake

welcomeBtn.addEventListener('click', function () {
    welcomeMsg.classList.add('hideButton'); // Hide the welcome message
    createNewSnakeDot(startLocation);  // Create the first snake dot
});

let newSpanCounter = 1; // Start from 1 since the first snake dot is created

// Function to position the scoreDot randomly within the border
function positionScoreDot() {
    let rdmStartTopLocation = Math.floor(Math.random() * (borderElement.clientHeight - 50)); // Account for the dot's height
    let rdmStartLeftLocation = Math.floor(Math.random() * (borderElement.clientWidth - 50)); // Account for the dot's width

    scoreDot.style.left = rdmStartLeftLocation + "px";
    scoreDot.style.top = rdmStartTopLocation + "px";
}

positionScoreDot(); // Initial positioning of the scoreDot

// Function to handle snake movement based on key presses
function snakeMove(event) {
    let snakeDot = document.getElementById('snakeDot1'); // Reference to the head segment

    if (!snakeDot) return;  // Exit if snakeDot is not created yet

    const borderRect = borderElement.getBoundingClientRect();
    const snakeRect = snakeDot.getBoundingClientRect();

    // Move the snake based on the arrow key pressed
    switch (event.key) {
        case "ArrowLeft":
            if (startLocation.left > 0) {
                startLocation.left -= 10; // Move left
            }
            break;
        case "ArrowRight":
            if (startLocation.left + snakeRect.width < borderRect.width) {
                startLocation.left += 10; // Move right
            }
            break;
        case "ArrowDown":
            if (startLocation.top + snakeRect.height < borderRect.height) {
                startLocation.top += 10; // Move down
            }
            break;
        case "ArrowUp":
            if (startLocation.top > 0) {
                startLocation.top -= 10; // Move up
            }
            break;
    }

    // Update the position of the first segment (snake head)
    snakeDot.style.left = startLocation.left + 'px';
    snakeDot.style.top = startLocation.top + 'px';

    // Update the snakeArray with the new position of the first segment
    snakeArray[0].top = startLocation.top;
    snakeArray[0].left = startLocation.left;

    // Check collision with the score dot
    const snakeDotRect = snakeDot.getBoundingClientRect();
    const scoreDotRect = scoreDot.getBoundingClientRect();

    if (
        snakeDotRect.right > scoreDotRect.left &&
        snakeDotRect.left < scoreDotRect.right &&
        snakeDotRect.bottom > scoreDotRect.top &&
        snakeDotRect.top < scoreDotRect.bottom
    ) {
        // Randomly reposition scoreDot
        positionScoreDot();

        // Create and add a new snake segment
        addNewSnakeDot();  // Call to add a new segment
    }

    // Update positions of other snake segments
    for (let i = snakeArray.length - 1; i > 0; i--) {
        // Move each segment to the position of the one before it
        snakeArray[i].top = snakeArray[i - 1].top;
        snakeArray[i].left = snakeArray[i - 1].left;

        const snakeSection = document.getElementById("snakeDot" + i);
        if (snakeSection) {
            snakeSection.style.top = snakeArray[i].top + "px";
            snakeSection.style.left = snakeArray[i].left + "px";
        }
    }
}

// Function to add a new segment to the snake
function addNewSnakeDot() {
    // Get the last segment's position
    let lastSegment = snakeArray[snakeArray.length - 1];

    // Create the new segment with proper positioning
    let newSegment = {
        top: lastSegment.top,  // Same vertical position as the last segment
        left: lastSegment.left - snakeBallDistance // Position behind the last segment
    };

    // Add this new segment to the snakeArray
    snakeArray.push(newSegment);

    // Create the new span element for the new segment
    createNewSnakeDot(newSegment);
}

// Function to create a new DOM element for the snake segment
function createNewSnakeDot(position) {
    const newSpan = document.createElement("span");
    newSpan.className = "snakeDot";
    newSpan.id = "snakeDot" + newSpanCounter;

    // Set the position for the new segment
    newSpan.style.top = position.top + 'px';
    newSpan.style.left = position.left + 'px';

    newSpanCounter++;
    borderElement.append(newSpan);
}

// Listen for keydown events to move the snake
window.addEventListener("keydown", snakeMove);
