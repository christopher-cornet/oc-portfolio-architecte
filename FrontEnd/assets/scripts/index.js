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

            // Add the title
            title.innerHTML = titleSrc;

            // Add figure to the gallery
            gallery.appendChild(figure);

            // Add image and title to the figure
            figure.appendChild(image);
            figure.appendChild(title);
        }
    }
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
};

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

let removeAllWork = () => {
    const works = document.querySelectorAll(".gallery figure");

    // Remove all the works
    for (let index = 0; index < works.length; index++) {
        works[index].remove();
    }
}

// Filter work based on button clicked
let filterWork = async (filter) => {
    let buttons = new Set(); // Create a Set
    buttons.add(filter); // Add the filter number

    addAllWorks(filter); // Add all works based on the filter
}

document.addEventListener("DOMContentLoaded", () => {
    addCategories();
    
    getWorks();

    let all_buttons = document.querySelectorAll(".categories button");

    // Each button has an Event Listener. On click, call the filterWork function
    for (let index = 0; index < all_buttons.length; index++) {
        // Add an event listener on all buttons
        all_buttons[index].addEventListener("click", () => {
            filterWork(index); // Give a number (0, 1, 2, or 3) in parameter
        });
    }
});