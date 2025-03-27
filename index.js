document.addEventListener("DOMContentLoaded", function () {
    const navigationSections = document.querySelectorAll(".navigation");
    const sections = document.querySelectorAll("body > div"); // Select all main sections

    navigationSections.forEach((nav) => {
        const buttons = nav.querySelectorAll("button");
        buttons.forEach((button, index) => {
            button.addEventListener("click", function () {
                if (index < sections.length) {
                    sections[index].scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    });
});


function handleSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally
  
    // Get selected field
    const field = document.querySelector('input[name="field"]:checked');
    if (!field) {
      alert('Please select a field');
      return;
    }
    const selectedField = field.value;
    console.log('Selected field:', selectedField);
  
    // Determine the correct URL based on the selected field
    let url;
    if (selectedField === 'Engineering') {
      url = 'https://backend-for-my-app-38oa.onrender.com/api/ENGINEERING';
    } else if (selectedField === 'Medicine') {
      url = 'https://backend-for-my-app-38oa.onrender.com/api/MEDICINE';
    } else if (selectedField === 'Law') {
      url = 'https://backend-for-my-app-38oa.onrender.com/api/LAW';
    } else {
      alert('Invalid field selected');
      return;
    }
    console.log('Fetching from:', url);
  
    // Show a loading message
    const institutionsDiv = document.querySelector('.institutions');
    institutionsDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Loading institutions...</p>';
    institutionsDiv.style.display = 'block';
  
    // Fetch data from the determined URL
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        
        // Generate HTML for institutions
        let institutionsHTML = '';
        data.forEach(institution => {
          institutionsHTML += `
            <div class="institution-card">
              <img src="${institution.image}" alt="${institution.name}">
              <h3>${institution.name}</h3>
              <p class="country">${institution.country}</p>
              <p class="description">${institution.paragraph}</p>
              <p class="date">Date: ${institution.date}</p>
            </div>
          `;
        });
        
        // Display institutions
        if (institutionsDiv) {
          institutionsDiv.innerHTML = institutionsHTML;
          institutionsDiv.style.display = 'grid'; // Make div visible
        } else {
          console.error('Institutions div not found');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        institutionsDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">Failed to load institutions. Please try again later.</p>';
      });
  
    // Clear form
    document.querySelector('.answer').reset();
  }
  
  document.querySelector('.answer').addEventListener('submit', handleSubmit);

function submitComment(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get the form element
  const form = event.target;

  // Extract data from form inputs
  const profilePic = form.querySelector('.profile-pic').value;
  const name = form.querySelector('.name').value;
  const commentText = form.querySelector('.comment-text').value;

  if (!profilePic || !name || !commentText) {
    alert('Please fill in all fields');
    return;
  }

  // Generate a unique ID
  const newId = Date.now().toString(); 

  const commentData = {
    id: newId,
    image: profilePic,
    name: name,
    comment: commentText,
  };

  // Send POST request to JSON server
  fetch('https://backend-for-my-app-38oa.onrender.com/api/POSTS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    form.reset();
    alert('Comment submitted successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error submitting your comment. Please try again.');
  });
}

document.querySelector('.comment').addEventListener('submit', submitComment);


function fetchAndDisplayTestimonials() {
  // Get the testimonials container
  const testimonialsContainer = document.querySelector('.testimonials');
  if (!testimonialsContainer) {
    console.error('Testimonials container not found');
    return;
  }

  // Clear any existing content
  testimonialsContainer.innerHTML = '';

  // Fetch data from the local host
  fetch('https://backend-for-my-app-38oa.onrender.com/api/POSTS')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Process each testimonial
      data.forEach(testimonial => {
        // Create a div for each testimonial with class "one"
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'one'; // Changed from 'testimonial-item' to 'one'

        // Create image element
        const img = document.createElement('img');
        img.src = testimonial.image;
        img.alt = testimonial.name;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.borderRadius = '50%';
        img.style.marginBottom = '10px';

        // Create name element
        const name = document.createElement('h3');
        name.textContent = testimonial.name;
       

        // Create comment element
        const comment = document.createElement('p');
        comment.textContent = testimonial.comment;
        

        // Append elements to testimonial div
        testimonialDiv.appendChild(img);
        testimonialDiv.appendChild(name);
        testimonialDiv.appendChild(comment);

        // Append testimonial div to container
        testimonialsContainer.appendChild(testimonialDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching testimonials:', error);
      testimonialsContainer.innerHTML = '<p style="color: red;">Failed to load testimonials. Please try again later.</p>';
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayTestimonials);