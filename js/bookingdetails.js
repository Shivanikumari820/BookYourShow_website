document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#bookings-table tbody");
  const currentUser = localStorage.getItem("currentUser") || "guest";
  const bookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  // Filter bookings that belong to the current user
  const userBookings = bookings
    .map((booking, index) => ({ ...booking, actualIndex: index })) // Keep original index for deletion
    .filter(booking => booking.user === currentUser);

  // Display message if no bookings found
  if (userBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No bookings found.</td></tr>`;
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
      <td><button data-index="${booking.actualIndex}">Delete</button></td>
    `;

    tableBody.appendChild(row);
  });

  // Handle delete button click
  tableBody.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const index = event.target.dataset.index;
      bookings.splice(index, 1); // Remove booking from full list
      localStorage.setItem("userBookings", JSON.stringify(bookings)); // Save updated list
      location.reload(); // Refresh to update UI
    }
  });
});
