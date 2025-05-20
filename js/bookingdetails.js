document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#bookings-table tbody");
  const currentUser = localStorage.getItem("currentUser") || "guest";
  const bookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  // Filter bookings that belong to the current user
  const userBookings = bookings
    .map((booking, index) => ({ ...booking, actualIndex: index }))
    .filter(booking => booking.user === currentUser);

  // Display message if no bookings found
  if (userBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No bookings found.</td></tr>`;
    return;
  }

  // Populate table with user's bookings
  userBookings.forEach((booking) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${booking.movieTitle}</td>
      <td>${booking.seats.join(", ")}</td>
      <td>₹${booking.totalAmount}</td>
      <td>${new Date(booking.date).toLocaleString()}</td>
      <td>
        <button class="decrease" data-index="${booking.actualIndex}">-</button>
        <span class="ticket-count">${booking.seats.length}</span>
        <button class="increase" data-index="${booking.actualIndex}">+</button>
      </td>
      <td><button class="delete" data-index="${booking.actualIndex}">Delete</button></td>
    `;

    tableBody.appendChild(row);
  });

  // Handle button clicks
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    const index = target.dataset.index;

    if (!index) return;

    const booking = bookings[index];

    if (target.classList.contains("delete")) {
      bookings.splice(index, 1);
    }

    else if (target.classList.contains("increase")) {
      // Add a new seat placeholder and increase price (assuming per seat ₹200)
      booking.seats.push(`Seat${booking.seats.length + 1}`);
      booking.totalAmount += 200;
    }

    else if (target.classList.contains("decrease")) {
      if (booking.seats.length > 1) {
        booking.seats.pop();
        booking.totalAmount -= 200;
      }
    }

    localStorage.setItem("userBookings", JSON.stringify(bookings));
    location.reload(); // Refresh to update UI
  });
});
