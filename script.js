function Strength(password) {
  let score = 0;
  
  // Length check
  if (password.length > 6) {
      score++;
  }
  if (password.length >= 12) {
      score++;
  }

  // Character type checks
  if (/[A-Z]/.test(password)) {
      score++;
  }
  if (/[a-z]/.test(password)) {
      score++;
  }
  if (/[0-9]/.test(password)) {
      score++;
  }
  if (/[\W_]/.test(password)) { // Checks for special characters
      score++;
  }

  // Combination checks
  if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[\W_]/.test(password)) {
      score++;
  }

  return score;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const container = document.querySelector(".container");
  const passwordInput = document.querySelector("#YourPassword");
  const show = document.querySelector(".show");

  form.addEventListener("submit", function (e) {
      e.preventDefault();
      let password = passwordInput.value;
      fetch('/password/save', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Password saved successfully');
          } else {
              alert('Error: ' + data.message);
          }
      })
      .catch(error => {
          alert('Error: ' + error.message);
      });
  });

  document.addEventListener("keyup", function (e) {
      let password = passwordInput.value;
      let strength = Strength(password);
      if (strength <= 2) {
          container.classList.add("weak");
          container.classList.remove("moderate");
          container.classList.remove("strong");
      } else if (strength >= 3 && strength <= 5) {
          container.classList.remove("weak");
          container.classList.add("moderate");
          container.classList.remove("strong");
      } else if (strength >= 6) {
          container.classList.remove("weak");
          container.classList.remove("moderate");
          container.classList.add("strong");
      }
  });

  show.addEventListener("click", function () {
      if (passwordInput.type === "password") {
          passwordInput.setAttribute("type", "text");
          show.classList.add("hide");
      } else {
          passwordInput.setAttribute("type", "password");
          show.classList.remove("hide");
      }
  });
});
