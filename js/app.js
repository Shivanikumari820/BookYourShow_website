document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = API.getCurrentUser()
  updateUIForUser(currentUser)

  // Initialize movie data
  initializeMovieData()

  // Setup event listeners for auth-related elements
  setupAuthListeners()
})

// Update UI based on user login status
function updateUIForUser(user) {
  const loginButtons = document.querySelectorAll(".btn-login, .btn-login-mobile")
  const signupButtons = document.querySelectorAll('a[href="signup.html"]')
  const userMenus = document.querySelectorAll(".user-menu")

  if (user) {
    // User is logged in
    loginButtons.forEach((button) => {
      button.innerHTML = `<i class="fas fa-user"></i> <span>${user.name}</span>`
      button.href = "profile.html"
    })

    signupButtons.forEach((button) => {
      button.innerHTML = "Logout"
      button.href = "#"
      button.addEventListener("click", (e) => {
        e.preventDefault()
        API.logoutUser().then(() => {
          window.location.href = "index.html"
        })
      })
    })

    userMenus.forEach((menu) => {
      if (menu) menu.style.display = "block"
    })
  } else {
    // User is not logged in
    loginButtons.forEach((button) => {
      button.innerHTML = `<i class="fas fa-user"></i> <span>Sign In</span>`
      button.href = "login.html"
    })

    signupButtons.forEach((button) => {
      button.innerHTML = "Sign Up"
      button.href = "signup.html"
      // Remove any existing event listeners by cloning and replacing
      const newButton = button.cloneNode(true)
      button.parentNode.replaceChild(newButton, button)
    })

    userMenus.forEach((menu) => {
      if (menu) menu.style.display = "none"
    })
  }
}

// Initialize movie data from API
async function initializeMovieData() {
  try {
    const movieData = await API.fetchMovies()

    // Update movie carousels and grids
    updateMovieCarousel(movieData.nowShowing)
    updateComingSoonGrid(movieData.comingSoon)
    updateRecommendedGrid(movieData.recommended)

    // If on movie detail page, load movie details
    const movieDetailContainer = document.querySelector(".movie-detail-container")
    if (movieDetailContainer) {
      const urlParams = new URLSearchParams(window.location.search)
      const movieId = urlParams.get("id")
      if (movieId) {
        loadMovieDetails(movieId)
      }
    }

    // If on booking page, load movie for booking
    const movieInfoContainer = document.querySelector(".movie-info-container")
    if (movieInfoContainer) {
      const urlParams = new URLSearchParams(window.location.search)
      const movieId = urlParams.get("id")
      if (movieId) {
        loadMovieForBooking(movieId)
      }
    }
  } catch (error) {
    console.error("Error initializing movie data:", error)
  }
}

// Update movie carousel with data
function updateMovieCarousel(movies) {
  const movieCarouselElement = document.querySelector(".movie-carousel .swiper-wrapper")
  if (!movieCarouselElement) return

  movieCarouselElement.innerHTML = ""

  movies.forEach((movie) => {
    const slide = document.createElement("div")
    slide.className = "swiper-slide"
    slide.innerHTML = `
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${movie.image}" alt="${movie.title}">
          <div class="movie-poster-overlay">
            <button class="play-btn" data-trailer="${movie.trailer}">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div class="movie-info">
          <h3 class="movie-card-title">${movie.title}</h3>
          <div class="movie-card-meta">
            <div class="rating">
              <i class="fas fa-star"></i>
              <span>${movie.rating}</span>
            </div>
            <span class="genre">${movie.genre}</span>
          </div>
          <a href="booking.html?id=${movie.id}" class="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>
    `
    movieCarouselElement.appendChild(slide)
  })

  // Initialize trailer buttons
  initializeTrailerButtons()
}

