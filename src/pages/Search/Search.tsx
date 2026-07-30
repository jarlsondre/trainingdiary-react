import type React from "react";
import { useState } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { useUserSearch } from "../../queries/search";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submittedTerm, setSubmittedTerm] = useState<string>("");
  const navigate = useNavigate();

  const searchQuery = useUserSearch(submittedTerm);
  const users = searchQuery.data?.pages.flatMap((page) => page.results) ?? [];

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setSubmittedTerm(searchTerm);
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
