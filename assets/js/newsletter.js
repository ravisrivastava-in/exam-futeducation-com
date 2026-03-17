document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".php-email-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const endpoint = form.dataset.endpoint;
      const emailInput = form.querySelector('input[name="email"]');

      const loading = form.querySelector(".loading");
      const errorMessage = form.querySelector(".error-message");
      const sentMessage = form.querySelector(".sent-message");

      // Reset UI
      loading.style.display = "block";
      errorMessage.style.display = "none";
      sentMessage.style.display = "none";

      const email = emailInput.value.trim();

      if (!email) {
        loading.style.display = "none";
        errorMessage.style.display = "block";
        errorMessage.innerText = "Please enter a valid email.";
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "newsletter",                
            email: email,
            source: "neet.futeducation.com"
          })
        });

        const result = await response.json();
        loading.style.display = "none";

        if (result.success) {
          sentMessage.style.display = "block";
          emailInput.value = "";
        } else {
          errorMessage.style.display = "block";
          errorMessage.innerText = result.message;
        }

      } catch (err) {
        loading.style.display = "none";
        errorMessage.style.display = "block";
        errorMessage.innerText = "Network error. Please try again.";
      }
    });
  });
});
