// document.addEventListener("DOMContentLoaded", () => {
//   // Toggle password visibility
//   const togglePasswordButtons = document.querySelectorAll(".toggle-password");

//   togglePasswordButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       const input = this.previousElementSibling;
//       const icon = this.querySelector("i");

//       if (input.type === "password") {
//         input.type = "text";
//         icon.classList.remove("fa-eye");
//         icon.classList.add("fa-eye-slash");
//       } else {
//         input.type = "password";
//         icon.classList.remove("fa-eye-slash");
//         icon.classList.add("fa-eye");
//       }
//     });
//   });

//   // Password strength meter
//   const passwordInput = document.getElementById("password");
//   const strengthMeter = document.querySelector(".strength-meter-fill");
//   const strengthText = document.querySelector(".strength-text span");

//   if (passwordInput && strengthMeter && strengthText) {
//     passwordInput.addEventListener("input", function () {
//       const password = this.value;
//       let strength = 0;

//       if (password.length >= 8) strength += 1;
//       if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
//       if (password.match(/\d/)) strength += 1;
//       if (password.match(/[^a-zA-Z\d]/)) strength += 1;

//       strengthMeter.setAttribute("data-strength", Math.min(3, strength));

//       const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
//       strengthText.textContent = strengthLabels[Math.min(3, strength)];
//     });
//   }

//   // Signup Form submission
//   const signupForm = document.getElementById("signup-form");
//   if (signupForm) {
//     signupForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const submitBtn = signupForm.querySelector('button[type="submit"]');
//       const originalBtnText = submitBtn.innerHTML;
//       submitBtn.innerHTML = '<div class="loader"></div>';
//       submitBtn.disabled = true;

//       const firstName = document.getElementById("first-name").value;
//       const lastName = document.getElementById("last-name").value;
//       const email = document.getElementById("email").value;
//       const phone = document.getElementById("phone").value;
//       const password = document.getElementById("password").value;
//       const confirmPassword = document.getElementById("confirm-password").value;
//       const terms = document.getElementById("terms").checked;

//       if (password !== confirmPassword) {
//         submitBtn.innerHTML = originalBtnText;
//         submitBtn.disabled = false;

//         if (window.showToast) {
//           window.showToast("Passwords do not match!", "error");
//         }
//         return;
//       }

//       setTimeout(() => {
//         const storedEmail = localStorage.getItem("userEmail");

//         if (storedEmail === email) {
//           submitBtn.innerHTML = originalBtnText;
//           submitBtn.disabled = false;

//           if (window.showToast) {
//             window.showToast("Email already registered. Please login instead.", "error");
//           }
//         } else {
//           localStorage.setItem("isLoggedIn", "true");
//           localStorage.setItem("userEmail", email);
//           localStorage.setItem("userPassword", password);
//           localStorage.setItem("userName", `${firstName} ${lastName}`);
//           localStorage.setItem("userPhone", phone);

//           if (window.showToast) {
//             window.showToast("Account created successfully! Redirecting...", "success");
//           }

//           setTimeout(() => {
//             window.location.href = "index.html";
//           }, 1500);
//         }
//       }, 1500);
//     });
//   }

//   // Login Form submission
//   const loginForm = document.getElementById("login-form");
//   if (loginForm) {
//     loginForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const submitBtn = loginForm.querySelector('button[type="submit"]');
//       const originalBtnText = submitBtn.innerHTML;
//       submitBtn.innerHTML = '<div class="loader"></div>';
//       submitBtn.disabled = true;

//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;

//       setTimeout(() => {
//         const storedEmail = localStorage.getItem("userEmail");
//         const storedPassword = localStorage.getItem("userPassword");

//         if (storedEmail === email && storedPassword === password) {
//           localStorage.setItem("isLoggedIn", "true");

//           if (window.showToast) {
//             window.showToast("Login successful! Redirecting...", "success");
//           }

//           setTimeout(() => {
//             window.location.href = "index.html";
//           }, 1500);
//         } else if (storedEmail === email) {
//           submitBtn.innerHTML = originalBtnText;
//           submitBtn.disabled = false;

//           if (window.showToast) {
//             window.showToast("Incorrect password. Please try again.", "error");
//           }
//         } else {
//           submitBtn.innerHTML = originalBtnText;
//           submitBtn.disabled = false;

//           if (window.showToast) {
//             window.showToast("User not found. Please sign up.", "error");
//           }
//         }
//       }, 1500);
//     });
//   }

//   // Forgot Password Form
//   const forgotForm = document.getElementById("forgot-password-form");
//   if (forgotForm) {
//     forgotForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const submitBtn = forgotForm.querySelector('button[type="submit"]');
//       const originalBtnText = submitBtn.innerHTML;
//       submitBtn.innerHTML = '<div class="loader"></div>';
//       submitBtn.disabled = true;

//       const email = document.getElementById("email").value;

