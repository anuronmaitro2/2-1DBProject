// register.js

const submitForm = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const contactNo = document.getElementById("contactNo").value;
    const disease = document.getElementById("disease").value;
    const address = document.getElementById("address").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
        firstName,
        lastName,
        dob,
        gender,
        contactNo,
        disease,
        address,
        username,
        password,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const url = "http://localhost:3000/registerAsAPatient";
        const response = await fetch(url, options);
        console.log(response);
        const result = await response.json();
        console.log(result);

        if (response.ok) {
            // Registration successful
            alert(result.message); // You can customize this part (e.g., show a success message)
            document.getElementById("patientForm").reset();
            //go to login page
            window.location.href = "loginAsAPatient.html";
            

            // Optional: Redirect to another page or perform additional actions after registration
        } else {
            // Registration failed
            alert("UserName is Already Taken"); 
            document.getElementById("patientForm").reset();
            // You can customize this part (e.g., show an error message)
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again later.");
    }
};
