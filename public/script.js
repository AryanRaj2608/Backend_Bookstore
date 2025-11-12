const bookList = document.getElementById('book-list');

// NOTE: use relative path '/books' if you serve frontend from same server.
// If backend is deployed somewhere else, replace with full URL e.g. 'https://your-backend.onrender.com/books'
const API_URL = (location.hostname === 'localhost') ? 'http://localhost:5555/books' : '/books';

fetch(API_URL)
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
    return res.json();
  })
  .then(json => {
    // adapt to your response shape: in your controller you return { success:true, books: [...] }
    const data = json.books || json.data || json; // fallback
    if (!data || data.length === 0) {
      bookList.innerHTML = '<p>No books found.</p>';
      return;
    }

    bookList.innerHTML = '';
    data.forEach(book => {
      const d = document.createElement('div');
      d.className = 'book';
      d.innerHTML = `<strong>${book.title || 'Untitled'}</strong>
                     <div>by ${book.author || 'Unknown'}</div>
                     ${book.price ? `<div>₹${book.price}</div>` : ''}
                     ${book.publicationYear ? `<div>${book.publicationYear}</div>` : ''}`;
      bookList.appendChild(d);
    });
  })
  .catch(err => {
    console.error('Error:', err);
    bookList.innerHTML = `<p>Error loading books: ${err.message}</p>`;
  });
