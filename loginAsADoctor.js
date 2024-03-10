let isLoggedIn = false;
const login = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Check if doctor ID is not empty
  if (username.trim() !== "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };
    try {
      const url = `http://localhost:3000/loginAsADoctor`;
      console.log(url);
      //console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const doctorInfo = await response.json();
          console.log(doctorInfo);
          isLoggedIn = true;
          const doctorId = doctorInfo[0].DOCTORID;
          console.log(doctorId);
          // Display doctor information
          if (isLoggedIn) {
            window.location.href = `dashboardDoctor.html?doctorId=${doctorId}`;
          }
          else{
            alert("Please login first");
          }
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

