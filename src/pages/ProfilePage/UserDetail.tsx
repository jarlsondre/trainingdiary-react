import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserSessions } from "../../actions/sessions";
import {
  fetchUser,
  updateUser,
  followUser,
  unfollowUser,
} from "../../actions/user";
import Session, { SessionInterface } from "../SessionOverview/Session";
import "./userDetail.css";

interface Props {}

export default function UserDetail(props: Props) {
  const dispatch = useDispatch();
  const { username } = useParams() as { username: string };

  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [unitSystem, setUnitSystem] = React.useState("kg");

  const previousProfileUsername = useSelector(
    (state: any) => state.sessions.profileSessions.username
  );
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

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setUnitSystem(user.unit_system || "kg");
    }
  }, [user]);

  const handleLoadMore = () => {
    dispatch(fetchUserSessions(username, cursor));
  };

  const handleToggleEditProfile = () => {
    if (isPersonalProfile) {
      setIsEditingProfile(!isEditingProfile);
    }
  };

  const handleSaveProfile = () => {
    const id = user.id;
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      bio: bio,
      unit_system: unitSystem,
    };
    dispatch(updateUser(id, updatedUser));
    setIsEditingProfile(!isEditingProfile);
  };

  const handleFollowProfile = () => {
    dispatch(followUser(user.id, user.username));
  };

  const handleUnfollowProfile = () => {
    dispatch(unfollowUser(user.id, user.username));
  };

  return (
    <div className="user-details-container">
      {isEditingProfile ? (
        <div className="editing-user-info-container">
          First name:
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          Last name:
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          Email:
          <input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          Bio:
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div>
            Unit:
            <label>
              <input
                type="radio"
                value="kg"
                checked={unitSystem === "kg"}
                onChange={(e) => setUnitSystem(e.target.value)}
              />
              kg
            </label>
            <label>
              <input
                type="radio"
                value="lbs"
                checked={unitSystem === "lbs"}
                onChange={(e) => setUnitSystem(e.target.value)}
              />
              lbs
            </label>
          </div>
          <button className="save-profile-button" onClick={handleSaveProfile}>
            Save
          </button>
        </div>
      ) : (
        <div className="user-info-container">
          {isPersonalProfile ? (
            <button
              className="edit-profile-button"
              onClick={handleToggleEditProfile}
            >
              Edit profile
            </button>
          ) : userState.personalUser.following.some(
              (userObject: any) => userObject.username === username
            ) ? (
            <button className="unfollow-button" onClick={handleUnfollowProfile}>
              Unfollow
            </button>
          ) : (
            <button className="follow-button" onClick={handleFollowProfile}>
              Follow
            </button>
          )}
          <span className="user-name-container">
            {user.first_name ? user.first_name : "Anonymous"}{" "}
            {user.last_name ? user.last_name : "Gymrat"}
          </span>
          @{user.username}
          <span className="unit-system-container">
            Units:{" "}
            {user.unit_system === "kg" ? "Metric (kg)" : "Freedom units (lbs)"}
          </span>
          <p>
            "
            {user.bio
              ? user.bio
              : "Frankly, I don't have that much to share about myself..."}
            "
          </p>
        </div>
      )}
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
