function main() {
    loadJsonFile('public/data/LOCAL.json').then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });
}

function createBox(boxProps) {
    const boxContainer = document.getElementById('box-container');
    const newBox = document.createElement('div');
    newBox.className = "box"
    boxContainer.appendChild(newBox);
}

async function loadJsonFile(pathToFile) {
    try {
        const res = await fetch(pathToFile); //< hopefully fetches the file?
        if (!res.ok) {
            throw new Error('Network error (' + res.statusText + ')');
        }
        const data = await res.json();
        return data; // < return a 'resolved' promise
    } catch (error) {
        throw error; // < return a 'rejected' promise
    }
}

/* -----------------
Tenatative TODO List
................. */
// function saveJsonFile(pathToFile)

main()