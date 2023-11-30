const url = "http://localhost:5678/api/";

// Add all works to the gallery
let addAllWorks = async (categoryName) => {
    // Get all works
    const get_work = await fetch(`${url}works`);
    const data = await get_work.json();

    let gallery = document.querySelector(".gallery");

    if (categoryName == "objets") {
        console.log(categoryName);
        data.forEach((categorie, index) => {
            if (categorie.categoryId == 1) {
                // Get the image and title source
                let imageSrc = data[index].imageUrl;
                let titleSrc = data[index].title;

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
    else if (categoryName == "appartements") {
        data.forEach((categorie, index) => {
            if (categorie.categoryId == 2) {
                // Get the image and title source
                let imageSrc = data[index].imageUrl;
                let titleSrc = data[index].title;

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
    else {
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
};

let addCategories = async () => {
    // const get_work = await fetch(`${url}categories`);
    // const data = await get_work.json();

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

    // buttons[0].classList.add("all");
    // buttons[0].innerHTML = "Tous";

    // buttons[1].classList.add("objects");
    // buttons[1].innerHTML = "Objets";

    // buttons[2].classList.add("appartements");
    // buttons[2].innerHTML = "Appartements";

    // buttons[3].classList.add("hotels-restaurants");
    // buttons[3].innerHTML = "Hôtels & restaurants";
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
    const get_work = await fetch(`${url}works`);
    const data = await get_work.json();

    console.log(data);

    let buttons = new Set(); // Create a Set
    buttons.add(filter); // Add the filter number

    // If the user don't click on the "All" button, remove all the work
    if (filter !== 0) {
        removeAllWork();
    }

    // console.log(filter);

    // // Data Index = Filter - 1
    // let index = filter - 1;

    // // Check which filter to apply
    // if (buttons.has(1)) {
    //     console.log("Nom de la catégorie :", data[index].category.name);
    //     data.forEach((work, index) => {
    //         if (work.category.name == "Objets") {
    //             addAllWorks("objets");
    //         }
    //     });
    // }
    // else if (buttons.has(2)) {
    //     console.log("Nom de la catégorie :", data[index].category.name);
    //     data.forEach((work, index) => {
    //         if (work.category.name == "Appartements") {
    //             addAllWorks("appartements");
    //         }
    //     });
    // }
    // else if (buttons.has(3)) {
    //     console.log("Nom de la catégorie :", data[index].category.name);
    // }
    // else {
    //     console.log("Tous");
    // }
}

addCategories();

addAllWorks();

document.addEventListener("DOMContentLoaded", () => {
    let all_buttons = document.querySelectorAll(".categories button");

    // Each button has an Event Listener. On click, call the filterWork function
    for (let index = 0; index < all_buttons.length; index++) {
        // Add an event listener on all buttons
        all_buttons[index].addEventListener("click", () => {
            filterWork(index); // Give a number (0, 1, 2, or 3) in parameter
        });
    }
});