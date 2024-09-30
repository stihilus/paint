const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50; // Adjust for tools height

let drawing = false;
let currentTool = 'line';
let currentColor = '#282727'; // Default color for drawing
let currentLineWidth = 3; // Default stroke for line tool
ctx.lineWidth = currentLineWidth; // Set initial line width
document.getElementById('line-tool').src = 'assets/brush-1.svg'; // Set default icon for line tool

// Set default selection for line tool
updateToolSelection('line-tool');

// Event listeners for tools
document.getElementById('line-tool').addEventListener('click', () => {
    // Cycle through line widths and update icon
    if (currentLineWidth === 3) {
        currentLineWidth = 10;
        document.getElementById('line-tool').src = 'assets/brush-2.svg'; // Change to 10px icon
    } else if (currentLineWidth === 10) {
        currentLineWidth = 16;
        document.getElementById('line-tool').src = 'assets/brush-3.svg'; // Change to 16px icon
    } else {
        currentLineWidth = 3;
        document.getElementById('line-tool').src = 'assets/brush-1.svg'; // Change to 3px icon
    }
    ctx.lineWidth = currentLineWidth; // Set stroke for line tool
    currentTool = 'line'; // Ensure current tool is set to line
    updateToolSelection('line-tool'); // Update selected tool
});

document.getElementById('erase-tool').addEventListener('click', () => {
    currentTool = 'erase'; // Set current tool to erase
    ctx.lineWidth = 16; // Set size for eraser
    updateToolSelection('erase-tool'); // Update selected tool
});

document.getElementById('color-picker').addEventListener('click', () => {
    // Switch between colors
    currentColor = (currentColor === '#282727') ? '#F1491D' : '#282727';
    ctx.strokeStyle = currentColor; // Update stroke color

    // Change color icon based on current color
    const colorIcon = document.getElementById('color-picker');
    colorIcon.src = (currentColor === '#F1491D') ? 'assets/colorOrange.svg' : 'assets/color.svg';

    // Automatically select line tool after changing color
    currentTool = 'line';
    ctx.lineWidth = 3; // Set stroke for line tool
    updateToolSelection('line-tool'); // Update selected tool
});

// Reset functionality
document.getElementById('reset').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
});

// Function to update selected tool appearance
function updateToolSelection(selectedToolId) {
    const tools = document.querySelectorAll('#tools img');
    tools.forEach(tool => {
        tool.classList.remove('selected'); // Remove selection from all tools
    });
    document.getElementById(selectedToolId).classList.add('selected'); // Add selection to the clicked tool
}

// Drawing logic
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();

    // Get canvas position
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top); // Adjust for canvas position
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        if (currentTool === 'line') {
            ctx.strokeStyle = currentColor; // Use current color for drawing
            
            // Get canvas position
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); // Adjust for canvas position
            
            // Add a slight variation in line width based on speed
            const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
            ctx.lineWidth = Math.max(1, currentLineWidth - speed / 10); // Thinner line for faster movement
            
            ctx.stroke(); // Render the line
            ctx.lineWidth = currentLineWidth; // Reset line width to original
        } else if (currentTool === 'erase') {
            // Get canvas position for eraser
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(e.clientX - rect.left - 8, e.clientY - rect.top - 8, 16, 16); // Eraser effect (circle)
            ctx.beginPath(); // Start a new path for the circle
            ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 8, 0, Math.PI * 2); // Draw a circle
            ctx.fillStyle = '#EDEAE6'; // Match background color for erasing
            ctx.fill(); // Fill the circle
        }
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false; // Reset drawing state
    ctx.closePath(); // Close the current path
});

// Update download functionality to include background color
document.getElementById('download').addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fill background color
    tempCtx.fillStyle = '#EDEAE6'; // Match app background
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0); // Draw the canvas content

    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = tempCanvas.toDataURL();
    link.click();
});
