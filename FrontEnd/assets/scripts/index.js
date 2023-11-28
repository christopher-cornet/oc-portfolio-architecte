const url = "http://localhost:5678/api/";

// Get all works
let getAllWorks = async () => {
    const get_work = await fetch(`${url}works`);
    const data = await get_work.json();
};

// Add all works to the gallery
let addAllWorks = async () => {
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

getAllWorks();
addAllWorks();