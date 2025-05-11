document.addEventListener("DOMContentLoaded", () => {
  // Fetch movie data from JSON file
  fetchMovies()

  // Function to fetch movies data
  function fetchMovies() {
    fetch("data/movies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        // Initialize movie sections with the fetched data
        initializeMovieSections(data)
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error)
        // Show error toast
        if (window.showToast) {
          window.showToast("Failed to load movie data. Please try again later.", "error")
        }
      })
  }

  // Function to initialize movie sections
  function initializeMovieSections(data) {
    // Initialize Now Showing section
    initializeNowShowing(data.nowShowing)

    // Initialize Coming Soon section
    initializeComingSoon(data.comingSoon)

    // Initialize Recommendations section
    initializeRecommendations(data.recommended)

    // Initialize Swiper if it exists
    initializeSwiper()
  }

  // Initialize Now Showing section
  function initializeNowShowing(movies) {
    const swiperWrapper = document.querySelector(".swiper-wrapper")
    if (!swiperWrapper) return

    swiperWrapper.innerHTML = "" // Clear existing content

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
      swiperWrapper.appendChild(slide)
    })

    // Add event listeners to the newly created play buttons
    const playButtons = swiperWrapper.querySelectorAll(".play-btn")
    playButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const trailerUrl = button.getAttribute("data-trailer")
        const trailerModal = document.querySelector(".trailer-modal")
        const trailerIframe = document.getElementById("trailer-iframe")

        if (trailerModal && trailerIframe && trailerUrl) {
          // Make sure the URL has autoplay parameter
          const finalUrl = trailerUrl.includes("?")
            ? trailerUrl.includes("autoplay=1")
              ? trailerUrl
              : `${trailerUrl}&autoplay=1`
            : `${trailerUrl}?autoplay=1`

          trailerIframe.src = finalUrl
          trailerModal.classList.add("active")
          document.body.style.overflow = "hidden"

          // Log for debugging
          console.log("Opening trailer from movie card:", finalUrl)
        }
      })
    })
  }

  // Initialize Coming Soon section
  function initializeComingSoon(movies) {
    const movieGrid = document.querySelector(".movie-grid")
    if (!movieGrid) return

    movieGrid.innerHTML = "" // Clear existing content

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
  }

  
  // Initialize Recommendations section
  function initializeRecommendations(movies) {
    const recommendationGrid = document.querySelector(".recommendation-grid")
    if (!recommendationGrid) return

    recommendationGrid.innerHTML = "" // Clear existing content

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

  // Initialize Swiper
  function initializeSwiper() {
    if (typeof Swiper !== "undefined" && document.querySelector(".movie-carousel")) {
      const swiper = new Swiper(".movie-carousel", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        },
      })
    }
  }
})
