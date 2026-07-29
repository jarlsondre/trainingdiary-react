import type React from "react";
import { useState } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../actions/searchUsers";
import { useAppDispatch, useAppSelector } from "../../hooks";

export default function Search() {
  const users = useAppSelector((state) => state.searchUsers.searchResults);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    dispatch(searchUsers("", searchTerm));
  };

  return (
    <div className="search-overview-container">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h1>Search Results</h1>
      <div>
        {users.length > 0
          ? users.map((user) => (
              <div
                key={user.id}
                className="user-frame"
                onClick={() => handleUserClick(user.username)}
              >
                {user.username}
              </div>
            ))
          : "No results"}
      </div>
    </div>
  );
}
