// Global variables
let currentModals = {};
let isInitialized = false; // Flag to prevent multiple initializations
let childrenData = {}; // Will be populated from API

// Fetch children data from Django API
async function fetchChildrenData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/students/');
    if (!response.ok) {
      throw new Error('Failed to fetch students data');
    }
    const students = await response.json();
    
    // Transform the API data to match the expected format
    childrenData = {};
    students.forEach(student => {
      const studentKey = student.name.toLowerCase().split(' ')[0]; // Use first name as key
      childrenData[studentKey] = {
        name: `${student.name} - Grade ${student.grade}`,
        stats: {
          attendance: calculateAttendancePercentage(student.attendances) + "%",
          grade: calculateAverageGrade(student.subjects) + "%",
          assignments: student.assignments.filter(a => a.status === 'pending').length.toString(),
          events: "2", // This could be fetched from a separate events API
        },
        subjects: student.subjects.map(subject => ({
          name: subject.name,
          grade: subject.grade,
          lastTest: subject.last_test,
          teacher: subject.teacher,
        })),
        assignments: student.assignments.map(assignment => ({
          title: assignment.title,
          due: assignment.due,
          status: assignment.status,
          subject: assignment.subject,
          grade: assignment.grade || null,
        })),
      };
    });

    // Dynamically populate the childSelect dropdown
    const childSelect = document.getElementById('childSelect');
    if (childSelect) {
      childSelect.innerHTML = '';
      Object.entries(childrenData).forEach(([key, data]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.name;
        childSelect.appendChild(option);
      });
    }
    
    console.log('Children data loaded from API:', childrenData);
    return childrenData;
  } catch (error) {
    console.error('Error fetching children data:', error);
    // Fallback to sample data if API fails
    return getSampleData();
  }
}

// Calculate attendance percentage
function calculateAttendancePercentage(attendances) {
  if (!attendances || attendances.length === 0) return 0;
  const presentCount = attendances.filter(a => a.present).length;
  return Math.round((presentCount / attendances.length) * 100);
}

// Calculate average grade
function calculateAverageGrade(subjects) {
  if (!subjects || subjects.length === 0) return 0;
  const gradeValues = subjects.map(subject => {
    const grade = subject.grade;
    if (grade.includes('A')) return 90;
    if (grade.includes('B')) return 80;
    if (grade.includes('C')) return 70;
    if (grade.includes('D')) return 60;
    return 50;
  });
  const average = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
  return Math.round(average);
}

// Fallback sample data (same as before)
function getSampleData() {
  return {
    emma: {
      name: "Emma Johnson - Grade 8",
      stats: {
        attendance: "92%",
        grade: "85%",
        assignments: "3",
        events: "2",
      },
      subjects: [
        {
          name: "Mathematics",
          grade: "A",
          lastTest: "92% (Algebra Quiz)",
          teacher: "Mrs. Smith",
        },
        {
          name: "English Literature",
          grade: "B+",
          lastTest: "88% (Essay on Shakespeare)",
          teacher: "Mr. Johnson",
        },
        {
          name: "Science",
          grade: "A-",
          lastTest: "94% (Chemistry Experiment)",
          teacher: "Dr. Wilson",
        },
      ],
      assignments: [
        {
          title: "Math Homework - Chapter 5",
          due: "Tomorrow",
          status: "pending",
          subject: "Mathematics",
        },
        {
          title: "Science Project - Solar System",
          due: "Next Friday",
          status: "pending",
          subject: "Science",
        },
        {
          title: "English Essay - My Summer",
          due: "Last Week",
          status: "completed",
          subject: "English",
          grade: "A-",
        },
      ],
    },
    alex: {
      name: "Alex Johnson - Grade 5",
      stats: {
        attendance: "96%",
        grade: "78%",
        assignments: "2",
        events: "1",
      },
      subjects: [
        {
          name: "Elementary Math",
          grade: "B+",
          lastTest: "84% (Addition/Subtraction)",
          teacher: "Ms. Davis",
        },
        {
          name: "Reading",
          grade: "A",
          lastTest: "95% (Reading Comprehension)",
          teacher: "Mrs. Brown",
        },
        {
          name: "Social Studies",
          grade: "B",
          lastTest: "80% (Geography Quiz)",
          teacher: "Mr. Lee",
        },
      ],
      assignments: [
        {
          title: "Reading Log - Week 3",
          due: "Friday",
          status: "pending",
          subject: "Reading",
        },
        {
          title: "Math Worksheet - Multiplication",
          due: "Yesterday",
          status: "overdue",
          subject: "Mathematics",
        },
        {
          title: "Art Project - My Family",
          due: "Last Week",
          status: "completed",
          subject: "Art",
          grade: "A",
        },
      ],
    },
  };
}

