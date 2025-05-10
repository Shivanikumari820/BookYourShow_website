document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling
      const icon = this.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
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

  // Form submission
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const forgotForm = document.getElementById("forgot-password-form")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loader
      const submitBtn = loginForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<div class="loader"></div>'
      submitBtn.disabled = true

      // Get form data
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember")?.checked || false

      // Simulate API call with setTimeout
      setTimeout(() => {
        // Check if user exists in localStorage (for demo purposes)
        const storedEmail = localStorage.getItem("userEmail")
        const storedPassword = localStorage.getItem("userPassword")

        if (storedEmail === email && storedPassword === password) {
          // Login successful
          localStorage.setItem("isLoggedIn", "true")

          // Show success toast
          if (window.showToast) {
            window.showToast("Login successful! Redirecting...", "success")
          }

          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1500)
        } else if (storedEmail === email) {
          // Wrong password
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          if (window.showToast) {
            window.showToast("Incorrect password. Please try again.", "error")
          }
        } else {
          // User not found
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          if (window.showToast) {
            window.showToast("User not found. Please check your email or sign up.", "error")
          }
        }
      }, 1500)
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loader
      const submitBtn = signupForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<div class="loader"></div>'
      submitBtn.disabled = true

      // Get form data
      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const terms = document.getElementById("terms").checked

      // Validate passwords match
      if (password !== confirmPassword) {
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false

        if (window.showToast) {
          window.showToast("Passwords do not match!", "error")
        }
        return
      }

      // Simulate API call with setTimeout
      setTimeout(() => {
        // Check if email already exists
        const storedEmail = localStorage.getItem("userEmail")

        if (storedEmail === email) {
          // Email already exists
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          if (window.showToast) {
            window.showToast("Email already registered. Please login instead.", "error")
          }
        } else {
          // Store user data in localStorage (for demo purposes)
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userPassword", password)
          localStorage.setItem("userName", `${firstName} ${lastName}`)
          localStorage.setItem("userPhone", phone)

          // Show success toast
          if (window.showToast) {
            window.showToast("Account created successfully! Redirecting...", "success")
          }

          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1500)
        }
      }, 1500)
    })
  }

  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loader
      const submitBtn = forgotForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<div class="loader"></div>'
      submitBtn.disabled = true

      // Get form data
      const email = document.getElementById("email").value

      // Simulate API call with setTimeout
      setTimeout(() => {
        // Check if email exists
        const storedEmail = localStorage.getItem("userEmail")

        if (storedEmail === email) {
          // Email exists, show success message
          forgotForm.innerHTML = `
            <div class="text-center">
              <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary); margin-bottom: var(--space-3);"></i>
              <h3>Password Reset Email Sent</h3>
              <p>We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.</p>
              <a href="login.html" class="btn btn-primary btn-block" style="margin-top: var(--space-4);">Back to Login</a>
            </div>
          `
        } else {
          // Email not found
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          if (window.showToast) {
            window.showToast("Email not found. Please check your email or sign up.", "error")
          }
        }
      }, 1500)
    })
  }

  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  if (
    isLoggedIn &&
    (window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html") ||
      window.location.pathname.includes("forgot-password.html"))
  ) {
    // Redirect to home page if already logged in
    window.location.href = "index.html"
  }
})
