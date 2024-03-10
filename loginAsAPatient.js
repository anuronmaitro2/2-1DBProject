let isLoggedIn = false;
let patientIdGlobal = 0;
const login = async () => {
  const username= document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Check if patient ID is not empty
  if (username.trim() !== "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password}),
    };
    try {
      const url = `http://localhost:3000/loginAsAPatient`;
      console.log(url);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const patientInfo = await response.json();
          console.log(patientInfo);
          // Display patient information
          isLoggedIn = true;
          patientIdGlobal = patientInfo[0].PATIENT_ID;
          console.log(patientIdGlobal);
          const patientId = patientInfo[0].PATIENT_ID;
          console.log(patientId);
          //give the patient id to the dashboardPatient.html
          //pass as routee parameter
          window.location.href = `dashboardPatient.html?patientId=${patientId}`;
         
        } else {
          // Handle the case when the response is not JSON
          console.error("Unexpected response format: Not JSON");
        }
      } else {
        // Handle the case when the response status is not OK
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

