document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchFormClose = document.querySelector('.search-form-x');
  
    if (searchIcon) {
      searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        searchIcon.style.display = 'none';
        searchForm.style.display = 'flex';
        searchInput.focus();
      });
    }
  
    if (searchFormClose) {
      searchFormClose.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.style.display = 'none';
        searchIcon.style.display = 'block';
      });
    }
});
  