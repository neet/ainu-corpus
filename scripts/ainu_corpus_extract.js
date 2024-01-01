const extract = () => {
  const tables = Array.from(
    document.querySelector(
      "#headword-body-main-panel-body .x-grid-item-container"
    ).children
  );

  let text = "";

  for (const table of tables) {
    const cells = Array.from(table.querySelectorAll(".gloss .gloss-cell"));

    const ainu = cells
      .map((el) => el.querySelector(".ainu").textContent)
      .join(" ");
    const translation = table.querySelector(".translation .ft_j").textContent;

    text += `${ainu}\n${translation}\n\n`;
  }

  return text;
};

function createCopyButton() {
  const button = document.createElement("button");
  button.textContent = "テキストをコピー";
  button.classList.add("btn", "btn-default");

  button.addEventListener(
    "click",
    async () => {
      const text = extract();
      await navigator.clipboard.writeText(text);
      alert("コピーしました: " + text);
    },
    false
  );

  return button;
}

function main() {
  const button = createCopyButton();
  const buttonContainer = document.querySelector(
    "#headword-body-panel-toolbar-top-targetEl"
  );
  buttonContainer.insertBefore(button, buttonContainer.firstChild);
}

main();
