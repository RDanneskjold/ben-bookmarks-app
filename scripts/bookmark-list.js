'use strict'

const bookmarkList = (function() {

    function generateError(message) {
        return `
            <section class="error-content">
                <button id="cancel-error">X</button>
                <p>${message}</p>
            </section>
        `;
    };

    function generateBookmarkElement(bookmark) {
        const expandedClass = bookmark.expanded ? 'bookmark-item_expanded' : '';
        console.log(bookmark.rating);
        let bookmarkTitle = `<span class="bookmark-title ${expandedClass}">${bookmark.title}</span>`;
        let bookmarkRating = '';
        !bookmark.rating ? bookmarkRating = '' : bookmarkRating = `<span class="bookmark-rating">Rating: ${bookmark.rating}</span>`;
        let bookmarkURL = bookmark.url;
        let bookmarkDesc = `<span class="bookmark-desc">${bookmark.desc}</span>`;
        
        if(bookmark.expanded) {
            return `
                <li class="js-bookmark-element" tabindex="2" data-bookmark-id="${bookmark.id}">
                ${bookmarkTitle}
                ${bookmarkRating}
                <br>
                ${bookmarkDesc}
                    <div class="bookmark-item-controls">
                        <button class="bookmark-visit-site js-bookmark-visit-site">
                            <span class="button-label">
                                <a href="${bookmarkURL}" target="_blank">Visit Site</a>
                            </span>
                        </button>
                        <button class="bookmark-item-delete js-bookmark-delete">
                            <span class="button-label">Delete</span>
                        </button>
                    </div>
                </li>`;
        } else {
            return `
                <li class="js-bookmark-element" tabindex="2" data-bookmark-id="${bookmark.id}">
                    ${bookmarkTitle}
                    ${bookmarkRating}
                </li>`;
        }
    };

    function generateBookmarkString(bookmarkList) {
        console.log('length:' + bookmarkList.length)
        const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
        return bookmarks.join('');
    };

    function renderError() {
        if (store.error) {
            const el = generateError(store.error);
            $('.error-container').html(el);
        } else {
            $('.error-container').empty();
        }
    };

    function render() {
        renderError();

        let bookmarks = [ ...store.bookmarks ];
        
        if (store.minRating !== "null") {
            bookmarks = bookmarks.filter(bookmark => store.minRating <= bookmark.rating);
        };
        
        store.addingBookmark ?
            $('#js-bookmark-add-form').removeClass('hidden') :
            $('#js-bookmark-add-form').addClass('hidden');

        console.log('rendering');
        const bookmarkListString = generateBookmarkString(bookmarks);

        $('.js-bookmark-list').html(bookmarkListString);
    };

    function handleNewBookmarkSubmit() {
        $('#js-bookmark-add-form').submit(function (event) {
            event.preventDefault();
            const newTitle = $('.js-bookmark-title-entry').val();
            console.log(newTitle);
            const newURL = $('.js-bookmark-url-entry').val();
            const newDesc = $('.js-bookmark-desc-entry').val();
            const newRating = $('.js-bookmark-rating-entry').val();
            
            api.createBookmark(newTitle, newURL, newDesc, newRating)
                .then((newBookmark) => {
                    store.addBookmark(newBookmark);
                    store.toggleAddingBookmark();
                    render();
                })
                .catch((err) => {
                    store.setError(err.message);
                    renderError();
                });
            
            event.currentTarget.reset();
        });
        
        $('#js-bookmark-add-form').on('click', '.js-bookmark-cancel-add', function (event) {
            store.toggleAddingBookmark();
            render();
        });
    };

    function getBookmarkIdFromElement(bookmark) {
        return $(bookmark)
            .closest('.js-bookmark-element')
            .data('bookmark-id');
    };

    function handleDeleteBookmark() {
        $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
            console.log('handleDelete');
            const id = getBookmarkIdFromElement(event.currentTarget);

            api.deleteBookmark(id)
                .then(() => {
                    store.findAndDelete(id);
                    render();
                })
                .catch((err) => {
                    console.log(err);
                    store.setError(err.message);
                    renderError();
                });
        });
    };

    function handleMinRatingClick() {
        $('#bookmark-min-rating input[type=radio]').click($('.js-bookmark-min-rating-select'), function(event) {
            console.log('handleMinRating');
            const rating = event.currentTarget.value;
            console.log('Min Rating: ' + rating);
            store.setMinRating(rating);
            render();
        });
    };

    function handleCloseError() {
        $('.error-container').on('click', '#cancel-error', () => {
            store.setError(null);
            renderError();
        });
    };

    function handleClickAddBookmark() {
        $('#js-bookmark-add').submit(function (event) {
            event.preventDefault();
            console.log('add bookmark');
            store.toggleAddingBookmark();
            render();
        });
    };

    function handleBookmarkExpandedClicked() {
        $('.js-bookmark-list').on('click','.js-bookmark-element', event => {
                      
            const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.findById(id);
            console.log('toggling expanded for ' + bookmark.title);

            store.toggleBookmarkExpanded(bookmark);
            render();
        });
    };
 
    function bindEventListeners() {
        handleNewBookmarkSubmit();
        handleDeleteBookmark();
        handleMinRatingClick();
        handleCloseError();
        handleClickAddBookmark();
        handleBookmarkExpandedClicked();
    };

    return {
        render,
        bindEventListeners,
    };

} () );