// showLoaderSymbol function
function showLoaderSymbol() {
    document.getElementById('spinnerBorder').style.display = "inline-block";
}
// hideLoaderSymbol function
function hideLoaderSymbol() {
    document.getElementById('spinnerBorder').style.display = "none";
}

// goToDashboardPage function
function goToDashboardPage() {
    window.location.href = "/dashboard/index.html";
}

// target back button
var backButton = document.getElementById('backButton');
backButton.addEventListener('click', function () {
    goToDashboardPage();
})

// logoutUser function
function logoutUser() {
    localStorage.removeItem('loginuser');
    window.location.href = '/login/index.html';
}

var logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function () {
    logoutUser();
})

var allProducts = [];

// pagination limit
var rowPerPage = 5;
var startPage = 0;
var endPage = rowPerPage;


var fullElement = `
        <thead id="thead">
            <tr id="theadTr">
                <th>S.no</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody id="tbody">
            
        </tbody>
`

// fetchData function
async function fetchData() {
    const url = "https://dummyjson.com/product";
    try {
        showLoaderSymbol();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        // convert the data in to json
        var convertJson = await response.json()
        allProducts = convertJson.products;

        // call the hideLoaderSymbol function
        hideLoaderSymbol();

        var spinnerBorder = document.getElementById('spinnerBorder');

        if (spinnerBorder.style.display === "none") {
            // target mainTable
            var mainTable = document.getElementById('mainTable');

            // create table
            var createTable = document.createElement('table')
            createTable.setAttribute('id', 'table');

            // append table in to mainTable
            mainTable.appendChild(createTable)

            // target table
            var table = document.getElementById('table');
            table.innerHTML = fullElement;
            console.log(allProducts, "==>");
            appendElement(allProducts);
        }

    } catch (error) {
        alert("Please Check Url");
    }
}

// paginationConcept function

function paginationConcept() {
    var pagination = document.getElementById('pagination');
    pagination.innerHTML = "";
    // console.log(allProducts.length);


    var totalPages = Math.ceil(allProducts.length / rowPerPage);

    let currentPage = Math.floor(startPage / rowPerPage) + 1;

    // create previous button
    var createPreviousButton = document.createElement('button');
    createPreviousButton.innerText = "Previous";

    createPreviousButton.disabled = currentPage === 1;

    createPreviousButton.addEventListener('click', function () {
        if (currentPage > 1) {
            startPage -= rowPerPage;
            endPage = startPage + rowPerPage;
            fetchData();
            paginationConcept();
        }
    });

    pagination.appendChild(createPreviousButton);

    // loop the pagination number
    for (let index = 1; index <= totalPages; index++) {
        // create a pagination button
        var createButton = document.createElement("button");
        createButton.innerText = index;
        createButton.setAttribute('id', index);

        // apply active functionality
        if (index === currentPage) {
            createButton.classList.add("activeButton");
            createButton.style.backgroundColor = "#4CAF50";
            createButton.style.color = "#fff";
        }

        createButton.addEventListener('click', function () {
            var indexNumber = this.getAttribute('id')
            // console.log(indexNumber);
            document.getElementById('searchInput').value = "";

            startPage = (indexNumber - 1) * rowPerPage;
            endPage = startPage + rowPerPage;
            fetchData();
            paginationConcept();
        });

        pagination.appendChild(createButton);
    }

    // create next button
    var createNextButton = document.createElement('button');
    createNextButton.innerText = "Next";

    createNextButton.disabled = currentPage === totalPages;

    createNextButton.addEventListener('click', function () {
        if (currentPage < totalPages) {
            startPage += rowPerPage;
            endPage = startPage + rowPerPage;
            fetchData();
            paginationConcept();
        }
    });

    pagination.appendChild(createNextButton);
}