// Update coming soon grid with data
function updateComingSoonGrid(movies) {
  const movieGrid = document.querySelector(".movie-grid")
  if (!movieGrid) return

  movieGrid.innerHTML = ""

  movies.forEach((movie) => {
    const movieCard = document.createElement("div")
    movieCard.className = "movie-card coming-soon"
    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="movie-poster-overlay">
          <button class="play-btn" data-trailer="${movie.trailer}">
            <i class="fas fa-play"></i>
          </button>
        </div>
        <div class="coming-soon-badge">Coming Soon</div>
      </div>
      <div class="movie-info">
        <h3 class="movie-card-title">${movie.title}</h3>
        <div class="release-date">
          <i class="fas fa-calendar"></i>
          <span>${movie.releaseDate}</span>
        </div>
      </div>
    `
    movieGrid.appendChild(movieCard)
  })

  // Initialize trailer buttons
  initializeTrailerButtons()
}

// Update recommended grid with data
function updateRecommendedGrid(movies) {
  const recommendationGrid = document.querySelector(".recommendation-grid")
  if (!recommendationGrid) return

  recommendationGrid.innerHTML = ""

  movies.forEach((movie) => {
    const recommendationCard = document.createElement("div")
    recommendationCard.className = "recommendation-card"
    recommendationCard.innerHTML = `
      <div class="recommendation-image">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="match-badge">
          <i class="fas fa-thumbs-up"></i>
          <span>${movie.match}</span>
        </div>
      </div>
      <div class="recommendation-info">
        <h3 class="recommendation-title">${movie.title}</h3>
        <div class="recommendation-meta">
          <div class="rating">
            <i class="fas fa-star"></i>
            <span>${movie.rating}</span>
          </div>
          <span class="genre">${movie.genre}</span>
        </div>
        <a href="booking.html?id=${movie.id}" class="btn btn-primary btn-sm">Book Now</a>
      </div>
    `
    recommendationGrid.appendChild(recommendationCard)
  })
}

// Initialize trailer buttons
function initializeTrailerButtons() {
  const trailerButtons = document.querySelectorAll(".play-btn[data-trailer]")
  const trailerModal = document.querySelector(".trailer-modal")
  const closeModal = document.querySelector(".close-modal")
  const trailerIframe = document.getElementById("trailer-iframe")

  if (trailerButtons.length && trailerModal && closeModal && trailerIframe) {
    trailerButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const trailerUrl = button.getAttribute("data-trailer")
        trailerIframe.src = trailerUrl
        trailerModal.classList.add("active")
        document.body.style.overflow = "hidden" // Prevent scrolling
      })
    })
  }
}

// Load movie details for detail page
async function loadMovieDetails(movieId) {
  try {
    const movie = await API.fetchMovieById(movieId)
    if (!movie) {
      console.error("Movie not found")
      return
    }

    const detailContainer = document.querySelector(".movie-detail-container")
    if (!detailContainer) return

    // Update movie details in the UI
    const titleElement = detailContainer.querySelector(".movie-title")
    if (titleElement) titleElement.textContent = movie.title

    const posterElement = detailContainer.querySelector(".movie-poster img")
    if (posterElement) posterElement.src = movie.image

    const descriptionElement = detailContainer.querySelector(".movie-description")
    if (descriptionElement) descriptionElement.textContent = movie.description

    // Update other elements as needed

    // Set trailer button
    const trailerButton = detailContainer.querySelector(".watch-trailer")
    if (trailerButton) {
      trailerButton.setAttribute("data-trailer", movie.trailer)
    }

    // Initialize trailer button
    initializeTrailerButtons()
  } catch (error) {
    console.error("Error loading movie details:", error)
  }
}

// Load movie for booking page
async function loadMovieForBooking(movieId) {
  try {
    const movie = await API.fetchMovieById(movieId)
    if (!movie) {
      console.error("Movie not found")
      return
    }

    const movieInfoContainer = document.querySelector(".movie-info-container")
    if (!movieInfoContainer) return

    // Update movie info in the booking page
    const posterElement = movieInfoContainer.querySelector(".movie-poster img")
    if (posterElement) posterElement.src = movie.image

    const titleElement = movieInfoContainer.querySelector(".movie-title")
    if (titleElement) titleElement.textContent = movie.title

    // Update other booking page elements
  } catch (error) {
    console.error("Error loading movie for booking:", error)
  }
}

// Setup auth-related event listeners
function setupAuthListeners() {
  // Login form
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      try {
        const user = await API.loginUser(email, password)
        window.location.href = "index.html"
      } catch (error) {
        alert("Login failed: " + error.message)
      }
    })
  }

  // Signup form
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const userData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
      }

      try {
        const user = await API.registerUser(userData)
        window.location.href = "index.html"
      } catch (error) {
        alert("Registration failed: " + error.message)
      }
    })
  }

  // Forgot password form
  const forgotPasswordForm = document.getElementById("forgot-password-form")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value

      try {
        const result = await API.resetPassword(email)
        alert("Password reset email sent. Please check your inbox.")
      } catch (error) {
        alert("Password reset failed: " + error.message)
      }
    })
  }
}

// Add booking details link
function setupBookingDetailsLink(user) {
  const signupButtons = document.querySelectorAll('a[href="signup.html"]')

  signupButtons.forEach((button) => {
    if (user) {
      // User is logged in
      button.innerHTML = "Logout"
      button.href = "#"
      button.addEventListener("click", (e) => {
        e.preventDefault()
        API.logoutUser().then(() => {
          window.location.href = "index.html"
        })
      })
    } else {
      // User is not logged in
      button.innerHTML = "Sign Up"
      button.href = "signup.html"
      // Remove any existing event listeners by cloning and replacing
      const newButton = button.cloneNode(true)
      button.parentNode.replaceChild(newButton, button)
    }
  })

  const bookingDetailsLink = document.querySelector(".nav-menu .nav-list")
  const bookingDetailsMobileLink = document.querySelector(".mobile-nav-list")

  if (user) {
    const bookingLink = document.createElement("li")
    bookingLink.innerHTML = `<a href="Bookingdetails.html">My Bookings</a>`
    bookingDetailsLink.appendChild(bookingLink)

    const bookingMobileLink = document.createElement("li")
    bookingMobileLink.innerHTML = `<a href="Bookingdetails.html">My Bookings</a>`
    bookingDetailsMobileLink.appendChild(bookingMobileLink)
  }
}

// Mock API object for demonstration.  In a real application, this would be imported.
const API = {
  getCurrentUser: () => {
    // Replace with actual implementation to fetch current user
    return null // Or return a mock user object for testing
  },
  fetchMovies: async () => {
    // Replace with actual API call
    return {
      nowShowing: [],
      comingSoon: [],
      recommended: [],
    }
  },
  fetchMovieById: async (movieId) => {
    // Replace with actual API call
    return null
  },
  loginUser: async (email, password) => {
    // Replace with actual API call
    return { name: "Test User" }
  },
  registerUser: async (userData) => {
    // Replace with actual API call
    return { name: "Test User" }
  },
  logoutUser: async () => {
    // Replace with actual API call
    return Promise.resolve()
  },
  resetPassword: async (email) => {
    // Replace with actual API call
    return Promise.resolve()
  },
}
