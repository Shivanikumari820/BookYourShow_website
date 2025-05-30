// API Service for CRUD operations
const API_URL = "data/movies.json"

// Fetch all movies
async function fetchMovies() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error("Failed to fetch movies")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching movies:", error)
    return { nowShowing: [], comingSoon: [], recommended: [] }
  }
}

// Fetch a single movie by ID
async function fetchMovieById(id) {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error("Failed to fetch movie")
    }
    const data = await response.json()

    // Search in all movie categories
    const allMovies = [...data.nowShowing, ...data.comingSoon, ...data.recommended]

    const movie = allMovies.find((movie) => movie.id === Number.parseInt(id))
    return movie || null
  } catch (error) {
    console.error("Error fetching movie:", error)
    return null
  }
}

// User Authentication Functions
function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // For demo purposes, accept any email/password
      if (email && password) {
        const user = {
          email,
          name: email.split("@")[0],
          isLoggedIn: true,
        }

        // Store in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error("Invalid email or password"))
      }
    }, 1000)
  })
}

function registerUser(userData) {
  return new Promise((resolve, reject) => {
    // In a real app, this would be an API call
    setTimeout(() => {
      if (userData.email && userData.password) {
        const user = {
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          isLoggedIn: true,
        }

        // Store in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error("Invalid user data"))
      }
    }, 1000)
  })
}

function logoutUser() {
  return new Promise((resolve) => {
    localStorage.removeItem("currentUser")
    resolve(true)
  })
}

function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser")   //Jo bhi user login hai, uska data fetch karta hai localStorage se.
  return userJson ? JSON.parse(userJson) : null          //Agar nahi mila, null return karta hai.
}

function resetPassword(email) {
  return new Promise((resolve, reject) => {
    // In a real app, this would send a reset email
    setTimeout(() => {
      if (email) {
        resolve({ success: true, message: "Password reset email sent" })
      } else {
        reject(new Error("Email is required"))
      }
    }, 1000)
  })
}

// Booking Functions
function saveBooking(bookingData) {
  return new Promise((resolve) => {
    // Get existing bookings or initialize empty array
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []

    // Add new booking with ID
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      date: new Date().toISOString(),
    }

    bookings.push(newBooking)

    // Save back to localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings))

    resolve(newBooking)
  })
}

function getUserBookings() {
  const user = getCurrentUser()
  if (!user) return []

  const bookings = JSON.parse(localStorage.getItem("bookings")) || []
  return bookings.filter((booking) => booking.userEmail === user.email)
}

// Export all functions      Saari functions ko API object mein group kiya gaya hai.
const API = {
  fetchMovies,
  fetchMovieById,
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
  saveBooking,
  getUserBookings,
}

// Make API available globally
window.API = API        // window.API se ye functions globally accessible ho jaate hain tumhare frontend JavaScript mein.



//agr ek hi user multiple booking krna chahe to kr skta h 

// ✅ saveBooking() – Same function, already supports multiple bookings
function saveBooking(bookingData) {
  return new Promise((resolve) => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []

    const newBooking = {
      id: Date.now(), // unique ID for each booking
      ...bookingData,
      date: new Date().toISOString(),
    }

    bookings.push(newBooking)
    localStorage.setItem("bookings", JSON.stringify(bookings))
    resolve(newBooking)
  })
}

// ✅ getUserBookings() – Get all bookings by the current user
function getUserBookings() {
  const user = getCurrentUser()
  if (!user) return []

  const bookings = JSON.parse(localStorage.getItem("bookings")) || []
  return bookings.filter((booking) => booking.userEmail === user.email)
}


// ✅ Booking Example (Use this when user clicks Proceed to Pay)
if (selectedSeats.length > 0) {
  const user = API.getCurrentUser()
  const movieId = new URLSearchParams(window.location.search).get("id")

  API.saveBooking({
    userEmail: user.email,
    movieId: movieId,
    movieTitle: document.querySelector(".movie-title")?.textContent,
    seats: selectedSeats.map((s) => s.id),
    totalAmount: total, // You calculate this in your updateSummary()
  }).then(() => {
    window.showToast("Booking successful!", "success")
    window.location.href = "payment-success.html"
  })
}


// Add this function to your API
function deleteBooking(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || []
  const updatedBookings = bookings.filter((booking) => booking.id !== bookingId)
  localStorage.setItem("bookings", JSON.stringify(updatedBookings))
}