function validateEmailById(inputId, errorId = null) {
  const emailInput = document.getElementById(inputId);
  if (!emailInput) return false;

  const email = emailInput.value.trim();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    emailInput.classList.add("invalid-email");

    if (errorId) {
      document.getElementById(errorId).innerText = "Please enter a valid email address";
    }
    return false;
  }

  emailInput.classList.remove("invalid-email");

  if (errorId) {
    document.getElementById(errorId).innerText = "";
  }

  return true;
  const blockedDomains = ["tempmail.com", "mailinator.com"];

function isDisposable(email) {
  const domain = email.split("@")[1];
  return blockedDomains.includes(domain);
}
}


