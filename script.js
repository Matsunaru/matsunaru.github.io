// Object containing HTML content for different menu sections
const contents = {
  about: `
    <h2>👨‍💻 About Me</h2>
    <p>Cześć! Mam na imię Patryk i jestem początkującym programistą C++ i frontendu.</p>
    <p>Lubię robić minimalistyczne projekty z fajnymi efektami i interakcjami.</p>
  `,
  projects: `
    <h2>💼 Projects</h2>
    <ul>
      <li>Menedżer haseł (JS + Chrome Extension)</li>
      <li>Symulator Kolejki (C++)</li>
      <li>Prosty RPG konsolowy</li>
    </ul>
  `,
  links: `
    <h2>🔗 Links</h2>
    <p><a href="https://github.com/twojlogin" target="_blank">GitHub</a></p>
    <p><a href="https://linkedin.com/in/twojlogin" target="_blank">LinkedIn</a></p>
  `,
  contact: `
    <h2>📬 Contact</h2>
    <p>Email: <a href="mailto:twojemail@example.com">twojemail@example.com</a></p>
  `
};

// Add click event listeners to all menu items
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const type = item.dataset.content; // Get the type of content to display
    const existingNote = document.querySelector(`.note[data-type="${type}"]`);
    if (existingNote) return; // If note already exists, do nothing

    // Create a new note element
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.type = type;
    note.innerHTML = `
      <span class="Close">X</span>
      <p>${contents[type]}</p>
    `;

    // Add functionality to close the note
    note.querySelector('.Close').addEventListener('click', () => {
      note.remove();
    });

    // Add drag-and-drop functionality
    let isDragging = false, offsetX, offsetY;
    note.addEventListener('mousedown', (e) => {
      // Stop floating if the user grabs the note
      if (note.dataset.floating === "true") {
        note.dataset.floating = "false";
      }

      isDragging = true;
      offsetX = e.clientX - note.offsetLeft; // Mouse offset X
      offsetY = e.clientY - note.offsetTop;  // Mouse offset Y
    });

    // Move the note with the mouse
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        note.style.left = (e.clientX - offsetX) + 'px';
        note.style.top = (e.clientY - offsetY) + 'px';
      }
    });

    // On mouse release, stop dragging and check for collision with the "water" element
    document.addEventListener('mouseup', () => {
      isDragging = false;

      const noteRect = note.getBoundingClientRect();
      const water = document.querySelector('.water');
      const waterRect = water.getBoundingClientRect();

      // Check if note is over the "water" area
      const isOverWater = (
        noteRect.bottom > waterRect.top &&
        noteRect.top < waterRect.bottom &&
        noteRect.right > waterRect.left &&
        noteRect.left < waterRect.right
      );

      // If it is, start floating animation
      if (isOverWater) {
        note.classList.add('floating');
        startFloating(note);
      }
    });

    // Add the note to the main content area
    document.getElementById('mainContent').appendChild(note);
  });
});

// Function to animate the floating note
function startFloating(note) {
  let x = note.offsetLeft;
  let y = note.offsetTop;
  let dx = 0.5 + Math.random();           // Horizontal speed
  let dy = (Math.random() - 0.5) * 0.05;  // Small vertical wobble
  note.dataset.floating = "true";

  // Recursive animation loop using requestAnimationFrame
  function animate() {
    // Stop animation if note was removed or stopped floating
    if (!document.body.contains(note) || note.dataset.floating !== "true") return;

    x += dx;
    y += dy;

    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    // Remove note if it floats off the screen
    if (x > window.innerWidth || y > window.innerHeight + 100) {
      note.remove();
      return;
    }

    // Continue animation
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
