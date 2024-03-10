//search lab test
const searchLabTest = async () => {
    // if (!isLoggedIn) {
    //     console.error("User must be logged in to see pending lab tests.");
    //     return;
    // }
    //get the appointment id
    const appointmentId = document.getElementById("appointmentID").value;
    const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: parseInt(appointmentId) }),
    };
    
    try {
        const url = "http://localhost:3000/seePendingLabTests"; // Adjust the backend endpoint
        console.log(url);
        console.log(appointmentId);
        const response = await fetch(url, options);
        console.log(response);
        if (response.ok) {
        const labTest = await response.json();
        console.log(labTest);
        displayLabTest(labTest);
        } else {
        alert("Failed to search lab test!");
        }
    } catch (error) {
        console.error(error);
    }
    };
    const displayLabTest = (labTests) => {
        //display the lab test in the table
        //in every row, there should be a button to conduct the test
            // Display data in a table
    const table = document.createElement("table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow(0);

    // Add table headers
    for (const key in labTests[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    // Add table rows with data 
    //in every row, there should be a button to conduct the test
    for (const labTest of labTests) {
        const row = table.insertRow();
        for (const key in labTest) {
        const cell = row.insertCell();
        cell.textContent = labTest[key];
        }
        const cell = row.insertCell();
        const button = document.createElement("button");
        button.textContent = "Conduct Test";
        button.onclick = () => {
            conductLabTest(labTest);
        };
        cell.appendChild(button);
    }
    // Display the table
    document.getElementById("labTestTable").innerHTML = "";
    document.getElementById("labTestTable").appendChild(table);
    };

//conduct lab test
//open a new html and send the full lab test object
const conductLabTest = async (labTest) => {
    // Store the lab test object in local storage
    localStorage.setItem("labTest", JSON.stringify(labTest));
  
    // Open "conductLabTest.html" in a new window
    const newWindow = window.open("conductLabTest.html", '_blank');
  
    // Optionally, you can focus on the new window
    if (newWindow) {
      newWindow.focus();
    }
  };
  