function fetchgithubData()
{
  const username = "Matsunaru"; // can be changed to any GitHub username
  const container = document.getElementById("projects");
  
  fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  .then(response => response.json())
  .then(repos => {
    let html = '';

    repos.slice(0, 4).forEach(repo => {
    html += `
    <div class="project">
      <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
      <p>${repo.description || 'No description available.'}</p>
    </div>
    `;
    });

    container.innerHTML = html;
  })
  .catch(error => {
      console.error("Błąd podczas pobierania danych z GitHub:", error);
    });
}