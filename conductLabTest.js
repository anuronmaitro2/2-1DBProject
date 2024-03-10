// Retrieve lab test object from local storage
const labTest = JSON.parse(localStorage.getItem("labTest"));
console.log(labTest);

// Declare the displayLabTestOn function
const displayLabTestOn = (labTest) => {
  // Display the lab test in the table
  // In every row, there should be a button to conduct the test
  // Display data in a table
  const table = document.createElement("table");
  const thead = table.createTHead();
  const headerRow = thead.insertRow(0);

  // Add table headers
  for (const key in labTest) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }

  // Add table rows with data
  const row = table.insertRow();
  for (const key in labTest) {
    const cell = row.insertCell();
    cell.textContent = labTest[key];
  }
  // Add a button to each row naming conduct test
    const cell = row.insertCell();
    const button = document.createElement("button");
    button.textContent = "Conduct Test";
    button.onclick = () => {
      conductLabTestFinal(labTest);
    };

    cell.appendChild(button);

  // Display the table
  document.getElementById("labTestTable").innerHTML = "";
  document.getElementById("labTestTable").appendChild(table);

}

// Now, call the displayLabTestOn function
displayLabTestOn(labTest);

conductLabTestFinal = async (labTest) => {
    //create a input field maing result details for the result in the div naming ResultDiv
    const result = document.createElement("input");
    result.setAttribute("type", "text");
    result.setAttribute("id", "result");
    result.setAttribute("placeholder", "Enter Result");
    document.getElementById("ResultDiv").appendChild(result);
    //create a input field naming cost for the result in the div naming ResultDiv
    const cost = document.createElement("input");
    cost.setAttribute("type", "text");
    cost.setAttribute("id", "cost");
    cost.setAttribute("placeholder", "Enter Cost");
    document.getElementById("ResultDiv").appendChild(cost);
    //create a button naming submit for the result in the div naming ResultDiv
    const submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";
    document.getElementById("ResultDiv").appendChild(submit);
    //add event listener to submit button
    submit.addEventListener("click", async () => {
        //get the result and cost from the input fields
        const result = document.getElementById("result").value;
        const cost = document.getElementById("cost").value;
        //send result,cost,labTest to the backend
        const options = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ result: result, cost: cost, labTest: labTest }),
        };
        try {
            const url = "http://localhost:3000/conductLabTest"; // Adjust the backend endpoint
            console.log(url);
            console.log(result);
            console.log(cost);
            console.log(labTest);
            const response = await fetch(url, options);
            console.log(response);
            if (response.ok) {
            const labTest = await response.json();
            console.log(labTest);
            alert("Lab Test Conducted!");
            } else {
            alert("Failed to conduct lab test!");
            }
        } catch (error) {
            console.error(error);
        }
    });
};