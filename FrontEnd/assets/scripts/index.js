const url = "http://localhost:5678/api/";

let response_data; // Global variable to store the response data

// Get all the works from the API
let getWorks = async () => {
    const get_work = await fetch(`${url}works`);
    response_data = await get_work.json();

    addAllWorks(0);
}

// Add all works to the gallery
let addAllWorks = async (filter) => {
    removeAllWork(); // Remove all the precedent work

    let data = [...response_data]; // Create a copy of response_data

    let gallery = document.querySelector(".gallery");

    // If the filter is 0, add all the works
    if (filter == 0) {
        // Create all the images and captions
        for (let i = 0; i < data.length; i++) {
            // Get the image and title source
            let imageSrc = data[i].imageUrl;
            let titleSrc = data[i].title;

            // Create figure, image and title
            let figure = document.createElement("figure");
            let image = document.createElement("img");
            let title = document.createElement("figcaption");

            // Add the attributes to the image
            image.src = imageSrc;
            image.alt = titleSrc;

            // Add the titles
            title.innerHTML = titleSrc;

            // Add figure to the gallery
            gallery.appendChild(figure);

            // Add image and title to the figure
            figure.appendChild(image);
            figure.appendChild(title);
        }
    }
    // If the filter is not 0, add the works based on the filter
    else {
        // For each element in data (element = each object)
        data.forEach((element) => {
            if (element.categoryId == filter) {
                // Get the image and title source
                let imageSrc = element.imageUrl;
                let titleSrc = element.title;

                // Create figure, image and title
                let figure = document.createElement("figure");
                let image = document.createElement("img");
                let title = document.createElement("figcaption");

                // Add the attributes to the image
                image.src = imageSrc;
                image.alt = titleSrc;

                // Add the title
                title.innerHTML = titleSrc;

                // Add figure to the gallery
                gallery.appendChild(figure);

                // Add image and title to the figure
                figure.appendChild(image);
                figure.appendChild(title);
            }
        });
    }
    changeCurrentCategory(filter);
};

// Remove each "current-btn" class from categories buttons and add it to the button clicked
let changeCurrentCategory = (filter) => {
    let all_buttons = document.querySelectorAll(".categories .btn");
    
    // If the first button exists
    if (all_buttons[0]) {
        // Remove all "current-btn" classes from categories buttons
        for (let index = 0; index < 4; index++) {
            all_buttons[index].classList.remove("current-btn");
        }
        // Add the "current button" class to the clicked button
        all_buttons[filter].classList.add("current-btn");
    }
}

// Add all the categories buttons
let addCategories = async () => {
    let title = document.querySelector(".title");
    const categorieParent = document.createElement("div");
    categorieParent.classList.add("categories");

    // Place the "categories" div after the "title" div
    title.insertAdjacentHTML("afterend", "<div class='categories'></div>");

    const categories = document.querySelector(".categories");

    // Create the filters buttons
    for (let index = 0; index < 4; index++) {
        let button = document.createElement("button");
        button.classList.add("btn");
        
        categories.appendChild(button);
    }

    let all_buttons = document.querySelectorAll(".categories .btn");
    all_buttons[0].classList.add("current-btn"); // Add the "current button" class to the first button

    // Create an array with all the categories class names and texts
    let all_categories = [
        {"className": "all", "text": "Tous"},
        {"className": "objects", "text": "Objets"},
        {"className": "appartements", "text": "Appartements"},
        {"className": "hotels-restaurants", "text": "Hôtels & restaurants"}
    ];

    // Add all class names and texts
    all_categories.forEach((categorie, index) => {
        all_buttons[index].classList.add(categorie.className);
        all_buttons[index].innerHTML = categorie.text;
    });
}

 // Remove all the precedent work
let removeAllWork = () => {
    const works = document.querySelectorAll(".gallery figure");

    // Remove all the works
    for (let index = 0; index < works.length; index++) {
        works[index].remove();
    }
}