//       setTimeout(() => {
//         const storedEmail = localStorage.getItem("userEmail");

//         if (storedEmail === email) {
//           forgotForm.innerHTML = `
//             <div class="text-center">
//               <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary); margin-bottom: var(--space-3);"></i>
//               <h3>Password Reset Email Sent</h3>
//               <p>We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.</p>
//               <a href="login.html" class="btn btn-primary btn-block" style="margin-top: var(--space-4);">Back to Login</a>
//             </div>
//           `;
//         } else {
//           submitBtn.innerHTML = originalBtnText;
//           submitBtn.disabled = false;

//           if (window.showToast) {
//             window.showToast("Email not found. Please check your email or sign up.", "error");
//           }
//         }
//       }, 1500);
//     });
//   }

//   // Display user name after page load
//   const userNameDisplay = document.getElementById("user-name-display");
//   const storedUserName = localStorage.getItem("userName");
//   if (storedUserName && userNameDisplay) {
//     userNameDisplay.textContent = storedUserName;
//   }

//   // Redirect if already logged in
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   if (
//     isLoggedIn &&
//     (window.location.pathname.includes("login.html") ||
//       window.location.pathname.includes("signup.html") ||
//       window.location.pathname.includes("forgot-password.html"))
//   ) {
//     window.location.href = "index.html";
//   }
// });



document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const icon = this.querySelector("i");

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  });

  // Password strength meter
  const passwordInput = document.getElementById("password");
  const strengthMeter = document.querySelector(".strength-meter-fill");
  const strengthText = document.querySelector(".strength-text span");

  if (passwordInput && strengthMeter && strengthText) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;

      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^a-zA-Z\d]/.test(password)) strength++;

      const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
      const index = Math.min(3, strength);

      strengthMeter.setAttribute("data-strength", index);
      strengthText.textContent = strengthLabels[index];
    });
  }

  // 🧾 Utilities
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
  const showToast = (msg, type = "info") =>
    window.showToast ? window.showToast(msg, type) : alert(`${type.toUpperCase()}: ${msg}`);

  // 🧾 Signup
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<div class="loader"></div>';
      submitBtn.disabled = true;

      const firstName = document.getElementById("first-name").value.trim();
      const lastName = document.getElementById("last-name").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        showToast("Passwords do not match!", "error");
        return resetButton();
      }

      const users = getUsers();
      if (users.find((user) => user.email === email)) {
        showToast("Email already registered. Please login instead.", "error");
        return resetButton();
      }

      const newUser = { name: `${firstName} ${lastName}`, email, phone, password };
      users.push(newUser);
      saveUsers(users);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUserEmail", email);
      localStorage.setItem("userName", newUser.name);

      showToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);

      function resetButton() {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 🔐 Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<div class="loader"></div>';
      submitBtn.disabled = true;

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      const user = getUsers().find((u) => u.email === email);

      if (!user) {
        showToast("User not found. Please sign up.", "error");
        return resetButton();
      }

      if (user.password !== password) {
        showToast("Incorrect password. Please try again.", "error");
        return resetButton();
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUserEmail", user.email);
      localStorage.setItem("userName", user.name);

      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);

      function resetButton() {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 🔁 Forgot Password
  const forgotForm = document.getElementById("forgot-password-form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = forgotForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<div class="loader"></div>';
      submitBtn.disabled = true;

      const email = document.getElementById("email").value.trim().toLowerCase();
      const users = getUsers();
      const user = users.find((u) => u.email === email);

      setTimeout(() => {
        if (!user) {
          showToast("Email not found. Please sign up.", "error");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          return;
        }

        forgotForm.innerHTML = `
          <h3>Reset Password</h3>
          <p>Enter your new password below:</p>
          <input type="password" id="new-password" placeholder="New Password" required style="color: black;" />
          <input type="password" id="confirm-new-password" placeholder="Confirm New Password" required style="color: black;" />
          <button type="submit" class="btn btn-primary">Reset Password</button>
        `;

        forgotForm.querySelector("button").addEventListener("click", () => {
          const newPassword = document.getElementById("new-password").value;
          const confirmNewPassword = document.getElementById("confirm-new-password").value;

          if (newPassword !== confirmNewPassword) {
            showToast("Passwords do not match. Please try again.", "error");
          } else {
            user.password = newPassword;
            saveUsers(users);
            showToast("Password reset successfully! You can now log in.", "success");

            setTimeout(() => (window.location.href = "login.html"), 1500);
          }
        });
      }, 1500);
    });
  }

  // 👋 Show user name
  const userNameDisplay = document.getElementById("user-name-display");
  const storedUserName = localStorage.getItem("userName");
  if (storedUserName && userNameDisplay) {
    userNameDisplay.textContent = storedUserName;
  }

  // 🚪 Auto redirect if already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAuthPage =
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("signup.html");

  if (isLoggedIn && isAuthPage) {
    window.location.href = "index.html";
  }
});
