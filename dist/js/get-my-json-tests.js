function addJsonTestCard(test) {
  const myTests = document.getElementById("myJsonTests");
  // console.log(test);
  // Create a new card for test
  const col = document.createElement("div");
  col.className = "col-md-3";

  const card = document.createElement("div");
  card.className = "card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header fs-5";
  cardHeader.innerText = test.name;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardLink = document.createElement("a");
  cardLink.className = "btn btn-primary";
  cardLink.href = test.downloadLink;
  cardLink.download = true;
  cardLink.innerText = "Download test";

  // Populate the card with the test data
  cardBody.appendChild(cardLink);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  col.appendChild(card);

  myTests.appendChild(col);
}

async function getMyJsonTests() {
  const myTests = document.getElementById("myJsonTests");
  try {
    const response = await fetch("/api/test-to-json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If response is not ok, throw an error
      throw new Error(`Error: ${response.statusText}`);
    }

    const tests = await response.json();
    // Check if there are any tests
    if (tests.length === 0) {
      myTests.innerHTML = "<p>No tests available at the moment.</p>";
      return;
    }

    // console.log(tests);
    tests.forEach(addJsonTestCard);
  } catch (err) {
    console.error("Error fetching tests:", err);
    myTests.innerHTML = `<p class="text-danger">There was an error. Please reload</p>`;
  }
}

document.addEventListener("DOMContentLoaded", getMyJsonTests);
