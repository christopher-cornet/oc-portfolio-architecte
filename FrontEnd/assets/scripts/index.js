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

    let data = response_data; // Create a copy of response_data

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
    const id = window.localStorage.getItem("id");

    console.log("token:", token);
    console.log("user id:", id);

    // If the user is logged, change the UI to edit mode
    if (token && id) {
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
let updateModal = () => {
    let data = response_data; // Create a copy of response_data

    let modal = document.querySelector(".modal_works");
    let allImages = document.querySelectorAll(".modal_works figure");

    // Remove all images
    for (let index = 0; index < allImages.length; index++) {
        allImages[index].remove(); // Reset modal content
    }

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

    let trash = document.querySelectorAll(".fa-trash-can");
    let id;

    // On click on trash icon, remove the work corresponding
    for (let index = 0; index < trash.length; index++) {
        trash[index].addEventListener("click", () => {
            // Delete the work from the API
            removeWork(index, id);

            // Update the modal
            updateModal();

            // Remove all the precedent work from the gallery
            removeAllWork();

            // Get all the works from the API and update the gallery
            getWorks();
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
    
    grayLine.style.marginTop = "40px";

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

    // Section containing the elements of the modal in "add picture" mode
    let section = document.createElement("section");
    section.classList.add("modal_add_content");

    // First div
    let addPhoto = document.createElement("div");
    let imageIcon = document.createElement("i");
    let addPhotoButton = document.createElement("button");
    let addPhotoInput = document.createElement("input");
    let fileExtensionAllowed = document.createElement("p");

    // Define classes and text
    imageIcon.classList.add("fa-regular", "fa-image", "fa-2xl");
    addPhoto.classList.add("add_photo");
    addPhotoButton.classList.add("button_add_photo");
    addPhotoInput.classList.add("input_add_photo");

    addPhotoInput.required = true;
    addPhotoInput.type = "file";
    addPhotoInput.accept = ".jpg, .png";
    addPhotoInput.name = "image";
    addPhotoButton.innerHTML = "+ Ajouter photo";
    fileExtensionAllowed.innerHTML = "jpg, png : 4mo max";

    // Append elements to the first div
    addPhoto.appendChild(imageIcon);
    addPhoto.appendChild(addPhotoInput);
    addPhoto.appendChild(addPhotoButton);
    addPhoto.appendChild(fileExtensionAllowed);

    // Second div

    let title = document.createElement("div");
    let form = document.createElement("form");
    let titleLabel = document.createElement("label");
    let titleInput = document.createElement("input");

    form.action = "/";
    form.method = "post";
    form.enctype = "multipart/form-data";
    title.classList.add("add_title");
    titleLabel.classList.add("add_title_label");
    titleInput.classList.add("add_title_input");

    titleLabel.innerHTML = "Titre";
    titleInput.type = "text";
    titleInput.required = true;

    form.appendChild(addPhoto);
    form.appendChild(title);
    title.appendChild(titleLabel);
    title.appendChild(titleInput);

    // Third div

    let categorie = document.createElement("div");
    let categorieLabel = document.createElement("label");
    let categorieSelect = document.createElement("select");

    let data = response_data; // Create a copy of response_data
    console.log(data);

    // First option of the select is empty
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";

    categorieSelect.required = true;

    form.appendChild(categorie);
    categorieSelect.appendChild(option);

    // Add the categories to the select element
    data.forEach((element) => {
        if (element.id < 4) {
            let option = document.createElement("option");
            option.value = element.category.id;
            option.text = element.category.name;
    
            categorieSelect.appendChild(option);
        }
    });

    categorie.classList.add("add_categorie");
    categorieLabel.classList.add("add_categorie_label");
    categorieSelect.classList.add("add_categorie_select");

    categorieLabel.innerHTML = "Catégorie";

    categorie.appendChild(categorieLabel);
    categorie.appendChild(categorieSelect);

    section.appendChild(form);

    let sectionPosition = document.querySelector(".modal_gallery p");
    
    // Add the section after the title "Ajout photo"
    sectionPosition.insertAdjacentElement("afterend", section);

    // Change the submit button background color based on the input values
    let input = [addPhotoInput, titleInput, categorieSelect];

    for (let index = 0; index < 3; index++) {
        input[index].addEventListener("change", () => {
            // If all the fields are filled, change the submit button background color to green
            if (addPhotoInput.value.length > 0 && titleInput.value.length > 0 && categorieSelect.value !== "0") {
                submit.classList.remove("valid");
                submit.classList.add("green");
            }
            // Else, change the submit button background color to gray
            else if (addPhotoInput.value.length === 0 || titleInput.value.length === 0 || categorieSelect.value === "0") {
                submit.classList.add("valid");
                submit.classList.remove("green");
            }
        });
    }

    // If the input value is changed, add the image to the modal in preview
    addPhotoInput.addEventListener("change", (event) => {
        // Get the image URL from the input file
        const file = event.target.files[0];
        // Create a URL from the file object to use as img src
        const imageURL = URL.createObjectURL(file);

        // Create the image preview
        let imagePreview = document.createElement("img");
        imagePreview.src = imageURL;
        imagePreview.style.height = "150px";
        
        addPhoto.style.paddingTop = "0";
        addPhoto.style.paddingBottom = "0";

        addPhoto.appendChild(imagePreview);

        imageIcon.remove();
        addPhotoInput.style.display = "none";
        addPhotoButton.remove();
        fileExtensionAllowed.remove();
    });

    // On click on arrow, return to first modal
    arrow.addEventListener("click", () => {
        // Remove all the elements of the modal in "add picture" mode
        arrow.remove();
        submit.remove();

        addPhoto.remove();
        title.remove();
        categorie.remove();

        section.remove();

        // Display all the first modal elements
        modalTitle.innerHTML = "Galerie photo";
        modal_works.style.display = "grid";
        grayLine.insertAdjacentHTML("afterend", "<button class='add_picture'>Ajouter une photo</button>");

        // Update the modal gallery with the new work added
        updateModal();

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

        let title = document.querySelector(".add_title_input");
        let categorie = document.querySelector(".add_categorie_select");

        submit.addEventListener("click", () => {
            addWork(title.value, categorie.value);
        });
    }
}

// Add a work
let addWork = async (title, category) => {
    let data = response_data; // Create a copy of response_data

    // Get the last id and add 1 to create the new work id
    let id = data.length + 1;

    let token = window.localStorage.getItem("token");
    let userId = window.localStorage.getItem("id");

    // Select the image input
    let imageInput = document.querySelector(".add_photo input[type='file']");

    // Get the image file
    let imageFile = imageInput.files[0];

    let formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("image", imageFile);
    formData.append("category", category);
    formData.append("userId", userId);

    console.log(formData.get("id"));
    console.log(formData.get("title"));
    console.log(formData.get("image"));
    console.log(formData.get("category"));
    console.log(formData.get("userId"));

    // Set the maximum allowed file size in bytes
    const maxImageSize = 4 * 1024 * 1024; // 4 MB

    // Check if the file size exceeds the limit
    if (formData.get("image").size > maxImageSize) {
        console.log('File size exceeds the allowed limit.');
        return;
    }
    else {
        console.log("File size is OK.");
    }

    // If the image is filled, title is filled and category is selected
    // if (formData.get("image").size > 0 && formData.get("title") && formData.get("category") !== "0") {
    //     console.log("All fields are filled.");
    //     // Add the work to the API and update the gallery
    //     try {
    //         await fetch(`${url}works`, {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             body: formData
    //         });
    //     }
    //     catch (error) {
    //         console.log("Erreur API : ",error);
    //     }
        
    //     console.log("Titre : ", title);
    //     console.log("Catégorie : ", category);

    //     // Update the gallery
    //     getWorks();
    //     addAllWorks(0);
    //     updateModal();
    // }
    // else {
    //     console.log("Veuillez remplir tous les champs.");
    //     return;
    // }

    // Add the work to the API and update the gallery
    // try {
    //     await fetch(`${url}works`, {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${token}`
    //         },
    //         body: formData
    //     });
    // }
    // catch (error) {
    //     console.log("Erreur API : ",error);
    // }
    
    console.log("Titre : ", title);
    console.log("Catégorie : ", category);

    // Update the gallery and update the modal
    getWorks();
    addAllWorks(0);
    updateModal();
}

// Remove a work
let removeWork = async (index, id) => {
    let data = response_data; // Create a copy of response_data
    const token = window.localStorage.getItem("token");

    id = data[index].id;

    console.log("index : ", index);
    console.log("remove work. id : ", id);

    // Remove the work of the API and update the gallery
    let work = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    let allImages = document.querySelectorAll(".modal_works figure");
    allImages[index].remove(); // Remove the work from the modal
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