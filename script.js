
"use strict";

// Information about opportunities at Twin Cities Animal Rescue.
const opportunities = [
    {
        id: "volunteer",
        title: "General Volunteering",
        description: "Help care for rescued animals, support daily activities, and assist with community outreach."
    },
    {
        id: "foster",
        title: "Foster Care",
        description: "Provide a temporary, safe home for rescued animals while they wait for permanent adoption."
    },
    {
        id: "adoption",
        title: "Adoption Events",
        description: "Help organize adoption events and introduce rescued animals to potential adopters."
    }
];

// Settings for saving a visitor's choice.
const storageSettings = {
    key: "tcarSelectedOpportunity"
};

// Find the selected opportunity in our array.
function findOpportunity(id) {
    return opportunities.find(function(opportunity) {
        return opportunity.id === id;
    });
}

// Display information without reloading the page.
function displayOpportunity(id) {
    const result = document.getElementById("opportunity-result");
    const opportunity = findOpportunity(id);

    result.replaceChildren();

    if (!opportunity) {
        const message = document.createElement("p");
        message.textContent = "Please select an opportunity first.";
        result.appendChild(message);
        return;
    }

    const heading = document.createElement("h3");
    heading.textContent = opportunity.title;

    const description = document.createElement("p");
    description.textContent = opportunity.description;

    const link = document.createElement("a");
    link.href = "contact.html";
    link.textContent = "Contact us about this opportunity";

    result.append(heading, description, link);
}

// Save the selection in the browser.
function saveOpportunity(id) {
    localStorage.setItem(storageSettings.key, id);
}

// Restore the visitor's previous selection.
function restoreOpportunity() {
    const savedId = localStorage.getItem(storageSettings.key);
    const selector = document.getElementById("opportunity-choice");

    if (savedId && findOpportunity(savedId)) {
        selector.value = savedId;
        displayOpportunity(savedId);
    }
}

// Set up the interactive feature.
function initializeOpportunitySelector() {
    const selector = document.getElementById("opportunity-choice");
    const button = document.getElementById("show-opportunity");

    if (!selector || !button) {
        return;
    }

    button.addEventListener("click", function() {
        const selectedId = selector.value;

        displayOpportunity(selectedId);

        if (findOpportunity(selectedId)) {
            saveOpportunity(selectedId);
        }
    });

    restoreOpportunity();
}

initializeOpportunitySelector();



// Touchstone 4: Contact form validation

// Display or clear an error beside a form field.
function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
}

// Check the form and display specific error messages.
function validateInterestForm() {
    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const availability = document.getElementById("availability").value;
    const experience = document.getElementById("experience").value;
    const message = document.getElementById("message").value.trim();
    const selectedInterest = document.querySelector(
        'input[name="interest"]:checked'
    );

    let isValid = true;

    // Check the visitor's name.
    let nameError = "";

    if (name.length === 0) {
        nameError = "Please enter your full name.";
    } else if (name.length < 2) {
        nameError = "Your name must contain at least 2 characters.";
    }

    showFieldError("full-name", "name-error", nameError);
    if (nameError) isValid = false;

    // Check the email address.
    let emailError = "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailError = "Please enter your email address.";
    } else if (!emailPattern.test(email)) {
        emailError = "Please enter a valid email address.";
    }

    showFieldError("email", "email-error", emailError);
    if (emailError) isValid = false;

    // Check the selected area of interest.
    const interestError = document.getElementById("interest-error");

    interestError.textContent = selectedInterest
        ? ""
        : "Please select an area of interest.";

    if (!selectedInterest) isValid = false;

    // Check availability.
    const availabilityError = availability
        ? ""
        : "Please select your availability.";

    showFieldError(
        "availability",
        "availability-error",
        availabilityError
    );

    if (availabilityError) isValid = false;

    // Check experience.
    const experienceError = experience
        ? ""
        : "Please select your experience level.";

    showFieldError(
        "experience",
        "experience-error",
        experienceError
    );

    if (experienceError) isValid = false;

    // Check the message.
    let messageError = "";

    if (!message) {
        messageError = "Please describe your interest.";
    } else if (message.length < 10) {
        messageError = "Your message must contain at least 10 characters.";
    }

    showFieldError("message", "message-error", messageError);
    if (messageError) isValid = false;

    return isValid;
}

// Initialize validation on the Contact Us page.
function initializeInterestForm() {
    const form = document.getElementById("interest-form");

    // Do nothing on pages without the contact form.
    if (!form) {
        return;
    }

    const status = document.getElementById("form-status");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        status.textContent = "";

        if (validateInterestForm()) {
            status.textContent =
                "Your form entries are valid. This is a demonstration form, so no information was sent.";
        } else {
            status.textContent =
                "Please correct the highlighted fields and try again.";
        }
    });

    // Clear messages when the form is reset.
    form.addEventListener("reset", function() {
        const errorMessages = form.querySelectorAll(".error-message");

        errorMessages.forEach(function(error) {
            error.textContent = "";
        });

        const fields = form.querySelectorAll("[aria-invalid]");

        fields.forEach(function(field) {
            field.removeAttribute("aria-invalid");
        });

        status.textContent = "";
    });
}

initializeInterestForm();

// Touchstone 4: Remember the visitor's availability preference.

const availabilityStorage = {
    key: "tcarAvailabilityPreference"
};

function saveAvailabilityPreference() {
    const availability = document.getElementById("availability");

    if (availability) {
        localStorage.setItem(
            availabilityStorage.key,
            availability.value
        );
    }
}

function restoreAvailabilityPreference() {
    const availability = document.getElementById("availability");

    if (!availability) {
        return;
    }

    const savedValue = localStorage.getItem(
        availabilityStorage.key
    );

    const validOptions = Array.from(availability.options).map(
        function(option) {
            return option.value;
        }
    );

    if (savedValue && validOptions.includes(savedValue)) {
        availability.value = savedValue;
    }

    availability.addEventListener(
        "change",
        saveAvailabilityPreference
    );
}

restoreAvailabilityPreference();

// Clear the saved availability when the form is reset.
function initializeAvailabilityReset() {
    const form = document.getElementById("interest-form");

    if (!form) {
        return;
    }

    form.addEventListener("reset", function() {
        localStorage.removeItem(availabilityStorage.key);
    });
}

initializeAvailabilityReset();
