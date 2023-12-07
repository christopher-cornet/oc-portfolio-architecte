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
    
    // Remove all "current-btn" classes from categories buttons
    for (let index = 0; index < 4; index++) {
        all_buttons[index].classList.remove("current-btn");
    }

    all_buttons[filter].classList.add("current-btn"); // Add the "current button" class to the clicked button
}

// Add all the categories buttons
let addCategories = async () => {
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
    // window.localStorage.removeItem("token");

    // If the user is logged, change the UI to edit mode
    if (token != "") {
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
        return false;
    }
}

// Show modal or not depending on parameter passed in function calls
let modalState = (state) => {
    let modal = document.querySelector(".modal");
    let modalGallery = document.querySelector(".modal_gallery");
    
    modal.style.display = state;
    modalGallery.style.display = state;
}

document.addEventListener("DOMContentLoaded", () => {

    window.addEventListener('scroll', () => {
        // If the user scrolls the page, the modal background still displays completely
        if (window.scrollY > 0) {
            let modal = document.querySelector(".modal");
            modal.style.top = "0px"; // Position the background of the modal at the very top
        }
    });

    addCategories();
    getWorks();
    userLogged();

    let all_buttons = document.querySelectorAll(".categories button");

    let editButton = document.querySelector(".edit-btn");

    let modal = document.querySelector(".modal");
    let modalGallery = document.querySelector(".modal_gallery");

    // Each button has an Event Listener. On click, call the filterWork function
    for (let index = 0; index < all_buttons.length; index++) {
        // Add an event listener on all buttons
        all_buttons[index].addEventListener("click", () => {
            addAllWorks(index); // Give a number (0, 1, 2, or 3) in parameter
        });
    }

    // Open modal on click on the edit button
    editButton.addEventListener("click", () => {
        modalState("block");
    });

    // Close modal if click on screen outside "modalGallery"
    modal.addEventListener("click", () => {
        modalState("none");
    });

});