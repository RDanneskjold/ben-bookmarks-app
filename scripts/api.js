'use strict'

const api = (function(){

    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ben';
    
    const listFetch = function(...args) {
        let error;

        return fetch(...args)
            .then(res => {
                if (!res.ok) {
                    error = { code: res.status };

                    if (!res.headers.get('content-type').includes('json')) {
                        error.message = res.statusText;
                        return Promise.reject(error);
                    }
                }

                return res.json();
            })
            
            .then(data => {
                if (error) {
                    error.message = data.message;
                    return Promise.reject(error);
                }

                return data;
            });
    };

    const getBookmarks = function() {
        return listFetch(BASE_URL + '/bookmarks');
    };

    const createBookmark = function(title, url, desc, rating = null) {
        let bookmarkArgs;
        
        rating ? bookmarkArgs = { title, url, desc, rating } : bookmarkArgs = { title, url, desc };
        
        const newBookmark = JSON.stringify(bookmarkArgs);
        return listFetch(BASE_URL + '/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBookmark,
        });
    };

    // const updateBookmark = function(id, updateData) {
    //     const newData = JSON.stringify(updateData);
    //     return listFetch(BASE_URL + '/bookmarks/' + id, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: newData
    //     });
    // };

    const deleteBookmark = function(id) {
        return listFetch(BASE_URL + '/bookmarks/' + id, {
            method: 'DELETE'
        });
    };

    return {
        getBookmarks,
        createBookmark,
        // updateBookmark,
        deleteBookmark,
    };

} () );