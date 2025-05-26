// Initialize AOS
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library if it exists
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
    })
  } else {
    console.warn("AOS is not defined. Make sure AOS library is properly included.")
  }

  // Set current year in footer
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("active")

      // Toggle icon
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Trailer Modal
  const trailerButtons = document.querySelectorAll(".watch-trailer, .play-btn")
  const trailerModal = document.querySelector(".trailer-modal")
  const closeModal = document.querySelector(".close-modal")
  const trailerIframe = document.getElementById("trailer-iframe")

  if (trailerButtons.length && trailerModal && closeModal && trailerIframe) {
    trailerButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Get the trailer URL from the data attribute or use a default
        const trailerUrl = button.dataset.trailer || "https://www.youtube.com/embed/aSiDu3Ywi8E?autoplay=1"

        // Make sure the URL has autoplay parameter
        const finalUrl = trailerUrl.includes("?")
          ? trailerUrl.includes("autoplay=1")
            ? trailerUrl
            : `${trailerUrl}&autoplay=1`
          : `${trailerUrl}?autoplay=1`

        // Set the iframe src
        trailerIframe.src = finalUrl

        // Show the modal
        trailerModal.classList.add("active")
        document.body.style.overflow = "hidden" // Prevent scrolling

        // Log for debugging
        console.log("Opening trailer:", finalUrl)
      })
    })

    closeModal.addEventListener("click", () => {
      trailerIframe.src = ""
      trailerModal.classList.remove("active")
      document.body.style.overflow = "" // Re-enable scrolling
    })

    // Close modal when clicking outside the content
    trailerModal.addEventListener("click", (e) => {
      if (e.target === trailerModal) {
        trailerIframe.src = ""
        trailerModal.classList.remove("active")
        document.body.style.overflow = "" // Re-enable scrolling
      }
    })
  }

  // Check if user is logged in - SAME AS BOOKING.JS
function isUserLoggedIn() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userEmail = localStorage.getItem("userEmail");
  const currentUser = localStorage.getItem("currentUser");

  console.log("Login Check:", { isLoggedIn, userEmail, currentUser });

   return isLoggedIn === "true" ;
}

  // Check if user is logged in
  function checkLoginStatus() {
    const isLoggedIn = isUserLoggedIn()
    const loginBtn = document.querySelector(".btn-login")
    const signupBtn = document.querySelector(".btn-primary")

    if (isLoggedIn && loginBtn && signupBtn) {
      const userName = localStorage.getItem("userName") || "User"
      loginBtn.innerHTML = `<i class="fas fa-user"></i><span>${userName}</span>`
      loginBtn.href = "login.html"
      signupBtn.textContent = "Logout"
      signupBtn.href = "signup.html"
      signupBtn.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    localStorage.removeItem("loggedInUserEmail")
    localStorage.removeItem("currentUser")

    // Show toast notification
    showToast("Successfully logged out!", "success")

    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1500)
  }

  // Toast notification function
  function showToast(message, type = "info") {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast")
    if (existingToast) {
      existingToast.remove()
    }

    // Create new toast
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    // Add to body
    document.body.appendChild(toast)

    // Show toast
    setTimeout(() => {
      toast.classList.add("active")
    }, 10)

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 3000)
  }

  // BOOK NOW BUTTON FUNCTIONALITY - NEW ADDITION
  function handleBookNowClick(e) {
    e.preventDefault(); // Prevent default navigation
    
    if (isUserLoggedIn()) {
      // User is logged in, redirect to booking page
      window.location.href = "booking.html";
    } else {
      // User is not logged in, show message and redirect to login
      showToast("Please login to book tickets", "warning");
      
      // Store the redirect URL
      localStorage.setItem("redirectAfterLogin", "booking.html");
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  }

  // ADD EVENT LISTENERS TO BOOK NOW BUTTONS - NEW ADDITION
  function attachBookNowListeners() {
    const bookNowSelectors = [
      'a[href="booking.html"]',
      'a[href*="booking.html"]',
      '.btn[href="booking.html"]',
      '.btn[href*="booking.html"]',
      '.book-now-btn',
      '.btn-book',
      '.btn-secondary[href="booking.html"]',
      '.find-shows'
    ];
    
    const bookNowButtons = document.querySelectorAll(bookNowSelectors.join(', '));
    
    bookNowButtons.forEach((button) => {
      button.removeEventListener("click", handleBookNowClick);
      button.addEventListener("click", handleBookNowClick);
    });
  }

  // ATTACH LISTENERS AFTER PAGE LOAD - NEW ADDITION
  attachBookNowListeners();

  // OBSERVER FOR DYNAMICALLY ADDED BUTTONS - NEW ADDITION
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const bookNowSelectors = [
              'a[href="booking.html"]',
              'a[href*="booking.html"]',
              '.btn[href="booking.html"]',
              '.btn[href*="booking.html"]',
              '.book-now-btn',
              '.btn-book',
              '.btn-secondary[href="booking.html"]'
            ];
            
            const newBookButtons = node.querySelectorAll(bookNowSelectors.join(', '));
            newBookButtons.forEach((button) => {
              button.addEventListener("click", handleBookNowClick);
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Check login status on page load
  checkLoginStatus()
})

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const today = new Date();

    // Format date to YYYY-MM-DD
    const formattedToday = today.toISOString().split('T')[0];

    // Set min and default value
    dateInput.min = formattedToday;
    dateInput.value = formattedToday;
  }
});