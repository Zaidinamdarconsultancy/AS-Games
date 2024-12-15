// Match data: AS numbers and descriptions
const matchData = [
  { id: 1, left: "AS 1", right: "Disclosure of Accounting Policies" },
  { id: 2, left: "AS 9", right: "Revenue Recognition" },
  { id: 3, left: "AS 10", right: "Property, Plant, and Equipment" },
  { id: 4, left: "AS 2", right: "Valuation of Inventories" },
];

// Shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Initialize the game
function initializeGame() {
  const leftColumn = document.getElementById("left-column");
  const rightColumn = document.getElementById("right-column");

  const shuffledLeft = shuffle([...matchData]);
  const shuffledRight = shuffle([...matchData]);

  leftColumn.innerHTML = "";
  rightColumn.innerHTML = "";

  shuffledLeft.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item.left;
    div.dataset.id = item.id;
    div.draggable = true;
    div.classList.add("draggable");
    leftColumn.appendChild(div);
  });

  shuffledRight.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item.right;
    div.dataset.id = item.id;
    div.draggable = true;
    div.classList.add("draggable");
    rightColumn.appendChild(div);
  });

  addDragAndDropEvents();
}

// Drag and drop functionality
function addDragAndDropEvents() {
  const draggables = document.querySelectorAll(".draggable");
  const matchColumns = document.querySelectorAll(".match-column");

  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  matchColumns.forEach(column => {
    column.addEventListener("dragover", e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(column, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement == null) {
        column.appendChild(draggable);
      } else {
        column.insertBefore(draggable, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Check answers
document.getElementById("checkAnswer").addEventListener("click", () => {
  const leftColumn = document.getElementById("left-column").children;
  const rightColumn = document.getElementById("right-column").children;

  let correct = 0;

  for (let i = 0; i < leftColumn.length; i++) {
    if (leftColumn[i].dataset.id === rightColumn[i].dataset.id) {
      correct++;
    }
  }

  const result = document.getElementById("result");
  if (correct === matchData.length) {
    result.textContent = "🎉 Perfect! All matches are correct!";
  } else {
    result.textContent = `You got ${correct}/${matchData.length} correct. Try again!`;
  }
});

// Initialize on load
initializeGame();