// Main initialization function
async function initializeDashboard() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.log("Dashboard already initialized, skipping...");
    return;
  }

  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const childSelect = document.getElementById("childSelect");
  const notificationBell = document.querySelector(".notification-bell");

  // Debug logging
  console.log("Initializing dashboard...");
  console.log("Menu button found:", !!menuBtn);
  console.log("Close button found:", !!closeBtn);
  console.log("Sidebar found:", !!sidebar);
  console.log("Main content found:", !!mainContent);

  // Initialize modals
  currentModals = {
    progress: document.getElementById("progressModal"),
    attendance: document.getElementById("attendanceModal"),
    assignments: document.getElementById("assignmentsModal"),
    notices: document.getElementById("noticesModal"),
  };

  // Remove existing event listeners to prevent duplicates
  if (menuBtn) {
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
  }
  if (closeBtn) {
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
  }

  // Get fresh references after cloning
  const freshMenuBtn = document.getElementById("menu-btn");
  const freshCloseBtn = document.getElementById("close-btn");

  // Toggle sidebar on menu button click
  if (freshMenuBtn) {
    freshMenuBtn.addEventListener("click", function () {
      console.log("Hamburger clicked!");
      sidebar.classList.toggle("active");
      mainContent.classList.toggle("expanded");
    });
  }

  // Close sidebar on close button click
  if (freshCloseBtn) {
    freshCloseBtn.addEventListener("click", function () {
      console.log("Close button clicked!");
      sidebar.classList.remove("active");
      mainContent.classList.remove("expanded");
    });
  }

  // Close sidebar when clicking outside of it
  document.addEventListener("click", function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnMenuBtn =
      event.target === freshMenuBtn || freshMenuBtn.contains(event.target);

    if (
      !isClickInsideSidebar &&
      !isClickOnMenuBtn &&
      window.innerWidth <= 992
    ) {
      sidebar.classList.remove("active");
      mainContent.classList.remove("expanded");
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 992 && sidebar && mainContent) {
      sidebar.classList.remove("active");
      mainContent.classList.remove("expanded");
    }
  });

  // Fetch data from API
  await fetchChildrenData();

  // Handle child selection change
  if (childSelect) {
    childSelect.addEventListener("change", function () {
      const selectedChild = this.value;
      updateDashboard(selectedChild);

      // Add loading effect
      const cards = document.querySelectorAll(".card, .stat-card");
      cards.forEach((card) => {
        card.classList.add("loading");
        setTimeout(() => card.classList.remove("loading"), 1000);
      });
    });
  }

  // Card click handlers
  attachCardEventListeners();

  // Modal close handlers
  attachModalEventListeners();

  // Notification bell click
  if (notificationBell) {
    notificationBell.addEventListener("click", function () {
      showModal("notices");
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      Object.values(currentModals).forEach((modal) => {
        if (modal && modal.classList.contains("active")) {
          hideModal(modal);
        }
      });
    }
  });

  // Touch feedback for mobile
  if ("ontouchstart" in window) {
    document
      .querySelectorAll(".card, .notification-bell, .sidebar-menu li a")
      .forEach((element) => {
        element.addEventListener("touchstart", function () {
          this.style.opacity = "0.7";
        });

        element.addEventListener("touchend", function () {
          this.style.opacity = "1";
        });
      });
  }

  // Mobile swipe gestures
  setupSwipeGestures();

  // Initialize with first child (if available)
  const firstChild = Object.keys(childrenData)[0];
  if (firstChild) {
    updateDashboard(firstChild);
  }

  // Set the initialized flag
  isInitialized = true;
}

