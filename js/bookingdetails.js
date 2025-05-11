document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#bookings-table tbody")
  const currentUser = localStorage.getItem("currentUser") || "guest"
  const bookings = JSON.parse(localStorage.getItem("userBookings")) || []

  const userBookings = bookings
    .map((b, i) => ({ ...b, actualIndex: i }))
    .filter(b => b.user === currentUser)

  if (userBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No bookings found.</td></tr>`
    return
  }

  userBookings.forEach((booking) => {
    const row = document.createElement("tr")

    row.innerHTML = `
      <td>${booking.movieTitle}</td>
      <td>${booking.seats.join(", ")}</td>
      <td>₹${booking.totalAmount}</td>
      <td>${new Date(booking.date).toLocaleString()}</td>
      <td><button data-index="${booking.actualIndex}">Delete</button></td>
    `

    tableBody.appendChild(row)
  })

  // Handle delete
  tableBody.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.dataset.index
      bookings.splice(index, 1)
      localStorage.setItem("userBookings", JSON.stringify(bookings))
      location.reload()
    }
  })
})
