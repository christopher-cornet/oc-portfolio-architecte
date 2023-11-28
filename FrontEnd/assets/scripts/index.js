const url = "http://localhost:5678/api/";

// Get all works
let getAllWorks = async () => {
    const get_work = await fetch(`${url}works`);
    const data = await get_work.json();

    console.log(data);
};

getAllWorks();