// Card event listeners
function attachCardEventListeners() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      const cardTitle = this.querySelector("h3");
      if (!cardTitle) return;

      const titleText = cardTitle.textContent.toLowerCase();

      if (titleText.includes("progress")) {
        showModal("progress");
      } else if (titleText.includes("attendance")) {
        showModal("attendance");
      } else if (titleText.includes("assignments")) {
        showModal("assignments");
      } else if (titleText.includes("notices")) {
        showModal("notices");
      } else {
        alert("Opening ${titleText} (Feature coming soon!)");
      }
    });
  });

  // Also handle card buttons
  const progressBtn = document.querySelector(
    ".card-btn[onclick*='progress'], .card-btn[data-modal='progress']"
  );
  const attendanceBtn = document.querySelector(
    ".card-btn[onclick*='attendance'], .card-btn[data-modal='attendance']"
  );
  const assignmentsBtn = document.querySelector(
    ".card-btn[onclick*='assignments'], .card-btn[data-modal='assignments']"
  );
  const noticesBtn = document.querySelector(
    ".card-btn[onclick*='notices'], .card-btn[data-modal='notices']"
  );

  if (progressBtn) {
    progressBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("progress");
    });
  }

  if (attendanceBtn) {
    attendanceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("attendance");
    });
  }

  if (assignmentsBtn) {
    assignmentsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("assignments");
    });
  }

  if (noticesBtn) {
    noticesBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("notices");
    });
  }
}

// Modal event listeners
function attachModalEventListeners() {
  document.querySelectorAll(".modal-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) hideModal(modal);
    });
  });

  // Close modal when clicking outside
  Object.values(currentModals).forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          hideModal(this);
        }
      });
    }
  });
}

// Modal functions
function showModal(modalType) {
  const modal = currentModals[modalType];
  if (modal) {
    modal.classList.add("active");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    updateModalContent(modalType);
  }
}

