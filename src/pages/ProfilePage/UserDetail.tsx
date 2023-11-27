import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./userDetail.css";
import { fetchUserSessions } from "../../actions/sessions";
import { fetchUser } from "../../actions/user";
import Session, { SessionInterface } from "../SessionOverview/Session";

interface Props {}

export default function UserDetail(props: Props) {
  const { username } = useParams() as { username: string };
  const previousProfileUsername = useSelector(
    (state: any) => state.sessions.profileSessions.username
  );
  const dispatch = useDispatch();

  const userSessions = useSelector<any[]>(
    (state: any) => state.sessions.profileSessions.results
  );

  let cursor = useSelector<any>(
    (state: any) => state.sessions.profileSessions.cursor
  );
  let moreToLoad = useSelector<any>(
    (state: any) => state.sessions.profileSessions.moreToLoad
  );

  // Selecting the correct user
  let userState: any = useSelector<any>((state: any) => state.user);
  const isPersonalProfile = username === userState.personalUser.username;
  let user = userState.otherUser;
  if (isPersonalProfile) {
    user = userState.personalUser;
  }

  React.useEffect(() => {
    const newUser = username !== previousProfileUsername;
    dispatch(fetchUser(username));
    if (!cursor || newUser) {
      cursor = "";
    }
    if ((userSessions as any).length === 0 || newUser) {
      dispatch(fetchUserSessions(username, cursor, newUser));
    }
  }, [dispatch, username]);

  const handleLoadMore = () => {
    dispatch(fetchUserSessions(username, cursor));
  };

  return (
    <div className="user-details-container">
      <div className="user-info-container">
        {!isPersonalProfile && (
          <button className="follow-button">Follow</button>
        )}
        <span className="user-name-container">
          {user.first_name ? user.first_name : "Anonymous"}{" "}
          {user.last_name ? user.last_name : "Gymrat"}
        </span>
        @{user.username}
        <p>
          "
          {user.bio
            ? user.bio
            : "Frankly, I don't have that much to share about myself..."}
          "
        </p>
      </div>
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

        {moreToLoad ? (
          <button
            className="profile-load-more-button profile-more-to-load"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        ) : (
          <button className="profile-load-more-button" disabled>
            Nothing more to load
          </button>
        )}
      </div>
    </div>
  );
}
