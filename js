const form = document.getElementById("taskForm");

/* FORM SUBMIT */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = document.getElementById("taskInput").value;
  const priority = document.getElementById("priorityInput").value;
  const deadline = document.getElementById("deadlineInput").value;

  const pill = document.createElement("div");
  pill.className = "task-pill";
  pill.draggable = true;

  const eta = calculateETA(deadline);

  pill.innerHTML = `
    <strong>${taskText}</strong>
    <div class="task-meta">
      <span>ETA: ${eta}</span>
      <span class="toggle">✔</span>
    </div>
  `;

  /* TOGGLE COMPLETE */
  pill.querySelector(".toggle").addEventListener("click", () => {
    pill.classList.toggle("completed");
  });

  enableDrag(pill);

  document
    .querySelector(`.column[data-priority="${priority}"] .task-list`)
    .appendChild(pill);

  updateCounts();
  form.reset();
});

/* ETA CALCULATION */
function calculateETA(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? `${diff} days` : "Overdue";
}

/* ENABLE DRAGGING */
function enableDrag(task) {
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    updateCounts();
  });
}

/* DROP ZONES */
document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault(); // allow drop
  });

  list.addEventListener("drop", () => {
    const dragging = document.querySelector(".dragging");
    if (dragging) list.appendChild(dragging);
    updateCounts();
  });
});

/* UPDATE COUNTS */
function updateCounts() {
  document.querySelectorAll(".column").forEach((column) => {
    const count = column.querySelectorAll(".task-pill").length;
    column.querySelector(".count").innerText = count;
  });
}

// ADDITIONAL ACTIVITY
const markAllBtn = document.getElementById("markAllBtn");

markAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".task-pill").forEach((task) => {
    task.classList.add("completed");
  });
});
