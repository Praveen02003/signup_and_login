// initialize timer
var timer;

// target myProductsButton
var myProductsButton = document.getElementById('myProductsButton');

// add event to myProductsButton
myProductsButton.addEventListener('click', function () {
    goToProductsPage();
})

// Go to products page function
function goToProductsPage() {
    window.location.href = "/products/index.html"
}

// toggleDropdown function
function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");

    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
}

// target dropdown button
var dropdownbutton = document.getElementById('dropdownButton');
dropdownbutton.addEventListener('click', function () {
    toggleDropdown();
});

// showUserDetails function
function showUserDetails(user) {
    const body = document.getElementById("userModalBody");

    body.innerHTML = `
        <div class="userDetail"><span>Name:</span> ${user.firstname} ${user.lastname}</div>
        <div class="userDetail"><span>Email:</span> ${user.email}</div>
        <div class="userDetail"><span>Phone:</span> ${user.mobile}</div>
        <div class="userDetail"><span>Gender:</span> ${user.gender}</div>
        <div class="userDetail"><span>Role:</span> ${user.role}</div>
        <div class="userDetail"><span>Shift:</span> ${user.shift}</div>
    `;
}


// view modal function
function modalClose() {
    document.getElementById("userModal").style.display = "none";
}

function modalOpen(parsedViewedData) {
    showUserDetails(parsedViewedData);
    document.getElementById("userModal").style.display = "flex";
}

// target modalClose button
var modalCloseButton = document.getElementById('modalClose')
// add event to modalClose button
modalCloseButton.addEventListener('click', function () {
    modalClose();
})




// delete confirmation modal
function openModal(grandParent) {
    document.getElementById("mainModal").style.display = "flex";
    var okModalButton = document.getElementById("okModalButton");

    function okConfirmation() {
        const email = grandParent.getAttribute('data');
        console.log(email);

        deleteUser(email);
        grandParent.remove();
        closeModal();

        okModalButton.removeEventListener('click', function () {
            okConfirmation();
        });
    }

    okModalButton.addEventListener('click', function () {
        okConfirmation();
    });
}

function closeModal() {
    document.getElementById("mainModal").style.display = "none";
}


// target closeModalButton
var closeModalButton = document.getElementById('closeModalButton');

// add event to openModalButton
closeModalButton.addEventListener('click', function () {
    closeModal();
})


