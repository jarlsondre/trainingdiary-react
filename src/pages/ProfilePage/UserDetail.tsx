import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userDetail.css";
import {
  fetchUserSessions,
  updateProfileUsername,
} from "../../actions/sessions";
import Session, { SessionInterface } from "../SessionOverview/Session";

interface Props {}

export default function UserDetail(props: Props) {
  const {} = props;
  const { username } = useParams() as { username: string };
  const users = useSelector((state: any) => state.searchUsers.searchResults);
  const profileUsername = useSelector(
    (state: any) => state.sessions.profileSessions.username
  );
  const dispatch = useDispatch();

  const userSessions = useSelector<any[]>(
    (state: any) => state.sessions.profileSessions.results
  );

  let replaceStore: boolean = false;

  // Figuring out if it is someone else's profile or not
  const personalUser = useSelector((state: any) => state.user);
  let isPersonalProfile = false;
  if (username == personalUser.username) isPersonalProfile = true;

  let cursor = useSelector<any>(
    (state: any) => state.sessions.profileSessions.cursor
  );
  let moreToLoad = useSelector<any>(
    (state: any) => state.sessions.profileSessions.moreToLoad
  );

  // This is a buggy way of dealing with it when you have multiple users, no?
  React.useEffect(() => {
    if (username !== profileUsername) {
      replaceStore = true;
      cursor = "";
      moreToLoad = true;
      dispatch(updateProfileUsername(username));
    } else replaceStore = false;
    if (((userSessions as any).length == 0 || replaceStore) && moreToLoad) {
      dispatch(fetchUserSessions(username, cursor, replaceStore));
    }
  }, [dispatch, username, replaceStore]);

  const handleLoadMore = () => {
    dispatch(fetchUserSessions(username, cursor));
  };

  // Bases choice of user on personal user and search results
  let user;
  if (isPersonalProfile) {
    user = personalUser;
  } else {
    user = users.find((user: any) => user.username === username);
  }

  if (!user) {
    return (
      <div>
        <h1>User not found</h1> Or you clicked via overview page. This part is
        not fully implemented yet...
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <h1>
        {user.first_name ? user.first_name : "Anonymous"}{" "}
        {user.last_name ? user.last_name : "Gymrat"}
      </h1>
      @{user.username}
      <p>
        Bio:{" "}
        {user.bio
          ? user.bio
          : "Frankly, I don't have that much to share about myself..."}
      </p>
      <h2>Sessions</h2>
      <div className="session-list">
        {(userSessions as any[]).length > 0 &&
          (userSessions as any[]).map((session: SessionInterface, key) => {
            return (
              <div key={key}>
                <Session session={session} />
              </div>
            );
          })}
      </div>
      {moreToLoad ? (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load more
        </button>
      ) : (
        <button className="load-more-button" disabled>
          Nothing more to load
        </button>
      )}
    </div>
  );
}
