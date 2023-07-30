import React from "react";
import { useSelector } from "react-redux";
import "./search.css";
import { useNavigate } from "react-router-dom";

interface Props {}

export default function Search(props: Props) {
  const {} = props;
  const users = useSelector((state: any) => state.searchUsers.searchResults);
  const navigate = useNavigate();

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className="search-overview-container">
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