window.onclick = function (event) {
    let modal = document.getElementById("mainModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// get all data from local storage
var userData = JSON.parse(localStorage.getItem("userdata")) || {};
var userDataValues = Object.values(userData) || [];
var loginUser = JSON.parse(localStorage.getItem("loginuser")) || {};

// cardlimit
var cardPerPage = 5;
var startPage = 0;
var endPage = cardPerPage;

// logout function
function logoutUser() {
    localStorage.removeItem('loginuser');
    window.location.href = '/login/index.html';
}

// navigate to add user page
function goToAddUser() {
    window.location.href = '/add/index.html';
}

// delete user function
function deleteUser(email) {
    delete userData[email];
    localStorage.setItem('userdata', JSON.stringify(userData));
}

// add click event in logout button
document.getElementById('logoutButton').addEventListener('click', function () {
    logoutUser();
});

// add click event in add user button
document.getElementById('addUserButton').addEventListener('click', function () {
    goToAddUser();
});

// enableDeleteButtons function
function enableDeleteButtons() {
    const deleteButtons = document.getElementsByClassName('deleteButton');

    for (const element of deleteButtons) {
        const email = element.getAttribute('data');

        element.addEventListener('click', function () {
            var grandParent = this.parentElement.parentElement;
            console.log(grandParent.getAttribute('id'));
            openModal(grandParent);
        });

        // disable for logged-in user
        if (loginUser.email === email) {
            element.disabled = true;
            element.style.backgroundColor = 'grey';
        }
    }
}

// enableEditButtons function
function enableEditButtons() {
    const editButtons = document.getElementsByClassName('editButton');

    for (const element of editButtons) {
        element.addEventListener('click', function () {
            const selectedData = this.getAttribute('data');
            const parsedData = JSON.parse(selectedData);

            localStorage.setItem('editdata', selectedData);
            localStorage.setItem('editemail', parsedData.email);

            window.location.href = '/edit/index.html';
        });
    }
}

// enableEditButtons function
function enableViewButtons() {
    const viewButtons = document.getElementsByClassName('viewButton');

    for (const element of viewButtons) {
        element.addEventListener('click', function () {
            const viewedData = this.getAttribute('data');
            const parsedViewedData = JSON.parse(viewedData);
            modalOpen(parsedViewedData);
        });
    }
}

// paginationConcept function
function paginationConcept() {
    var pagination = document.getElementById('pagination');
    pagination.innerHTML = "";
    // console.log(userDataValues.length);


    var totalPages = Math.ceil(userDataValues.length / cardPerPage);

    let currentPage = Math.floor(startPage / cardPerPage) + 1;

    // create previous button
    var createPreviousButton = document.createElement('button');
    createPreviousButton.innerText = "Previous";

    createPreviousButton.disabled = currentPage === 1;

    createPreviousButton.addEventListener('click', function () {
        if (currentPage > 1) {
            startPage -= cardPerPage;
            endPage = startPage + cardPerPage;
            displayUsers();
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


            startPage = (indexNumber - 1) * cardPerPage;
            endPage = startPage + cardPerPage;
            displayUsers();
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
            startPage += cardPerPage;
            endPage = startPage + cardPerPage;
            displayUsers();
            paginationConcept();
        }
    });

    pagination.appendChild(createNextButton);
}

// display users function
function displayUsers() {
    // create a i tag
    var createUserWelcomeElement = document.createElement('i');

    // add class to i tag
    createUserWelcomeElement.setAttribute('class', "fa-solid fa-users");

    // target welcomeMessage element
    var welcomeMessage = document.getElementById('welcomeMessage');

    welcomeMessage.innerHTML = "";

    welcomeMessage.appendChild(createUserWelcomeElement);

    welcomeMessage.append(" Welcome " + loginUser.firstname);

    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    userDataValues.slice(startPage, endPage).forEach((user, index) => {

        const card = document.createElement('div');
        card.classList = "userCard";
        card.setAttribute('id', index);
        card.setAttribute('data', user.email);


        card.innerHTML = `
            <div class="cardHeader">
                <div class="cardHeaderText">
                    <h3>${user.firstname} ${user.lastname}</h3>
                    <small>${user.role}</small>
                </div>
            </div>
        
            <div class="cardBody">
                <p><span>Email</span>   <span>${user.email}</span></p>
                <p><span>Phone</span>   <span>${user.mobile}</span></p>
                <p><span>Shift</span>   <span class="shiftBadge ${user.shift.toLowerCase()}">${user.shift}</span></p>
                <p><span>Gender</span>  <span>${user.gender}</span></p>
            </div>
        
            <div class="actions">
                <button class="editButton" data='${JSON.stringify(user)}'>
                    <i class="fa-regular fa-pen-to-square"></i> Edit Profile
                </button>
                <button class="viewButton" data='${JSON.stringify(user)}'>
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="deleteButton" data ='${user.email}'>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        userList.appendChild(card);
    });
    enableDeleteButtons();
    enableEditButtons();
    enableViewButtons();
}

// filter logic

// updateUI function
function updateUI(filteredData) {
    const noData = document.getElementById('noData');

    startPage = 0;
    endPage = cardPerPage;

    if (filteredData.length > 0) {
        noData.textContent = "";
        userDataValues = filteredData;
    } else {
        noData.textContent = "No matching records found";
        userDataValues = [];
        document.getElementById('pagination').innerHTML = "";
    }

    displayUsers();
    paginationConcept();
}

// searchData function
function searchData(searchValue = "", shift = "", gender = "", sortName = "", sortEmail = "") {

    const userDataArray = Object.values(userData);
    const filteredData = [];

    for (let i = 0; i < userDataArray.length; i++) {

        let user = userDataArray[i];

        let matchesSearch =
            user.firstname.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.mobile.includes(searchValue) ||
            user.role.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.gender.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.shift.toLowerCase().includes(searchValue.toLowerCase());

        let matchesShift =
            shift === "" || user.shift.toLowerCase() === shift.toLowerCase();

        let matchesGender =
            gender === "" || user.gender.toLowerCase() === gender.toLowerCase();

        if (matchesSearch && matchesShift && matchesGender) {
            filteredData.push(user);
        }
    }

    filteredData.sort((a, b) => {
        let nameResult = 0;
        let emailResult = 0;

        if (sortName) {
            nameResult = (sortName === "nameAscending")
                ? a.firstname.localeCompare(b.firstname)
                : b.firstname.localeCompare(a.firstname);
        }

        if (sortEmail) {
            emailResult = (sortEmail === "emailAscending")
                ? a.email.localeCompare(b.email)
                : b.email.localeCompare(a.email);
        }

        return nameResult !== 0 ? nameResult : emailResult;
    });

    updateUI(filteredData);
}


var selectedSortData = '';
var selectedSortNameData = '';
var selectedSortEmailData = '';


// target checkboxes
var checkBoxes = document.querySelectorAll('input[type="checkbox"]');

checkBoxes.forEach((element) => {
    element.addEventListener('change', function () {

        var finalDecision = this.value.includes("name") ? "name" : "email";

        // allow two input only
        checkBoxes.forEach((item) => {
            if (item.value.includes(finalDecision) && item !== this) {
                item.checked = false;
            }
            else if (item.value.includes(finalDecision) && item === this) {
                if (finalDecision === "name") {
                    selectedSortNameData = this.value;
                }
                else if (finalDecision === "email") {
                    selectedSortEmailData = this.value;
                }
            }
        });
        selectedSortData = this.checked ? this.value : "";
        // console.log("selectedSortData:", selectedSortNameData);
        // console.log("selectedSortData:", selectedSortEmailData);
    });
});


// get all ids

const searchInput = document.getElementById('search');
const clearButton = document.getElementById('clearButton');
const searchButton = document.getElementById('searchButton');
const selectShift = document.getElementById('selectShift');
const selectGender = document.getElementById('selectGender');

// add input event in searchInput
searchInput.addEventListener('input', function (event) {

    clearTimeout(timer);

    let searchValue = event.target.value;
    let shift = selectShift.value;
    let gender = selectGender.value;

    document.getElementById('userList').innerHTML = "";

    clearButton.style.display = searchValue ? "inline-block" : "none";

    timer = setTimeout(function () {
        searchData(searchValue, shift, gender, selectedSortNameData, selectedSortEmailData);
    }, 500);
});

// triggerFilter function

function triggerFilter() {
    let searchValue = searchInput.value;
    let shiftValue = selectShift.value;
    let genderValue = selectGender.value;

    clearButton.style.display =
        (searchValue || shiftValue || genderValue || selectedSortNameData || selectedSortEmailData) ? "inline-block" : "none";

    searchData(searchValue, shiftValue, genderValue, selectedSortNameData, selectedSortEmailData);
}

// add click event in search button
searchButton.addEventListener('click', function () {
    triggerFilter();
});

// add click event in clear button
clearButton.addEventListener('click', function () {

    document.getElementById('noData').textContent = "";
    toggleDropdown();

    checkBoxes.forEach(element => {
        element.checked = false;
    });

    selectedSortNameData = "";
    selectedSortEmailData = "";

    searchInput.value = "";
    selectShift.value = "";
    selectGender.value = "";

    this.style.display = "none";

    userDataValues = Object.values(userData);

    startPage = 0;
    endPage = cardPerPage;

    displayUsers();
    paginationConcept();
});

// authUser function

function authUser() {
    const storedUser = JSON.parse(localStorage.getItem('loginuser'));

    if (storedUser) {
        displayUsers()
        paginationConcept()
    } else {
        window.location.href = '/login/index.html';
    }
}

// initial call
authUser();