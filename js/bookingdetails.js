document.addEventListener("DOMContentLoaded", () => {
   const bookingTableBody = document.getElementById("booking-table-body");
const currentUserEmail = localStorage.getItem("loggedInUserEmail");
const userBookings = JSON.parse(localStorage.getItem("userBookings")) || [];

if (bookingTableBody && currentUserEmail) {
  const currentUserBookings = userBookings.filter(
    (booking) => booking.email === currentUserEmail
  );

  currentUserBookings.forEach((booking, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${booking.movieTitle}</td>
      <td>${booking.seats.join(", ")}</td>
      <td>₹${booking.totalAmount}</td>
      <td>${new Date(booking.date).toLocaleString()}</td>
      <td>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    bookingTableBody.appendChild(row);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const indexToDelete = parseInt(e.target.getAttribute("data-index"));
      const updatedBookings = currentUserBookings.filter(
        (_, i) => i !== indexToDelete
      );

      // Update all bookings with correct filter
      const remainingBookings = userBookings.filter(
        (booking) => booking.email !== currentUserEmail
      ).concat(updatedBookings);

      localStorage.setItem("userBookings", JSON.stringify(remainingBookings));
      location.reload();
      });
    }); // ✅ Correctly closed here
  }
});
