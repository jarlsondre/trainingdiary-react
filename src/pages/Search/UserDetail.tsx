import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userDetail.css";

interface Props {}

export default function UserDetail(props: Props) {
  const {} = props;
  const { username } = useParams() as { username: string };
  const users = useSelector((state: any) => state.searchUsers.searchResults);
  const user = users.find((user: any) => user.username === username);

  if (!user) {
    return <h1>User not found</h1>;
  }

  return (
    <div className="user-details-container">
      <h1>
        {user.first_name} {user.last_name}
      </h1>
      <h2>@{user.username}</h2>
      <p>{user.bio}</p>
    </div>
  );
}
