// Object containing HTML content for different menu sections
const contents = {
  about: `
    <h2>👨‍💻 About Me</h2>
    <p>Hi! I'm Patryk — an aspiring software developer with a strong focus on C++ and front-end technologies. I'm passionate about clean, minimalist design and enjoy crafting intuitive user experiences with subtle, engaging effects.</p>
    <p>Although I'm at the beginning of my programming journey, I've already built several small applications and websites, constantly pushing myself to learn and improve. I thrive on solving problems, experimenting with modern UI/UX ideas, and turning creative concepts into working code.</p>
    <p>I’m currently studying Computer Science and actively expanding my skills in both programming and design. I value code quality, clear structure, and lifelong learning. My goal? To become a developer who builds not just functioning apps — but experiences users love to interact with.</p>
    <p>Let's build something amazing together!</p>
  `,
  projects: `
    <h2>💼 Projects</h2>
    <div id="projects"></div>
  `,
  links: `
    <h2>🔗 Links</h2>
    <p><a href="https://github.com/Matsunaru" target="_blank"><img src="./img/github-mark.svg" alt="GitHub"></a></p>
  `,
  contact: `
    <h2>📬 Contact</h2>
    <p>
  Email: <a href="mailto:error1998pl@gmail.com" id="emailLink">error1998pl@gmail.com</a>
  <button id="copyButton" onclick="copyEmail()">📋 Copy</button>
</p>
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
      ${contents[type]}
    `;

    document.getElementById('mainContent').appendChild(note);

    // Fetch GitHub data if the type is "projects"
    if (type === "projects") {
    fetchgithubData();
    }


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
    //document.getElementById('mainContent').appendChild(note);
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

function copyEmail() {
  const email = "error1998pl@gmail.com";
  navigator.clipboard.writeText(email)
    .then(() => {
      alert("Skopiowano: " + email);
    })
    .catch(err => {
      alert("Nie udało się skopiować: " + err);
    });
}