// Check if the user is logged
let userLogged = () => {
    const token = window.localStorage.getItem("token");

    // If the user is logged, change the UI to edit mode
    if (token) {
        // Add the edit mode header
        let edition_block = document.querySelector(".edition_block");
        edition_block.classList.add("logged");

        // Add image to the header
        let header_img = document.createElement("img");
        header_img.src = "assets/images/edit_mode.svg";
        edition_block.appendChild(header_img);

        // Change "login" button to "logout"
        document.querySelectorAll("header ul li")[2].innerHTML = "logout";

        // Remove the categories container
        document.querySelector(".categories").remove();

        // Edit icon
        let edit_icon = document.createElement("img");
        edit_icon.src = "assets/images/modify.svg";

        // Edit button
        let edit_btn = document.querySelector(".edit-btn")
        edit_btn.appendChild(edit_icon);

        // Modify paragraph
        let modify = document.createElement("p");
        modify.innerHTML = "Modifier";

        edit_btn.appendChild(modify);

        return true;
    }
    else {
        // Fix header margin top at 50px
        let header = document.querySelector("header");
        header.style.marginTop = "50px";

        // Log out button change to "login" and redirect to the login page
        let logoutButton = document.querySelector(".logout");
        
        if (logoutButton) {
            logoutButton.innerHTML = "login";
            logoutButton.classList.remove("logout");
        }
        
        let editionBlock = document.querySelector(".edition_block");
        let editButton = document.querySelector(".edit-btn");

        // Remove logged in user elements
        if (editionBlock && editButton) {
            editionBlock.remove();
            editButton.remove();
        }

        return false;
    }
}

// Add the events of the categories buttons
let categoriesEvents = () => {
    let all_buttons = document.querySelectorAll(".categories button");

    // Each button has an Event Listener. On click, call the filterWork function
    for (let index = 0; index < all_buttons.length; index++) {
        // Add an event listener on all buttons
        all_buttons[index].addEventListener("click", () => {
            addAllWorks(index); // Give a number (0, 1, 2, or 3) in parameter
        });
    }
}

// Add the events after clicking on login or logout
let loginEvents = () => {
    let loginButton = document.querySelectorAll("header nav ul li");
    let logoutButton = document.querySelector(".logout");

    // If login button is equal to "login", redirect user to login page
    if (loginButton[2].innerHTML === "login") {
        loginButton[2].addEventListener("click", () => {
            window.location.href = "http://localhost:5500/login.html";
        });
    }
    // Else, the login button is a logout button, so logout user
    else {
        // Logout the user by clicking the logout button
        logoutButton.addEventListener("click", () => {
            logoutUser();
            userLogged();
            loginEvents();
            addCategories();
            categoriesEvents();
        });
    }
}

// Create the Modal
let createModal = () => {
    let deleteGrayLine = document.querySelectorAll(".gray_line");
    let deleteButton = document.querySelectorAll(".modal_gallery button");

    // Undo adding new lines or buttons if they already exist
    if (deleteGrayLine[0] && deleteButton[0]) {
        deleteGrayLine[0].remove();
        deleteButton[0].remove();
    }

    // Create the modal and append to the body
    let body = document.querySelector("body");
    let modal_background = document.createElement("div");

    // Add a gray line to separate the images and button
    let grayLine = document.createElement("div");
    grayLine.classList.add("gray_line");

    // Add a button to add an image
    let button = document.createElement("button");
    button.classList.add("add_picture");
    button.innerHTML = "Ajouter une photo";

    // Add the modal background
    modal_background.classList.add("modal");
    // Add modal as first body element
    body.insertBefore(modal_background, document.body.firstChild);

    // Create a gallery and append to modal
    let modalGallery = document.querySelector(".modal_gallery");
    let gallery = document.createElement("div");

    gallery.classList.add("modal_works");

    // Append every elements
    modalGallery.appendChild(gallery);
    modalGallery.appendChild(grayLine);
    modalGallery.appendChild(button);
}

// Show modal or not depending on parameter passed in function calls
let modalState = (state) => {
    let modal = document.querySelector(".modal");
    let modalGallery = document.querySelector(".modal_gallery");
    
    modal.style.display = state;
    modalGallery.style.display = state;
}

