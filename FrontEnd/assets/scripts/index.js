const url = "http://localhost:5678/api/";

let all_buttons = document.querySelectorAll(".categories button");

// Add all works to the gallery
let addAllWorks = async () => {
    // Get all works
    const get_work = await fetch(`${url}works`);
    const data = await get_work.json();

    let gallery = document.querySelector(".gallery");

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
};

// Filter work based on button clicked
let filterWork = async (filter) => {
    const get_work = await fetch(`${url}categories`);
    const data = await get_work.json();

    let buttons = new Set(); // Create a Set
    buttons.add(filter); // Add the filter number/ID

    // Check which filter to apply
    if (buttons.has(1)) {
        console.log("Objets");
    }
    else if (buttons.has(2)) {
        console.log("Appartements");
    }
    else if (buttons.has(3)) {
        console.log("Hotels & restaurants");
    }
    else {
        console.log("Tous");
    }

}

addAllWorks();

// Each button has an Event Listener. On click, call the filterWork function
for (let index = 0; index < all_buttons.length; index++) {
    // Add an event listener on all buttons
    all_buttons[index].addEventListener("click", () => {
        filterWork(index); // Give a number (0, 1, 2, or 3) in parameter
    });
}