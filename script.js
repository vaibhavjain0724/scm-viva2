// const searchForm= document.querySelector('form');
// const searchInput= document.querySelector('#search');
// const resultsList= document.querySelector('#results');
// const searchHistoryList= document.querySelector('datalist#search-history');

// document.addEventListener('DOMContentLoaded', displaySearchHistory);
// searchForm.addEventListener('submit',(e)=>{
//     e.preventDefault();
//     const searchValue = searchInput.value.trim();
//     if (searchValue){
//         saveSearchHistory(searchValue);
//         displaySearchHistory();
//         searchRecipes(searchValue);
//     }
// });

// async function searchRecipes(searchValue){
//     const response= await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=73372ea2&app_key=c9d78960e4acb122f62edb4cfb533769&from=0&to=12`);
//     const data= await response.json();
//     displayRecipes(data.hits);
// }

// function displayRecipes(recipes){
//     let html= '';
//     recipes.forEach((recipe)=> {
//         html += `
//         <div>
//             <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
//             <h3>${recipe.recipe.label}</h3>
//             <ul>
//                 ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
//             </ul>
//             <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
//         </div> 
//         `;
//     });
//     resultsList.innerHTML= html;
// }

// function saveSearchHistory(searchValue){
//     let history= JSON.parse(localStorage.getItem('searchHistory')) || [];
//     if (!history.includes(searchValue)){
//         history.push(searchValue);
//         if (history.length > 10){ 
//             history.shift(); 
//         }
//         localStorage.setItem('searchHistory', JSON.stringify(history));
//     }
// }

// function displaySearchHistory(){
//     let history= JSON.parse(localStorage.getItem('searchHistory')) || [];
//     searchHistoryList.innerHTML= '';
//     history.forEach(term=>{
//         const option= document.createElement('option');
//         option.value= term;
//         searchHistoryList.appendChild(option);
//     });

// }

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');
const searchHistoryList = document.querySelector('datalist#search-history');

// Add alert overlay to the DOM when page loads
document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
    
    // Create and append alert overlay
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'alert-overlay';
    alertOverlay.id = 'alertOverlay';
    alertOverlay.innerHTML = `
        <div class="alert-dialog">
            <h3 class="alert-title">Leaving Current Page</h3>
            <p class="alert-message">You are about to be redirected to an external website. Do you want to continue?</p>
            <div class="alert-buttons">
                <button class="btn btn-secondary" onclick="cancelRedirect()">Cancel</button>
                <button class="btn btn-primary" onclick="continueRedirect()">Continue</button>
            </div>
        </div>
    `;
    document.body.appendChild(alertOverlay);

    // Add click outside listener
    alertOverlay.addEventListener('click', function(event) {
        if (event.target === this) {
            closeAlert();
        }
    });
});

// Add necessary alert-related styles
const styles = `
    .alert-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    }

    .alert-dialog {
        background-color: white;
        border-radius: 15px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
    }

    .alert-title {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .alert-message {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }

    .alert-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .btn {
        padding: 0.8rem 1.5rem;
        border-radius: 30px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background-color: #007bff;
        color: white;
    }

    .btn-primary:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    .btn-secondary {
        background-color: #e9ecef;
        color: #333;
    }

    .btn-secondary:hover {
        background-color: #dee2e6;
        transform: translateY(-2px);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

let currentUrl = '';

// Alert-related functions
function showAlert(event, url) {
    event.preventDefault();
    currentUrl = url;
    const alertOverlay = document.getElementById('alertOverlay');
    alertOverlay.style.display = 'flex';
}

function continueRedirect() {
    if (currentUrl) {
        window.open(currentUrl, '_blank');
    }
    closeAlert();
}

function cancelRedirect() {
    closeAlert();
}

function closeAlert() {
    const alertOverlay = document.getElementById('alertOverlay');
    alertOverlay.style.display = 'none';
    currentUrl = '';
}

// Your existing event listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
        saveSearchHistory(searchValue);
        displaySearchHistory();
        searchRecipes(searchValue);
    }
});

async function searchRecipes(searchValue) {
    const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=73372ea2&app_key=c9d78960e4acb122f62edb4cfb533769&from=0&to=12`);
    const data = await response.json();
    displayRecipes(data.hits);
}

// Modified displayRecipes function to include onclick handler
function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" onclick="showAlert(event, '${recipe.recipe.url}')" target="_blank">View Recipe</a>
        </div>
        `;
    });
    resultsList.innerHTML = html;
}

function saveSearchHistory(searchValue) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(searchValue)) {
        history.push(searchValue);
        if (history.length > 10) {
            history.shift();
        }
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function displaySearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML = '';
    history.forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        searchHistoryList.appendChild(option);
    });
}