// Update the gallery inside the modal
let updateModal = async () => {
    let modal = document.querySelector(".modal_works");
    let allImages = document.querySelectorAll(".modal_works figure");

    // Remove all images
    for (let index = 0; index < allImages.length; index++) {
        allImages[index].remove(); // Reset modal content
    }

    let data = [...response_data]; // Create a copy of response_data

    // console.log(data);

    // Update all images
    for (let i = 0; i < data.length; i++) {
        // Get the image and title source
        let imageSrc = data[i].imageUrl;
        let titleSrc = data[i].title;

        // Create figure, image and title
        let figure = document.createElement("figure");
        let image = document.createElement("img");

        // Add the attributes to the image
        image.src = imageSrc;
        image.alt = titleSrc;

        // Add the trash icons
        let trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can", "fa-xs");

        // Add figure to the modal
        modal.appendChild(figure);

        // Add image and trash icon to the figure
        figure.appendChild(image);
        figure.appendChild(trash);
    }

    let trash = document.querySelectorAll(".fa-trash-can")

    // On click on trash icon, remove the work corresponding
    for (let index = 0; index < trash.length; index++) {
        trash[index].addEventListener("click", () => {
            removeWork(index);
        });  
    }
}

// Modal in add picture mode
let addPictureModal = () => {
    let modalTitle = document.querySelector(".modal_gallery p");
    let addPictureButton = document.querySelector(".add_picture");
    let closeModalIcon = document.querySelector(".fa-xmark");
    let modal_works = document.querySelector(".modal_works");
    let grayLine = document.querySelector(".gray_line");

    // Add the submit button
    grayLine.insertAdjacentHTML("afterend", "<button class='valid'>Valider</button>")

    // Hide works
    modal_works.style.display = "none";

    // Remove the add picture button
    addPictureButton.remove();

    // Edit title text
    modalTitle.innerHTML = "Ajout photo";

    // If there is no arrow in DOM, add an arrow on the top left of modal
    if (!document.querySelector(".fa-arrow-left")) {
        closeModalIcon.insertAdjacentHTML("beforebegin", "<i class='fa-solid fa-arrow-left fa-xl'></i>");
    }

    let arrow = document.querySelector(".fa-arrow-left");
    let submit = document.querySelector(".valid");

    // On click on arrow, return to first modal
    arrow.addEventListener("click", () => {
        // Remove arrow and the submit button
        arrow.remove();
        submit.remove();

        // Display all the first modal elements
        modalTitle.innerHTML = "Galerie photo";
        modal_works.style.display = "grid";
        grayLine.insertAdjacentHTML("afterend", "<button class='add_picture'>Ajouter une photo</button>");

        // Re-add the event listener
        addPictureEvents("addPictureButton");
    });

    // On click on submit button, add a work
    addPictureEvents("submit");
}

// Add picture and Submit button events
let addPictureEvents = (buttonName) => {
    if (buttonName === "addPictureButton") {
        // Re-add the event listener
        let addPictureButton = document.querySelector(".add_picture");

        addPictureButton.addEventListener("click", () => {
            addPictureModal();
        });
    }
    else if (buttonName === "submit") {
        // On click on submit button, add a work
        let submit = document.querySelector(".valid");

        submit.addEventListener("click", () => {
            addWork("title", "name");
        });
    }
}

// Add a work
let addWork = (title, name) => {
    console.log("Add work : ", title, name);
}

// Remove a work
let removeWork = (id) => {
    console.log("remove work. id : ", id + 1);
    let data = response_data; // Create a copy of response_data
    console.log(data[id]);
}

// Log out user
let logoutUser = () => {
    // Delete authentication token
    window.localStorage.removeItem("token");
}

document.addEventListener("DOMContentLoaded", () => {
    createModal();
    addCategories();
    getWorks();
    userLogged();
    loginEvents();
    categoriesEvents();

    let editButton = document.querySelector(".edit-btn");

    let modal = document.querySelector(".modal");
    let closeButton = document.querySelector(".fa-xmark");

    let addPictureButton = document.querySelector(".add_picture");

    // If edit button exists in DOM
    if (editButton) {
        // Open modal on click on the edit button
        editButton.addEventListener("click", () => {
            modalState("block");
            updateModal();
        });
    }

    // Close modal if click on screen outside "modalGallery"
    modal.addEventListener("click", () => {
        modalState("none");
    });

    // Close modal
    closeButton.addEventListener("click", () => {
        modalState("none");
    });
    
    // Click on button "add a picture" in modal
    addPictureButton.addEventListener("click", () => {
        addPictureModal();
    });

});