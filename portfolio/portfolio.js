// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Simulate form submission (you can replace this with actual form handling logic)
    // Here, we're just showing a success message and resetting the form after 2 seconds
    document.getElementById("successMessage").style.display = "block";
    setTimeout(function() {
        document.getElementById("successMessage").style.display = "none";
        alert('form submitted successfully');
        document.getElementById("contactForm").reset();
    }, 2000); // Reset after 2 seconds (adjust timing as needed)
});

document.addEventListener("DOMContentLoaded", function() {
    const skillBoxes = document.querySelectorAll('.skill-box');

    skillBoxes.forEach(box => {
        box.addEventListener('mouseover', function() {
            const imageUrl = this.getAttribute('data-image');
            const beforeElement = window.getComputedStyle(this, '::before');
            
            // Create a new style element
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                .skill-box[data-image="${imageUrl}"]::before {
                    background-image: url('${imageUrl}');
                }
            `;

            // Append the style element to the head
            document.head.appendChild(styleElement);
        });
    });
});