// Append element function
function appendElement(allProducts) {
    // target tbody
    document.getElementById('tbody').innerHTML = "";

    // foreach the products and append
    allProducts.slice(startPage, endPage).forEach((element, index) => {
        var trElement = `
            <tr id="tbodyTr">
                <td>${element.id}.</td>
                <td>
                    <div class="productName">${element.title}</div>
                    <div class="productBrand">${(element.brand) ? element.brand : "Not Available"}</div>
                </td>
                <td class="price">
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                    ${element.price}
                </td>
                <td>
                    <strong>${element.category}</strong>
                </td>
                <td>${element.stock} units</td>
                <td>
                    <div class="actionGroup">
                        <button class="viewButton" id = "${element.id}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `

        // target tbody
        document.getElementById('tbody').innerHTML += trElement;
    });

    // target viewButton
    var viewButton = document.getElementsByClassName('viewButton');
    // add click event to viewButton
    for (const element of viewButton) {
        element.addEventListener('click', function () {
            var getData = this.getAttribute('id');
            // console.log(getData);
            openModal(getData)
        })
    }
    paginationConcept();
}

// target closeButton
var closeButton = document.getElementById('closeButton')
closeButton.addEventListener('click', function () {
    closeModal();
})

// closeModal fucntion
function closeModal() {
    // target viewModalBody
    document.getElementById('viewModalBody').innerHTML = "";

    // target viewModal
    document.getElementById('viewModal').style.display = 'none';
}

// click outside modal will close
window.onclick = function (event) {
    let modal = document.getElementById("viewModal");
    if (event.target === modal) {
        closeModal();
    }
}

// openModal function
function openModal(getData) {
    var finalData = {};

    // loop the allproducts to get the selected product
    allProducts.forEach(element => {
        if (element.id === Number(getData)) {
            finalData = element;
        }
    });

    // target viewModalBody
    document.getElementById('viewModalBody').innerHTML = "";
    var modalContent = `
        <div class="detailRow">
            <span class="detailHeading">Title</span>
            <span class="detailValue">${finalData.title}</span>
        </div>
        <div class="detailRow">
            <span class="detailHeading">Brand</span>
            <span class="detailValue">
                ${(finalData.brand) ? finalData.brand : "Not Available"}
            </span>
        </div>
        <div class="detailRow">
            <span class="detailHeading">Category</span>
            <span class="detailValue">
                <span class="categoryBadge">${finalData.category}</span>
            </span>
        </div>
        <div class="detailRow">
            <span class="detailHeading">Price</span>
            <span class="detailValue">
                <i class="fa-solid fa-indian-rupee-sign"></i>
                ${finalData.price}
            </span>
        </div>
        <div class="detailRow">
            <span class="detailHeading">Stock</span>
            <span class="detailValue">${finalData.stock} units</span>
        </div>
        <div class="detailRow">
            <span class="detailHeading">Status</span>
            <span class="detailValue">
                <span class="statusBadge">${(finalData.stock > 0) ? 'In Stock' : 'Out of Stock'}</span>
            </span>
        </div>
    `
    // target viewModalBody
    document.getElementById('viewModalBody').innerHTML = modalContent;

    // target viewModal
    document.getElementById('viewModal').style.display = 'flex';
}

// target searchInput
var searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function (event) {
    var inputValue = event.target.value;

    // after 1500 ms searchData function call
    setTimeout(() => {
        searchData(inputValue)
    }, 1500);
})

// searchData function
function searchData(inputValue) {

    var noData = document.getElementById('noData');
    if (noData) {
        noData.remove();
    }

    if (inputValue) {

        filteredProducts = allProducts.filter(element =>
            element.title?.toLowerCase().includes(inputValue.toLowerCase()) ||
            element.category?.toLowerCase().includes(inputValue.toLowerCase()) ||
            element.brand?.toLowerCase().includes(inputValue.toLowerCase())
        );

        startPage = 0;

        document.getElementById('tbody').innerHTML = "";

        if (filteredProducts.length > 0) {
            appendElement(filteredProducts.slice(startPage, endPage));
            paginationConcept();
        } else {
            document.getElementById('pagination').innerHTML = "";
            const tbody = document.getElementById('tbody');

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div id="noData">No Records Found</div>
                    </td>
                </tr>
            `;
        }

    } else {
        document.getElementById('tbody').innerHTML = "";
        fetchData();
    }
}

// authUser function

function authUser() {
    const storedUser = JSON.parse(localStorage.getItem('loginuser'));

    if (storedUser) {
        fetchData();
    } else {
        window.location.href = '/login/index.html';
    }
}

// initial call
authUser();






