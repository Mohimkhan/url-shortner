const shortLinksContainer = document.querySelector(".shortLinks-container");
const shortId = document.querySelector(".shortId");

shortLinksContainer.addEventListener("click", (event) => {
  if (event.target.matches(".copyBtn")) {
    const btn = event.target;
    const id = btn.parentElement.children[1].textContent.trim();
    const shortUrl = `${window.location.origin}/url/${id}`;
    // copy the text to the clipboard
    navigator.clipboard.writeText(shortUrl);
    // change the button text
    btn.textContent = "copied!";
    btn.style.opacity = ".75";
    setTimeout(() => {
      btn.textContent = "copy";
      btn.style.opacity = "1";
    }, 2000);
  }
});
