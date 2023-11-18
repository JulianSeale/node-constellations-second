document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const form = document.getElementById('form');
    const submitButton = document.getElementById('submitButton');
    const updateButton = document.getElementById('updateButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const imageInput = document.getElementById('imageInput'); 
  
    let editingConstellationId = null;
    
    
    addButton.addEventListener('click', () => {
      form.style.display = 'block';
      submitButton.style.display = 'block';
      updateButton.style.display = 'none';
      deleteButton.style.display = 'none';
    });
  
    submitButton.addEventListener('click', async () => {
      try {
        const formData = new FormData(); // Use FormData to handle file uploads
        formData.append('name', document.getElementById('name').value);
        formData.append('year', document.getElementById('year').value);
        formData.append('myth', document.getElementById('myth').value);
        formData.append('culture', document.getElementById('culture').value);
        formData.append('appearance', document.getElementById('appearance').value);
        formData.append('distance_from_earth_miles', parseInt(document.getElementById('distance').value));
        formData.append('img', imageInput.files[0]); // Append the image file
  
        const response = await fetch('http://localhost:3000/api/constellations', {
          method: 'POST',
          body: formData, // Use the FormData object as the body
        });
  
        const result = await response.json();
  
        if (response.ok) {
          successMessage.textContent = result.message;
          successMessage.style.display = 'block';
        } else {
          errorMessage.textContent = result.error;
          errorMessage.style.display = 'block';
        }
  
        setTimeout(() => {
          successMessage.style.display = 'none';
          errorMessage.style.display = 'none';
        }, 3000);
  
        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    });

    function editContainer(card) {
      const containerId = card.dataset.containerId;
    
      // Fetch the details of the constellation from the server
      fetch(`http://localhost:3000/api/constellation/${containerId}`)
        .then(response => response.json())
        .then(constellation => {
          // Populate the form with the existing data for editing
          document.getElementById('name').value = constellation.name;
          document.getElementById('year').value = constellation.year;
          document.getElementById('myth').value = constellation.myth;
          document.getElementById('culture').value = constellation.culture;
          document.getElementById('appearance').value = constellation.appearance;
          document.getElementById('distance').value = constellation.distance_from_earth_miles;
    
          // Show the form for editing
          form.style.display = 'block';
          submitButton.style.display = 'none';
          updateButton.style.display = 'block';
          deleteButton.style.display = 'block';
    
          // Set the editingConstellationId for reference
          editingConstellationId = constellation.id;
        })
        .catch(error => console.error('Error:', error));
    }
 


    updateButton.addEventListener('click', async () => {
      try {
          // Prepare the data for the update request
          const formData = new FormData();
          formData.append('name', document.getElementById('name').value);
          formData.append('year', document.getElementById('year').value);
          formData.append('myth', document.getElementById('myth').value);
          formData.append('culture', document.getElementById('culture').value);
          formData.append('appearance', document.getElementById('appearance').value);
          formData.append('distance_from_earth_miles', parseInt(document.getElementById('distance').value));
          formData.append('img', imageInput.files[0]);

          // Send the update request to the server
          const response = await fetch(`http://localhost:3000/api/update-constellation/${editingConstellationId}`, {
              method: 'PUT',
              body: formData,
          });

          const result = await response.json();

          if (response.ok) {
              successMessage.textContent = result.message;
              successMessage.style.display = 'block';
          } else {
              errorMessage.textContent = result.error;
              errorMessage.style.display = 'block';
          }

          setTimeout(() => {
              successMessage.style.display = 'none';
              errorMessage.style.display = 'none';
          }, 3000);

          fetchData(); // Fetch and render the updated data
      } catch (error) {
          console.error('Error:', error);
      }
  });
      

 // Function to delete a container
 function deleteContainer(card) {
  const containerId = card.dataset.containerId;

  const userConfirmed = window.confirm('Are you sure you want to delete this constellation?');

  if (userConfirmed) {
      // If the user confirms, proceed with the deletion
      fetch(`http://localhost:3000/api/delete-constellation/${containerId}`, {
          method: 'DELETE',
      })
          .then(response => response.json())
          .then(result => {
              console.log(result.message);
              fetchData(); // After deleting, fetch and render the data to update the view
          })
          .catch(error => console.error('Error:', error));
  }

  fetch(`http://localhost:3000/api/delete-constellation/${containerId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(result => {
      console.log(result.message);
      fetchData(); // After deleting, fetch and render the data to update the view
    })
    .catch(error => console.error('Error:', error));

} 
  
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/constellations');
        const data = await response.json();
        renderData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    function renderData(data) {
      const app = document.getElementById('app');
      app.innerHTML = '';
  
      data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.containerId = item.id;
        card.innerHTML = `
          <h3>${item.name}</h3>
          <p><strong>Year:</strong> ${item.year}</p>
          <p><strong>Myth:</strong> ${item.myth}</p>
          <p><strong>Culture:</strong> ${item.culture}</p>
          <p><strong>Appearance:</strong> ${item.appearance}</p>
          <p><strong>Distance from Earth:</strong> ${item.distance_from_earth_miles} miles</p>
          <img src="${item.img}" alt="${item.name}" /> <!-- Display the image -->
          <button class="editButton">Edit</button>
          <button class="deleteButton">Delete</button> 
        `;
        app.appendChild(card);

         // Add an event listener for the delete button inside the card
         const editButton = card.querySelector('.editButton');
    const deleteButton = card.querySelector('.deleteButton');
    editButton.addEventListener('click', () => editContainer(card));
    deleteButton.addEventListener('click', () => deleteContainer(card));

      });
    }

     // Show welcome popup for 2 seconds
  const welcomePopup = document.getElementById('welcome-popup');
  welcomePopup.style.display = 'block';
  setTimeout(() => {
    welcomePopup.style.display = 'none';
  }, 10000);
  
    // Initial fetch and render
    fetchData();
  });
  