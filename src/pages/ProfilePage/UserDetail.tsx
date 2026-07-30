import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useFollow,
  useUnfollow,
  useUpdateUser,
} from "../../mutations/accounts";
import { useAccount, usePersonalUser } from "../../queries/accounts";
import { useUserSessions } from "../../queries/sessions";
import type { AccountSummaryInterface, UnitSystem } from "../../types/models";
import Session from "../SessionOverview/Session";
import "./userDetail.css";

export default function UserDetail() {
  const { username } = useParams() as { username: string };

  const personalUser = usePersonalUser().data;
  const accountQuery = useAccount(username);
  const isPersonalProfile = username === personalUser?.username;
  const user = isPersonalProfile ? personalUser : accountQuery.data;

  const sessionsQuery = useUserSessions(username);
  const userSessions =
    sessionsQuery.data?.pages.flatMap((page) => page.results) ?? [];

  const updateUser = useUpdateUser();
  const follow = useFollow();
  const unfollow = useUnfollow();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("kg");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setUnitSystem(user.unit_system || "kg");
    }
  }, [user]);

  const handleToggleEditProfile = () => {
    if (isPersonalProfile) {
      setIsEditingProfile(!isEditingProfile);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    updateUser.mutate({
      id: user.id,
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        bio: bio,
        unit_system: unitSystem,
      },
    });
    setIsEditingProfile(false);
  };

  const handleFollowProfile = () => {
    if (!user) return;
    follow.mutate(user.id);
  };

  const handleUnfollowProfile = () => {
    if (!user) return;
    unfollow.mutate(user.id);
  };

  const isFollowing =
    personalUser?.following.some(
      (followed: AccountSummaryInterface) => followed.username === username,
    ) ?? false;

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
          ) : isFollowing ? (
            <button className="unfollow-button" onClick={handleUnfollowProfile}>
              Unfollow
            </button>
          ) : (
            <button className="follow-button" onClick={handleFollowProfile}>
              Follow
            </button>
          )}
          <span className="user-name-container">
            {user?.first_name ? user.first_name : "Anonymous"}{" "}
            {user?.last_name ? user.last_name : "Gymrat"}
          </span>
          @{user?.username}
          <span className="unit-system-container">
            Units:{" "}
            {user?.unit_system === "kg" ? "Metric (kg)" : "Freedom units (lbs)"}
          </span>
          <p>
            "
            {user?.bio
              ? user.bio
              : "Frankly, I don't have that much to share about myself..."}
            "
          </p>
          <div className="user-statistics-container">
            <div># Sessions: TODO</div>
            <div>Followers: {user?.followers?.length ?? 0}</div>
            <div>Following: {user?.following?.length ?? 0}</div>
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

        {sessionsQuery.hasNextPage ? (
          <button
            className="profile-load-more-button profile-more-to-load"
            onClick={() => sessionsQuery.fetchNextPage()}
            disabled={sessionsQuery.isFetchingNextPage}
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
