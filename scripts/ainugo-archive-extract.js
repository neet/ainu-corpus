function extractAinugoArchive() {
  const ainuText = document.querySelector(".ainuText");
  const rows = ainuText.querySelectorAll("table tr");

  let text = "";

  for (const row of rows) {
    const latinChunk = row.querySelector(".latin").textContent;
    const translationChunk = row.querySelector(".jap").textContent;

    text += latinChunk + "\n" + translationChunk + "\n\n";
  }

  return text;
}

function createCopyButton() {
  const button = document.createElement("button");
  button.textContent = "テキストをコピー";
  button.classList.add("btn", "btn-default");

  button.addEventListener(
    "click",
    async () => {
      const text = extractAinugoArchive();
      await navigator.clipboard.writeText(text);
      alert("コピーしました: " + text);
    },
    false
  );

  return button;
}

function main() {
  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }

      if (mutation.addedNodes.length === 0) {
        continue;
      }

      const button = createCopyButton();
      const ainuText = document.querySelector("#text .wmax .right");
      ainuText.insertBefore(button, ainuText.firstChild);
    }
  });

  mo.observe(document.querySelector("#main-view #block-wrap #text"), {
    childList: true,
  });
}

main();