function hideModal(modal) {
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Update modal content based on selected child
function updateModalContent(modalType) {
  const childSelect = document.getElementById("childSelect");
  const selectedChild = childSelect ? childSelect.value : "emma";
  const child = childrenData[selectedChild];

  if (modalType === "progress" && child) {
    const progressContent = document.getElementById("progressContent");
    if (progressContent) {
      progressContent.innerHTML = "";

      child.subjects.forEach((subject) => {
        const gradeClass = subject.grade.includes("A")
          ? "grade-a"
          : subject.grade.includes("B")
          ? "grade-b"
          : "grade-c";

        progressContent.innerHTML += `
          <div class="progress-item">
            <h4>${subject.name}</h4>
            <p>Current Grade: <span class="grade-badge ${gradeClass}">${subject.grade}</span></p>
            <p>Last Test: ${subject.lastTest}</p>
            <p>Teacher: ${subject.teacher}</p>
          </div>
        `;
      });
    }
  }

  if (modalType === "assignments" && child) {
    const assignmentsContent = document.getElementById("assignmentsContent");
    if (assignmentsContent) {
      assignmentsContent.innerHTML = "";

      child.assignments.forEach((assignment) => {
        const statusClass = "status-${assignment.status}";
        const statusText =
          assignment.status.charAt(0).toUpperCase() +
          assignment.status.slice(1);

        assignmentsContent.innerHTML += `
          <div class="assignment-item">
            <h4>${assignment.title}</h4>
            <p>Due: ${assignment.due}</p>
            <p>Status: <span class="status-badge ${statusClass}">${statusText}</span></p>
            <p>Subject: ${assignment.subject}${
          assignment.grade ? ` | Grade: ${assignment.grade}` : ""
        }</p>
          </div>
        `;
      });
    }
  }

  if (modalType === "attendance" && child) {
    const attendanceContent = document.getElementById("attendanceContent");
    if (attendanceContent) {
      attendanceContent.innerHTML = `
        <div class="attendance-summary">
          <h4>Attendance Summary for ${child.name}</h4>
          <p>Current Attendance Rate: <strong>${child.stats.attendance}</strong></p>
          <p>This is above the required 90% attendance rate.</p>
        </div>
      `;
    }
  }

  if (modalType === "notices") {
    const noticesContent = document.getElementById("noticesContent");
    if (noticesContent) {
      noticesContent.innerHTML = `
        <div class="notices-list">
          <div class="notice-item">
            <h4>Parent-Teacher Conference</h4>
            <p>Scheduled for next Thursday at 3:00 PM</p>
            <span class="notice-date">Posted 2 days ago</span>
          </div>
          <div class="notice-item">
            <h4>School Holiday</h4>
            <p>School will be closed on Monday for Teacher's Day</p>
            <span class="notice-date">Posted 1 week ago</span>
          </div>
        </div>
      `;
    }
  }
}

// Update dashboard function
function updateDashboard(childKey) {
  const child = childrenData[childKey];
  if (!child) {
    console.warn(`Child data not found for key: ${childKey}`);
    return;
  }

  // Update attendance circular progress
  const attendanceCard = document.querySelector(".stat-card");
  if (attendanceCard) {
    const percent = parseInt(child.stats.attendance.replace("%", ""));
    const circle = attendanceCard.querySelector(".circle");
    const text = attendanceCard.querySelector(".percentage-text");
    const h3 = attendanceCard.querySelector("h3");
    const attendanceDisplay = (isNaN(percent) || child.stats.attendance === "0%") ? "N/A" : `${percent}%`;
    if (circle && text) {
      circle.setAttribute("stroke-dasharray", `${isNaN(percent) ? 0 : percent}, 100`);
      text.textContent = attendanceDisplay;
    }
    if (h3) {
      h3.textContent = attendanceDisplay;
    }
  }

  // Update other stat cards (grade, assignments, events)
  const statCards = document.querySelectorAll(".stat-card");
  if (statCards.length >= 4) {
    // Grade
    const gradeEl = statCards[1].querySelector("h3");
    const gradeDisplay = (!child.stats.grade || child.stats.grade === "0%") ? "N/A" : child.stats.grade;
    if (gradeEl) gradeEl.textContent = gradeDisplay;
    // Assignments
    const assignmentEl = statCards[2].querySelector("h3");
    const assignmentsDisplay = (!child.stats.assignments || child.stats.assignments === "0") ? "N/A" : child.stats.assignments;
    if (assignmentEl) assignmentEl.textContent = assignmentsDisplay;
    // Events
    const eventsEl = statCards[3].querySelector("h3");
    const eventsDisplay = (!child.stats.events || child.stats.events === "0") ? "N/A" : child.stats.events;
    if (eventsEl) eventsEl.textContent = eventsDisplay;
  }

  // Update notification badge
  const totalNotifications =
    (isNaN(parseInt(child.stats.assignments)) ? 0 : parseInt(child.stats.assignments)) +
    (isNaN(parseInt(child.stats.events)) ? 0 : parseInt(child.stats.events));
  const badge = document.querySelector(".notification-badge");
  if (badge) badge.textContent = totalNotifications;

  console.log(`Dashboard updated for ${child.name}`);
}

// Swipe gestures for mobile
function setupSwipeGestures() {
  let startX, startY, currentX, currentY;

  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchmove", function (e) {
    if (!startX || !startY) return;

    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;

    const diffX = startX - currentX;
    const diffY = startY - currentY;

    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (!sidebar || !mainContent) return;

    // Swipe left to close sidebar
    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      diffX > 50 &&
      window.innerWidth <= 992
    ) {
      if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        mainContent.classList.remove("expanded");
      }
    }

    // Swipe right to open sidebar
    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      diffX < -50 &&
      startX < 50 &&
      window.innerWidth <= 992
    ) {
      if (!sidebar.classList.contains("active")) {
        sidebar.classList.add("active");
        mainContent.classList.add("expanded");
      }
    }
  });

  document.addEventListener("touchend", function () {
    startX = null;
    startY = null;
  });
}

// Page loading function
async function loadPage(page) {
  fetch(page)
    .then((res) => {
      if (!res.ok) throw new Error("Page not found: ${page}");
      return res.text();
    })
    .then(async (html) => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.innerHTML = html;

        // Always fetch fresh data from API and attach card listeners
        await fetchChildrenData();
        
        // Use selected child if available, otherwise use first child
        let selectedChild = Object.keys(childrenData)[0];
        const childSelect = document.getElementById("childSelect");
        if (childSelect && childSelect.value) {
          selectedChild = childSelect.value;
        }
        
        if (selectedChild) {
          updateDashboard(selectedChild);
        }
        attachCardEventListeners();
      }
    })
    .catch((err) => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.innerHTML = "<h2>Error loading content.</h2>";
      }
      console.error("Page loading error:", err);
    });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
});

// Fallback initialization for window load
window.addEventListener("load", function () {
  // Only load page if main-content exists and is empty
  const mainContent = document.getElementById("main-content");
  if (mainContent && !mainContent.innerHTML.trim()) {
    loadPage("dashboard.html");
  }
});
