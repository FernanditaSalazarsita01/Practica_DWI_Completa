document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initAgeCalculator();
  initTemperatureConverter();
  initTaskManager();
});

function initNavigation() {
  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll(".section")];

  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.dataset.section === visible.target.id
        );
      });
    },
    { threshold: [0.25, 0.5, 0.75], rootMargin: "-15% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initAgeCalculator() {
  const form = document.getElementById("ageForm");
  const daySelect = document.getElementById("birthDay");
  const monthSelect = document.getElementById("birthMonth");
  const yearSelect = document.getElementById("birthYear");
  const errorElement = document.getElementById("ageError");
  const resultPanel = document.getElementById("ageResult");
  const resultText = document.getElementById("ageResultText");
  const extraText = document.getElementById("ageExtraText");

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  months.forEach((month, index) => {
    monthSelect.add(new Option(month, String(index + 1)));
  });

  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 120; year -= 1) {
    yearSelect.add(new Option(String(year), String(year)));
  }

  function updateDays() {
    const selectedDay = Number(daySelect.value);
    const month = Number(monthSelect.value);
    const year = Number(yearSelect.value);

    daySelect.innerHTML = '<option value="">Día</option>';

    if (!month || !year) return;

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      daySelect.add(new Option(String(day), String(day)));
    }

    if (selectedDay && selectedDay <= daysInMonth) {
      daySelect.value = String(selectedDay);
    }
  }

  monthSelect.addEventListener("change", updateDays);
  yearSelect.addEventListener("change", updateDays);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorElement.textContent = "";
    resultPanel.hidden = true;

    const day = Number(daySelect.value);
    const month = Number(monthSelect.value);
    const year = Number(yearSelect.value);

    if (!day || !month || !year) {
      errorElement.textContent = "Selecciona el día, mes y año de nacimiento.";
      return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isExactDate =
      birthDate.getFullYear() === year &&
      birthDate.getMonth() === month - 1 &&
      birthDate.getDate() === day;

    if (!isExactDate) {
      errorElement.textContent = "La fecha ingresada no es válida.";
      return;
    }

    if (birthDate > today) {
      errorElement.textContent = "La fecha de nacimiento no puede estar en el futuro.";
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let monthsElapsed = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      monthsElapsed -= 1;
    }

    if (monthsElapsed < 0) {
      years -= 1;
      monthsElapsed += 12;
    }

    const totalMonths = years * 12 + monthsElapsed;
    const yearsLabel = years === 1 ? "año" : "años";
    const monthsLabel = monthsElapsed === 1 ? "mes" : "meses";

    resultText.textContent = `${years} ${yearsLabel} y ${monthsElapsed} ${monthsLabel}`;
    extraText.textContent = `Equivale aproximadamente a ${totalMonths} meses transcurridos.`;
    resultPanel.hidden = false;
  });
}

function initTemperatureConverter() {
  const form = document.getElementById("temperatureForm");
  const valueInput = document.getElementById("temperatureValue");
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const convertButton = document.getElementById("convertButton");
  const errorElement = document.getElementById("temperatureError");
  const resultPanel = document.getElementById("temperatureResult");
  const resultText = document.getElementById("temperatureResultText");

  const unitNames = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K"
  };

  function formIsComplete() {
    const value = valueInput.value.trim();
    return value !== "" &&
      Number.isFinite(Number(value)) &&
      fromUnit.value !== "" &&
      toUnit.value !== "";
  }

  function updateButtonState() {
    convertButton.disabled = !formIsComplete();
    errorElement.textContent = "";
  }

  [valueInput, fromUnit, toUnit].forEach((field) => {
    field.addEventListener("input", updateButtonState);
    field.addEventListener("change", updateButtonState);
  });

  function toCelsius(value, unit) {
    if (unit === "fahrenheit") return (value - 32) * 5 / 9;
    if (unit === "kelvin") return value - 273.15;
    return value;
  }

  function fromCelsius(value, unit) {
    if (unit === "fahrenheit") return (value * 9 / 5) + 32;
    if (unit === "kelvin") return value + 273.15;
    return value;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resultPanel.hidden = true;
    errorElement.textContent = "";

    if (!formIsComplete()) {
      errorElement.textContent = "Completa los tres campos para realizar la conversión.";
      updateButtonState();
      return;
    }

    const value = Number(valueInput.value);
    const celsiusValue = toCelsius(value, fromUnit.value);
    const result = fromCelsius(celsiusValue, toUnit.value);

    if (toUnit.value === "kelvin" && result < 0) {
      errorElement.textContent = "El resultado no puede ser menor que el cero absoluto (0 K).";
      return;
    }

    const roundedResult = Number(result.toFixed(2));
    resultText.textContent =
      `${value} ${unitNames[fromUnit.value]} = ${roundedResult} ${unitNames[toUnit.value]}`;
    resultPanel.hidden = false;
  });

  updateButtonState();
}

function initTaskManager() {
  const form = document.getElementById("taskForm");
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyTasks");
  const taskMessage = document.getElementById("taskMessage");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");

  let tasks = loadTasks();

  function loadTasks() {
    try {
      const stored = JSON.parse(localStorage.getItem("dwiTasks"));
      return Array.isArray(stored)
        ? stored.filter((task) =>
            task &&
            typeof task.descripcion === "string" &&
            typeof task.completada === "boolean"
          )
        : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem("dwiTasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    list.innerHTML = "";

    const sortedTasks = tasks
      .map((task, index) => ({ ...task, originalIndex: index }))
      .sort((a, b) => Number(a.completada) - Number(b.completada));

    sortedTasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.completada ? " completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completada;
      checkbox.setAttribute(
        "aria-label",
        task.completada ? "Marcar como pendiente" : "Marcar como completada"
      );

      checkbox.addEventListener("change", () => {
        tasks[task.originalIndex].completada = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const description = document.createElement("span");
      description.className = "task-description";
      description.textContent = task.descripcion;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-task";
      deleteButton.textContent = "✕";
      deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.descripcion}`);

      deleteButton.addEventListener("click", () => {
        tasks.splice(task.originalIndex, 1);
        saveTasks();
        renderTasks();
      });

      item.append(checkbox, description, deleteButton);
      list.appendChild(item);
    });

    const pending = tasks.filter((task) => !task.completada).length;
    const completed = tasks.length - pending;

    pendingCount.textContent = String(pending);
    completedCount.textContent = String(completed);
    emptyState.hidden = tasks.length > 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    taskMessage.textContent = "";

    const description = input.value.trim();

    if (!description) {
      taskMessage.textContent = "Escribe una descripción antes de agregar la tarea.";
      input.focus();
      return;
    }

    tasks.push({
      descripcion: description,
      completada: false
    });

    saveTasks();
    renderTasks();
    form.reset();
    input.focus();
  });

  renderTasks();
}
