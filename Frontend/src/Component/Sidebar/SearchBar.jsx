import React from 'react'
import { useState } from "react";
function SearchBar({ handleUserClick, searchResults, searchName, setSearchName, setSearchResults }) {


    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />

            {searchName && searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div
                            key={user.id || user._id}
                            className="search-result-item"
                            onClick={() => {
                                handleUserClick(user.id||user._id)
                                setSearchName("");
                                setSearchResults([]);
                            }}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar
