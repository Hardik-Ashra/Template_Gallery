document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const highlight = document.querySelector(".highlight");
  const gridItems = document.querySelectorAll(".grid-item");
  const firstItem = document.querySelector(".grid-item");

  const highlightColors = [
    "#E24E1B",
    "#4381C1",
    "#F79824",
    "#04A777",
    "#5B8C5A",
    "#2176FF",
    "#818D92",
    "#22AAA1",
  ];

  gridItems.forEach((item, index) => {
    item.dataset.color = highlightColors[index % highlightColors.length];
  });

  const moveToElement = (element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      highlight.style.transform = `translate(${
        rect.left - containerRect.left
      }px, ${rect.top - containerRect.top}px)`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.backgroundColor = element.dataset.color;
    }
  };

  const moveHighlight = (e) => {
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);

    if (hoveredElement && hoveredElement.classList.contains("grid-item")) {
      moveToElement(hoveredElement);
    } else if (
      hoveredElement &&
      hoveredElement.parentElement &&
      hoveredElement.parentElement.classList.contains("grid-item")
    ) {
      moveToElement(hoveredElement.parentElement);
    }
  };

  moveToElement(firstItem);
  container.addEventListener("mousemove", moveHighlight);
});
