import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchUserSessions } from "../../actions/sessions";
import {
  fetchUser,
  followUser,
  unfollowUser,
  updateUser,
} from "../../actions/user";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { UnitSystem } from "../../types/models";
import Session from "../SessionOverview/Session";
import "./userDetail.css";

export default function UserDetail() {
  const dispatch = useAppDispatch();
  const { username } = useParams() as { username: string };

  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [unitSystem, setUnitSystem] = React.useState<UnitSystem>("kg");

  const previousProfileUsername = useAppSelector(
    (state) => state.sessions.profileSessions.username,
  );
  const userSessions = useAppSelector(
    (state) => state.sessions.profileSessions.results,
  );
  const cursor = useAppSelector(
    (state) => state.sessions.profileSessions.cursor,
  );
  const moreToLoad = useAppSelector(
    (state) => state.sessions.profileSessions.moreToLoad,
  );

  // Selecting the correct user
  const userState = useAppSelector((state) => state.user);
  const isPersonalProfile = username === userState.personalUser.username;
  const user = isPersonalProfile ? userState.personalUser : userState.otherUser;

  // biome-ignore lint/correctness/useExhaustiveDependencies: preserving the original fetch-on-navigation timing; dependency cleanup belongs to a behavior pass
  React.useEffect(() => {
    const newUser = username !== previousProfileUsername;
    dispatch(fetchUser(username));
    const effectiveCursor = !cursor || newUser ? "" : cursor;
    if (userSessions.length === 0 || newUser) {
      dispatch(fetchUserSessions(username, effectiveCursor, newUser));
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
    if (user.id === undefined) return;
    dispatch(
      updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        bio: bio,
        unit_system: unitSystem,
      }),
    );
    setIsEditingProfile(!isEditingProfile);
  };

  const handleFollowProfile = () => {
    if (user.id === undefined || user.username === undefined) return;
    dispatch(followUser(user.id, user.username));
  };

  const handleUnfollowProfile = () => {
    if (user.id === undefined || user.username === undefined) return;
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
                onChange={() => setUnitSystem("kg")}
              />
              kg
            </label>
            <label>
              <input
                type="radio"
                value="lbs"
                checked={unitSystem === "lbs"}
                onChange={() => setUnitSystem("lbs")}
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
              (userObject) => userObject.username === username,
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
          <div className="user-statistics-container">
            <div># Sessions: TODO</div>
            <div>Followers: {user.followers ? user.followers.length : 0}</div>
            <div>Following: {user.following ? user.following.length : 0}</div>
          </div>
        </div>
      )}
      <h2>Sessions</h2>
      <div className="session-list">
        {userSessions.length > 0 &&
          userSessions.map((session) => {
            return (
              <div key={session.id}>
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
