'use strict'

const store = (function() {

    const setError = function(error) {
        this.error = error;
    };

    const addBookmark = function(bookmark) {
        if (bookmark.expanded === undefined) {
            bookmark.expanded = false;
        };
        this.bookmarks.push(bookmark);
    };

    const findById = function(id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    };

    const findAndDelete = function(id) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    };

    const setMinRating = function(rating) {
        this.minRating = rating;
    };

    const toggleAddingBookmark = function() {
        this.addingBookmark = !this.addingBookmark;
    };

    const findAndUpdate = function(id, newData) {
        const bookmark = this.findById(id);
        Object.assign(bookmark, newData);
    };

    const toggleBookmarkExpanded = function (bookmark) {
        bookmark.expanded = !bookmark.expanded;
    };

    return {
        bookmarks: [],
        error: null,
        minRating: null,
        addingBookmark: false,

        addBookmark,
        setError,
        findById,
        findAndDelete,
        setMinRating,
        toggleAddingBookmark,
        findAndUpdate,
        toggleBookmarkExpanded,
    };
 
} () );