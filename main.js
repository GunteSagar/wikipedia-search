const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const statsLine = document.getElementById("stats");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  searchResults.innerHTML = `<p>Searching...</p>`;
  statsLine.textContent = "";

  try {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=10&exintro=true&explaintext=true&pithumbsize=200`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.query) {
      searchResults.innerHTML = `<p>No results found.</p>`;
      statsLine.textContent = "Sorry, no results.";
      return;
    }

    const results = Object.values(data.query.pages);
    statsLine.textContent = `Displaying ${results.length} results.`;
    displayResults(results);
  } catch (error) {
    console.error(error);
    searchResults.innerHTML = `<p>Error fetching results.</p>`;
  }
});

function displayResults(results) {
  searchResults.innerHTML = "";
  results.forEach((result) => {
    const item = document.createElement("div");
    item.classList.add("result-item");

    // Image
    const img = document.createElement("img");
    img.src = result.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
    img.alt = result.title;

    // Content
    const content = document.createElement("div");
    content.classList.add("result-content");

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = `https://en.wikipedia.org/?curid=${result.pageid}`;
    link.target = "_blank";
    link.textContent = result.title;
    title.append(link);

    const desc = document.createElement("p");
    desc.textContent = result.extract || "No description available.";

    content.append(title, desc);
    item.append(img, content);
    searchResults.append(item);
  });
}
