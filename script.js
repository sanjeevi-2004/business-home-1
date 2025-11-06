// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Select the elements for the search
    const searchOpenBtn = document.getElementById('search-open-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchCloseBtn = document.querySelector('.search-overlay-close');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');

    // --- 1. Toggle Search Overlay ---

    // Function to open the search
    const openSearch = (e) => {
        if (e) {
            e.preventDefault(); // Stop the <a> tag from jumping to top
        }
        searchOverlay.classList.add('active');
        // Focus the input field so the user can type immediately
        searchInput.focus();
    };

    // Function to close the search
    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        searchInput.value = ''; // Clear the input
        searchResultsContainer.innerHTML = ''; // Clear the results
    };

    // Add event listeners
    if (searchOpenBtn) {
        searchOpenBtn.addEventListener('click', openSearch);
    }
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeSearch);
    }

    // Optional: Close search by pressing the 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // --- 2. Handle Search Form Submission (Connect to Backend) ---
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the form from reloading the page
            
            const query = searchInput.value;
            
            // Don't search if the query is empty
            if (!query.trim()) {
                searchResultsContainer.innerHTML = '';
                return;
            }

            // Show a "loading" message
            searchResultsContainer.innerHTML = '<p style="color: #888;">Searching...</p>';

            try {
                // This is the BACKEND part:
                // We send the user's query to our server's API endpoint
                // Make sure your backend server is running!
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const results = await response.json(); // Get the JSON data from the server

                // Clear "searching" message
                searchResultsContainer.innerHTML = '';

                // Display the new results
                if (results.length > 0) {
                    results.forEach(item => {
                        // Create an <a> tag for each result
                        const resultLink = document.createElement('a');
                        resultLink.href = item.url;
                        resultLink.textContent = item.title;
                        // Optional: make links open in a new tab
                        // resultLink.target = "_blank";
                        searchResultsContainer.appendChild(resultLink);
                    });
                } else {
                    // Show a "no results" message
                    searchResultsContainer.innerHTML = '<p style="color: #888;">No results found.</p>';
                }

            } catch (error) {
                console.error('Error during search:', error);
                searchResultsContainer.innerHTML = '<p style="color: red;">Error: Could not perform search. Is the server running?</p>';
            }
        });
    }

    // --- 3. (Optional) Other JS you might have (like side-menu) ---
    // (You can add the JavaScript for your side-menu, header scroll, etc., here)

});