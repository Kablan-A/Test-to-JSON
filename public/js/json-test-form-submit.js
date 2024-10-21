const resultDiv = document.getElementById("result");
const jsonTestForm = document.getElementById("jsonTestForm");
const testFormBtn = document.getElementById("testFormBtn");

jsonTestForm.onsubmit = async (event) => {
  event.preventDefault(); // Prevent form from refreshing the page
  const formData = new FormData(jsonTestForm);
  const formDataObject = Object.fromEntries(formData.entries());
  console.log("form data: ", formDataObject);

  testFormBtn.classList.add("btn-secondary");
  try {
    const response = await fetch("/api/test-to-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify that the request body is JSON
      },
      body: JSON.stringify(formDataObject),
    });

    if (!response.ok) {
      // If response is not ok, throw an error
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    resultDiv.innerHTML = `<p>${result.message}</p><a href="${result.downloadLink}" download>Download your test</a>`;
  } catch (error) {
    // Display the error message
    resultDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
  testFormBtn.innerHTML = "Submit";
  testFormBtn.classList.remove("btn-secondary");
};
