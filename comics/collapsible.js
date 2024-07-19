function initializeCollapsible() {
let coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");

    // Get the next sibling element
    let content = this.nextElementSibling;

    // Debugging: Check if content is found
    console.log("Clicked element:", this);
    console.log("Next sibling element:", content);

    // Handle case when content is null
    if (content && content.classList.contains("content")) {
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    } else {
      console.error("No content element found after:", this);
      // Optional: Provide feedback to the user or take alternative actions
    }
  });
}


// Accessible for screen readers and tab indexing.
function toggleAriaValues() {
  let button = document.getElementById("aboutMeButton");
  let element = document.getElementById("aboutMeContent");
  let contentLinks = element.querySelectorAll(".content-link, .dark-btn");

  if (button.getAttribute("aria-expanded") === "true") {
    button.setAttribute("aria-expanded", "false");
    element.setAttribute("aria-hidden", "true");
    contentLinks.forEach(function(link) {
      link.setAttribute("tabindex", "-1");
    });
  } else {
    button.setAttribute("aria-expanded", "true");
    element.setAttribute("aria-hidden", "false");
    contentLinks.forEach(function(link) {
      link.setAttribute("tabindex", "0");
    });
  }
}

document.getElementById("aboutMeButton").addEventListener("click", toggleAriaValues);
console.log('Collapsible initialized');
}
setTimeout(initializeCollapsible, 3500);