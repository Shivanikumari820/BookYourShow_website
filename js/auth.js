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
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")


//Har button ke liye loop chala rahe hain. ,Jab button pe click ho, tab yeh code chalega.
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling
      const icon = this.querySelector("i")


//Agar password chhupa hua hai to usse dikha do aur icon badal do
      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {                                               //Aur agar password visible hai to wapas chhupa do aur icon badal do.
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Password strength meter
  const passwordInput = document.getElementById("password")
  const strengthMeter = document.querySelector(".strength-meter-fill")
  const strengthText = document.querySelector(".strength-text span")

  if (passwordInput && strengthMeter && strengthText) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      let strength = 0

//Password ki length, capital/lower case, numbers, special characters check kar ke strength badhate hain.----->>>>>>>.      
      // Check password length
      if (password.length >= 8) {
        strength += 1
      }

      // Check for mixed case
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1
      }

      // Check for numbers
      if (password.match(/\d/)) {
        strength += 1
      }

      // Check for special characters
      if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1
      }

      // Update strength meter
      strengthMeter.setAttribute("data-strength", Math.min(3, strength))

      // Update strength text
      const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
      strengthText.textContent = strengthLabels[Math.min(3, strength)]
    })
  }

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Utility: Save all users
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Utility: Show toast (assume defined elsewhere)
  function showToast(message, type = "info") {
    if (window.showToast) window.showToast(message, type);
    else alert(`${type.toUpperCase()}: ${message}`);
  }

  // 🧾 Signup Form
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
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }

      const users = getUsers();
      const userExists = users.find((user) => user.email === email);

      if (userExists) {
        showToast("Email already registered. Please login instead.", "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }

      const newUser = {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password,
      };

      users.push(newUser);
      saveUsers(users);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUserEmail", email);
      localStorage.setItem("userName", newUser.name);

      showToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  }

  // 🔐 Login Form
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

      const users = getUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        showToast("User not found. Please sign up.", "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }

      if (user.password !== password) {
        showToast("Incorrect password. Please try again.", "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUserEmail", user.email);
      localStorage.setItem("userName", user.name);

      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  }

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
      } else {
        // If user exists, show a new form to input new password
        forgotForm.innerHTML = `
             <h3>Reset Password</h3>
             <p>Enter your new password below:</p>
             <input type="password" id="new-password" placeholder="New Password" required style="color: black;" />
             <input type="password" id="confirm-new-password" placeholder="Confirm New Password" required style="color: black;" />
             <button type="submit" class="btn btn-primary">Reset Password</button>
        `;

        forgotForm.querySelector("button").addEventListener("click", function () {
          const newPassword = document.getElementById("new-password").value;
          const confirmNewPassword = document.getElementById("confirm-new-password").value;

          // Check if both passwords match
          if (newPassword !== confirmNewPassword) {
            showToast("Passwords do not match. Please try again.", "error");
          } else {
            // Update the user's password
            user.password = newPassword;
            saveUsers(users);
            showToast("Password reset successfully! You can now log in with the new password.", "success");

            // Redirect user to login page
            setTimeout(() => {
              window.location.href = "login.html";
            }, 1500);
          }
        });
      }
    }, 1500);
  });
}


  // Display user name after page load
  const userNameDisplay = document.getElementById("user-name-display");
  const storedUserName = localStorage.getItem("userName");
  if (storedUserName && userNameDisplay) {
    userNameDisplay.textContent = storedUserName;
  }

  // 🚪 Redirect if already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (
    isLoggedIn &&
    (window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html"))
  ) {
    window.location.href = "index.html";
  }
});