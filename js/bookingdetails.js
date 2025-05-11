 document.addEventListener("DOMContentLoaded", () => {
      const tableBody = document.querySelector("#bookings-table tbody");
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        window.location.href = "login.html";
        return;
      }

      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const userBookings = bookings.filter(booking => booking.userEmail === user.email);

      if (userBookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No bookings found.</td></tr>`;
        return;
      }

      userBookings.forEach((booking) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${booking.movieTitle}</td>
          <td>${booking.seats.join(", ")}</td>
          <td>₹${booking.totalAmount}</td>
          <td>${new Date(booking.date).toLocaleString()}</td>
          <td><button class="delete-button" data-id="${booking.id}">Delete</button></td>
        `;

        tableBody.appendChild(row);
      });

      tableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-button")) {
          const idToDelete = parseInt(e.target.dataset.id);
          const updatedBookings = bookings.filter(booking => booking.id !== idToDelete);
          localStorage.setItem("bookings", JSON.stringify(updatedBookings));
          e.target.closest("tr").remove();
        }
      });
    });