import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../actions/searchUsers";

interface Props {}

export default function Search(props: Props) {
  const {} = props;
  const users = useSelector((state: any) => state.searchUsers.searchResults);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Step 1: State to hold the search input value
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value); // Step 2: Update the search input value
  };

  const handleSearch = () => {
    dispatch(searchUsers("", searchTerm)); // Step 3: Pass the search input value to searchUsers
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
          ? users.map((user: any, key: number) => (
              <div
                key={key}
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
