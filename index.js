


let applicationCount = 0;
const submittedApplications = [];

// Load submissions from localStorage when page loads
document.addEventListener("DOMContentLoaded", function() {
  const navigationSections = document.querySelectorAll(".navigation");
  const sections = document.querySelectorAll("body > div"); // Select all main sections

  navigationSections.forEach((nav) => {
    const buttons = nav.querySelectorAll("button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", function() {
        if (index < sections.length) {
          sections[index].scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });

  // Load saved applications
  const savedApplications = localStorage.getItem('submittedApplications');
  if (savedApplications) {
    submittedApplications.push(...JSON.parse(savedApplications));
    applicationCount = submittedApplications.length;
    if (document.getElementById('application-count')) {
      document.getElementById('application-count').textContent = applicationCount;
    }
  }

  fetchAndDisplayTestimonials();
});

function handleSubmit(event) {
  event.preventDefault();

  const field = document.querySelector('input[name="field"]:checked');
  if (!field) {
    alert('Please select a field');
    return;
  }
  const selectedField = field.value;

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

  const institutionsDiv = document.querySelector('.institutions');
  institutionsDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Loading institutions...</p>';
  institutionsDiv.style.display = 'block';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let institutionsHTML = '';
      data.forEach(institution => {
        institutionsHTML += `
          <div class="institution-card">
            <img src="${institution.image}" alt="${institution.name}">
            <h3>${institution.name}</h3>
            <p class="country">${institution.country}</p>
            <p class="description">${institution.paragraph}</p>
            <p class="date">Date: ${institution.date}</p>
            <button class="apply-btn">Apply</button>
          </div>
        `;
      });
      
      if (institutionsDiv) {
        institutionsDiv.innerHTML = institutionsHTML;
        institutionsDiv.style.display = 'grid';
        
        // Add click event listeners to apply buttons
        institutionsDiv.querySelectorAll('.apply-btn').forEach(button => {
          button.addEventListener('click', function() {
            const card = this.closest('.institution-card');
            if (card) {
              const institution = {
                name: card.querySelector('h3').textContent,
                country: card.querySelector('.country').textContent,
                paragraph: card.querySelector('.description').textContent,
                date: card.querySelector('.date').textContent.split(': ')[1]
              };
              
              showInstitutionDetails(institution);
            }
          });
        });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      institutionsDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">Failed to load institutions. Please try again later.</p>';
    });

  document.querySelector('.answer').reset();
}
document.querySelector('.answer').addEventListener('submit', handleSubmit);

function submitComment(event) {
  event.preventDefault();

  const form = event.target;

  const profilePic = form.querySelector('.profile-pic').value;
  const name = form.querySelector('.name').value;
  const commentText = form.querySelector('.comment-text').value;

  if (!profilePic || !name || !commentText) {
    alert('Please fill in all fields');
    return;
  }

  const newId = Date.now().toString();

  const commentData = {
    id: newId,
    image: profilePic,
    name: name,
    comment: commentText,
  };

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
  const testimonialsContainer = document.querySelector('.testimonials');
  if (!testimonialsContainer) {
    console.error('Testimonials container not found');
    return;
  }

  testimonialsContainer.innerHTML = '';

  fetch('https://backend-for-my-app-38oa.onrender.com/api/POSTS')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data.forEach(testimonial => {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'one';

        const img = document.createElement('img');
        img.src = testimonial.image;
        img.alt = testimonial.name;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.borderRadius = '50%';
        img.style.marginBottom = '10px';

        const name = document.createElement('h3');
        name.textContent = testimonial.name;

        const comment = document.createElement('p');
        comment.textContent = testimonial.comment;

        testimonialDiv.appendChild(img);
        testimonialDiv.appendChild(name);
        testimonialDiv.appendChild(comment);

        testimonialsContainer.appendChild(testimonialDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching testimonials:', error);
      testimonialsContainer.innerHTML = '<p style="color: red;">Failed to load testimonials. Please try again later.</p>';
    });
}

function showInstitutionDetails(institution) {
  const informationDiv = document.querySelector('.information');
  informationDiv.innerHTML = `
    <div class="institution-details">
        <div class="institution-header">
            <div class="institution-info-left">
                <h3>${institution.name}</h3>
                <div class="institution-meta">
                    <p><strong>Country:</strong> ${institution.country}</p>
                    <p><strong>Deadline:</strong> ${institution.date}</p>
                </div>
            </div>
        </div>
        <div class="institution-description">
            <p><strong>Description:</strong> ${institution.paragraph}</p>
        </div>
        
        <div class="application-form">
            <h4>Apply for Scholarship</h4>
            <form class="scholarship-application">
                <div class="input">
                    <label for="applicant-name">Your Name</label>
                    <input type="text" id="applicant-name" required>
                </div>
                <div class="input">
                    <label for="how-hear">How did you hear about us</label>
                    <input type="text" id="how-hear" required>
                </div>
                <div class="input">
                    <label for="about-yourself">About Yourself</label>
                    <textarea id="about-yourself" rows="5" required></textarea>
                </div>
                <div class="input">
                    <label for="why-consider">Why should we consider you for this application</label>
                    <textarea id="why-consider" rows="5" required></textarea>
                </div>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    </div>
  `;
  
  const applicationForm = informationDiv.querySelector('.scholarship-application');
  applicationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const applicantName = this.querySelector('#applicant-name').value;
    const howHear = this.querySelector('#how-hear').value;
    const aboutYourself = this.querySelector('#about-yourself').value;
    const whyConsider = this.querySelector('#why-consider').value;
    
    const application = {
      id: Date.now(),
      institutionName: institution.name,
      applicantName,
      howHear,
      aboutYourself,
      whyConsider,
      dateSubmitted: new Date().toISOString()
    };
    
    submittedApplications.push(application);
    applicationCount++;
    if (document.getElementById('application-count')) {
      document.getElementById('application-count').textContent = applicationCount;
    }
    
    // Save to localStorage
    localStorage.setItem('submittedApplications', JSON.stringify(submittedApplications));
    
    alert('Application submitted successfully!');
    applicationForm.reset();
  });
}

document.getElementById('check-responses').addEventListener('click', function() {
  if (submittedApplications.length === 0) {
    alert('You have not submitted any applications yet.');
    return;
  }
  
  let applicationsHTML = '<h3>Submitted Applications</h3><ul>';
  
  submittedApplications.forEach(app => {
    applicationsHTML += `
      <li>
          <strong>Institution:</strong> ${app.institutionName}<br>
          <strong>Applicant:</strong> ${app.applicantName}<br>
          <strong>Status:</strong> Processing...<br>
          <strong>Date Submitted:</strong> ${new Date(app.dateSubmitted).toLocaleDateString()}
          <button class="delete-btn" data-id="${app.id}">Delete</button>
      </li>
    `;
  });
  
  applicationsHTML += '</ul>';
  
  const responseDiv = document.createElement('div');
  responseDiv.innerHTML = applicationsHTML;
  responseDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  responseDiv.style.color = 'white';
  responseDiv.style.padding = '20px';
  responseDiv.style.borderRadius = '10px';
  responseDiv.style.maxWidth = '600px';
  responseDiv.style.margin = '20px auto';
  
  document.querySelector('.application-tracking').appendChild(responseDiv);
  
  // Add delete functionality
  responseDiv.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const appId = parseInt(this.getAttribute('data-id'));
      const index = submittedApplications.findIndex(app => app.id === appId);
      if (index !== -1) {
        submittedApplications.splice(index, 1);
        applicationCount--;
        if (document.getElementById('application-count')) {
          document.getElementById('application-count').textContent = applicationCount;
        }
        localStorage.setItem('submittedApplications', JSON.stringify(submittedApplications));
        alert('Application deleted successfully!');
        // Refresh the display
        document.querySelector('.application-tracking').innerHTML = '';
        this.click();
      }
    });
  });
});














