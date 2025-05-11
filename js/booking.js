document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in from local storage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"   
  if (!isLoggedIn) {
    // Redirect to login page if not logged in or  redirect ke baad wapas yahi page pe lane ke liye URL save kar lo.
    localStorage.setItem("redirectAfterLogin", window.location.href)
    window.location.href = "login.html"
    return
  }

  // Get movie ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const movieId = urlParams.get("id")

  // Fetch movie data
  if (movieId) {
    fetchMovieDetails(movieId)
  }

  // Seat selection functionality
  const seatMap = document.querySelector(".seat-map")
  const ticketCountSelect = document.getElementById("ticket-count")
  const selectedSeatsDisplay = document.getElementById("selected-seats-display")
  const ticketSummary = document.getElementById("ticket-summary")
  const ticketPrice = document.getElementById("ticket-price")
  const gstAmount = document.getElementById("gst-amount")
  const totalAmount = document.getElementById("total-amount")
  const proceedPaymentBtn = document.getElementById("proceed-payment")

  let selectedSeats = []
// ✅ Remove seat limit, allow unlimited selection
let maxSeats = Infinity



  // Seat prices by category
  const seatPrices = {
    recliner: 650,
    prime: 350,
    classic: 250,
  }

  // Function to fetch movie details
  function fetchMovieDetails(id) {
    fetch("data/movies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        // Find the movie in nowShowing or recommended arrays
        const movie = [...data.nowShowing, ...data.recommended].find((m) => m.id.toString() === id)

        if (movie) {
          updateMovieInfo(movie)
        } else {
          console.error("Movie not found")
          if (window.showToast) {
            window.showToast("Movie information not found", "error")
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error)
        if (window.showToast) {
          window.showToast("Failed to load movie data", "error")
        }
      })
  }

  // Update movie info in the booking page
  function updateMovieInfo(movie) {
    const movieTitle = document.querySelector(".movie-title")
    const moviePoster = document.querySelector(".movie-poster img")
    const movieMeta = document.querySelector(".movie-meta")

    if (movieTitle) movieTitle.textContent = movie.title
    if (moviePoster) moviePoster.src = movie.image

    if (movieMeta) {
      movieMeta.innerHTML = `
        <span class="meta-item"><i class="fas fa-film"></i> IMAX</span>
        <span class="meta-item"><i class="fas fa-language"></i> English</span>
        <span class="meta-item"><i class="fas fa-clock"></i> ${movie.duration || "120 min"}</span>
      `
    }

    // Set the trailer button data attribute if it exists
    const trailerButtons = document.querySelectorAll(".watch-trailer")
    trailerButtons.forEach((button) => {
      if (movie.trailer) {
        button.setAttribute("data-trailer", movie.trailer)
      }
    })
  }

  // Generate seats for each row  = Yeh function dynamically HTML mein seats create karta hai — har category ke liye (recliner, prime, classic).
  function generateSeats() {
    if (!seatMap) return

    // Pre-booked seats (for demo purposes)
    const bookedSeats = ["A1", "A2", "B4", "B5", "C7", "D3", "D4", "E5", "F2", "G6", "H8"]

    // Generate recliner seats (rows A-B)
    const reclinerRows = seatMap.querySelectorAll(".seats.recliner")
    reclinerRows.forEach((row, rowIndex) => {
      const rowName = String.fromCharCode(65 + rowIndex) // A, B, ...
      for (let i = 1; i <= 8; i++) {
        const seatId = `${rowName}${i}`
        const seat = document.createElement("div")
        seat.className = `seat ${bookedSeats.includes(seatId) ? "booked" : "available"}`
        seat.dataset.id = seatId
        seat.dataset.category = "recliner"
        seat.dataset.price = seatPrices.recliner
        seat.textContent = i
        row.appendChild(seat)
      }
    })

    // Generate prime seats (rows C-E)
    const primeRows = seatMap.querySelectorAll(".seats.prime")
    primeRows.forEach((row, rowIndex) => {
      const rowName = String.fromCharCode(67 + rowIndex) // C, D, E, ...
      for (let i = 1; i <= 10; i++) {
        const seatId = `${rowName}${i}`
        const seat = document.createElement("div")
        seat.className = `seat ${bookedSeats.includes(seatId) ? "booked" : "available"}`
        seat.dataset.id = seatId
        seat.dataset.category = "prime"
        seat.dataset.price = seatPrices.prime
        seat.textContent = i
        row.appendChild(seat)
      }
    })

    // Generate classic seats (rows F-H)
    const classicRows = seatMap.querySelectorAll(".seats.classic")
    classicRows.forEach((row, rowIndex) => {
      const rowName = String.fromCharCode(70 + rowIndex) // F, G, H, ...
      for (let i = 1; i <= 10; i++) {
        const seatId = `${rowName}${i}`
        const seat = document.createElement("div")
        seat.className = `seat ${bookedSeats.includes(seatId) ? "booked" : "available"}`
        seat.dataset.id = seatId
        seat.dataset.category = "classic"
        seat.dataset.price = seatPrices.classic
        seat.textContent = i
        row.appendChild(seat)
      }
    })
  }

  // Handle seat selection  = ➡️ Jab seat pe click karo, toh select/deselect hota hai — max seat count ka dhyan rakha gaya hai.
  function handleSeatSelection(e) {
    if (!e.target.classList.contains("seat")) return
    if (e.target.classList.contains("booked")) return

    const seatId = e.target.dataset.id
    const seatPrice = Number.parseInt(e.target.dataset.price)

    if (e.target.classList.contains("selected")) {
      // Deselect seat
      e.target.classList.remove("selected")
      e.target.classList.add("available")
      selectedSeats = selectedSeats.filter((seat) => seat.id !== seatId)
    } else {
      // Select seat if not at max capacity
      if (selectedSeats.length < maxSeats) {
        e.target.classList.remove("available")
        e.target.classList.add("selected")
        selectedSeats.push({
          id: seatId,
          price: seatPrice,
        })
      } else {
        // Show toast notification
        if (window.showToast) {
          window.showToast(`You can only select ${maxSeats} seats`, "info")
        }
      }
    }

    updateSummary()
  }

  // Update ticket count   =  Dropdown se agar user ne ticket count change kiya, toh uske hisaab se extra selected seats hata dete hain.
  function updateTicketCount() {
     maxSeats = ticketCountSelect ? Number.parseInt(ticketCountSelect.value) : 2

    // If we have more selected seats than the new max, deselect the excess
    if (selectedSeats.length > maxSeats) {
      const excessSeats = selectedSeats.slice(maxSeats)
      excessSeats.forEach((seat) => {
        const seatElement = document.querySelector(`.seat[data-id="${seat.id}"]`)
        if (seatElement) {
          seatElement.classList.remove("selected")
          seatElement.classList.add("available")
        }
      })
      selectedSeats = selectedSeats.slice(0, maxSeats)
    }

    updateSummary()
  }

  // Update order summary
  function updateSummary() {
    if (!selectedSeatsDisplay || !ticketSummary || !ticketPrice || !gstAmount || !totalAmount || !proceedPaymentBtn)
      return

    // Update selected seats display
    if (selectedSeats.length === 0) {
      selectedSeatsDisplay.innerHTML = '<span class="no-seats">No seats selected</span>'
    } else {
      selectedSeatsDisplay.innerHTML = ""
      selectedSeats.forEach((seat) => {
        const seatElement = document.createElement("div")
        seatElement.className = "selected-seat"
        seatElement.textContent = seat.id
        selectedSeatsDisplay.appendChild(seatElement)
      })
    }

    // Calculate total ticket price
    const totalTicketPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

    // Update summary text
    ticketSummary.textContent = `${selectedSeats.length} Tickets`
    ticketPrice.textContent = `₹${totalTicketPrice}`

    // Calculate GST (18%)
    const convenienceFee = 60
    const gst = Math.round((totalTicketPrice + convenienceFee) * 0.18)
    gstAmount.textContent = `₹${gst}`

    // Calculate total amount
    const total = totalTicketPrice + convenienceFee + gst
    totalAmount.textContent = `₹${total}`

    // Enable/disable proceed button
    proceedPaymentBtn.disabled = selectedSeats.length === 0
    if (selectedSeats.length === 0) {
      proceedPaymentBtn.classList.add("disabled")
    } else {
      proceedPaymentBtn.classList.remove("disabled")
    }
  }

  // Initialize seat map
  generateSeats()

  // Add event listeners
  if (seatMap) {
    seatMap.addEventListener("click", handleSeatSelection)
  }

  if (ticketCountSelect) {
    ticketCountSelect.addEventListener("change", updateTicketCount)
  }

  if (proceedPaymentBtn) {
    proceedPaymentBtn.addEventListener("click", () => {
      if (selectedSeats.length === 0) return

      // In a real app, this would navigate to the payment page
      if (window.showToast) {
        window.showToast("Proceeding to payment...", "success")
      }

      // Simulate payment processing
      proceedPaymentBtn.disabled = true
      proceedPaymentBtn.innerHTML = '<div class="loader"></div>'

      setTimeout(() => {
        // Redirect to a success page or show success message
        window.location.href = "confirm.html"
      }, 2000)
    })
  }

  // Add CSS for dynamically created elements
  const style = document.createElement("style")
  style.textContent = `
        .seat.available {
            background-color: var(--navy-700);
            cursor: pointer;
        }
        
        .seat.selected {
            background-color: var(--crimson-600);
            cursor: pointer;
        }
        
        .seat.booked {
            background-color: var(--gray-600);
            cursor: not-allowed;
        }
        
        .selected-seat {
            background-color: var(--navy-800);
            color: white;
            padding: var(--spacing-1) var(--spacing-2);
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
        }
        
        .disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `
  document.head.appendChild(style)
})


//  Store Multiple Bookings in localStorageconst bookBtn = document.getElementById("book-btn")
 const bookBtn = document.getElementById("book-btn")

  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.")
        return
      }

      setTimeout(() => {
        const currentUser = localStorage.getItem("currentUser") || "guest"
        const movieTitle = document.querySelector(".movie-title")?.textContent || "Untitled"
        const selectedSeatIds = selectedSeats.map(seat => seat.id)
        const total = totalAmount.textContent.replace("₹", "")
        const bookingDate = new Date().toISOString()

        const newBooking = {
          user: currentUser,
          movieTitle,
          seats: selectedSeatIds,
          totalAmount: total,
          date: bookingDate,
        }

        const existingBookings = JSON.parse(localStorage.getItem("userBookings")) || []
        existingBookings.push(newBooking)
        localStorage.setItem("userBookings", JSON.stringify(existingBookings))

        window.location.href = "confirm.html"
      }, 2000)
    })
  }


/* NOTES --->>

Seat selection ki limit = #ticket-count dropdown mein selected value
(agar kuch bhi selected nahi hai, toh by default 2 seats allowed hain).

//Is tarah user sirf 1–6 tickets select kar sakta hai ,  to iski jgh
<select id="ticket-count">
  <option value="1">1 Ticket</option>
  <option value="2" selected>2 Tickets</option>
  <option value="3">3 Tickets</option>
  <option value="4">4 Tickets</option>
  <option value="5">5 Tickets</option>
  <option value="6">6 Tickets</option>
</select>


// Agar tum dynamically values generate karna chahte ho, toh JS mein aise likh sakte ho:
const ticketCountSelect = document.getElementById("ticket-count")
if (ticketCountSelect) {
  for (let i = 1; i <= 6; i++) {
    const option = document.createElement("option")
    option.value = i
    option.textContent = `${i} Ticket${i > 1 ? 's' : ''}`
    if (i === 2) option.selected = true // Default select 2
    ticketCountSelect.appendChild(option)
  }
}

*/