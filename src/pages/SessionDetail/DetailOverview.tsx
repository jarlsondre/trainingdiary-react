import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import { retrieveExercises } from "../../actions/exercises";
import { addExerciseUnit } from "../../actions/exerciseUnits";
import {
  deleteSession,
  retrieveSingleSession,
  updateSession,
} from "../../actions/sessions";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  compareExerciseNames,
  compareExerciseUnitIds,
  formatDate,
} from "../../utils/utils";
import SessionComment from "./SessionComment";

export default function DetailOverview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux variables
  const selectedSession = useAppSelector(
    (state) => state.sessions.selectedSession,
  );
  const isLoading = useAppSelector(
    (state) => state.sessions.selectedSession.isLoading,
  );
  const exercises = useAppSelector((state) => state.exercises);
  const sessionUsername = useAppSelector(
    (state) => state.sessions.selectedSession.username,
  );
  const personalUsername = useAppSelector(
    (state) => state.user.personalUser.username,
  );
  const comments = useAppSelector(
    (state) => state.sessions.selectedSession.comments,
  );

  // State variables
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [keyValue, setKeyValue] = useState<number>(0);
  const [description, setDescription] = useState<string | undefined>(
    selectedSession.description,
  );
  const [date, setDate] = useState<string | undefined>(
    selectedSession.datetime,
  );
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const maxLineCount = 4;

  // biome-ignore lint/correctness/useExhaustiveDependencies: preserving the original fetch-on-load timing; dependency cleanup belongs to a behavior pass
  useEffect(() => {
    if (
      (!selectedSession.id || selectedSession.id !== Number(sessionId)) &&
      !isLoading
    )
      dispatch(retrieveSingleSession(Number(sessionId)));
    if (exercises.length === 0) dispatch(retrieveExercises());
    else {
      const sortedExercises = [...exercises].sort(compareExerciseNames);
      setSelectedExercise(sortedExercises[0]?.id ?? null);
    }
  }, [isLoading, exercises]);

  // Handle buttons
  const handleAddExercise = () => {
    if (selectedExercise === null) return;
    dispatch(
      addExerciseUnit({
        exercise: selectedExercise,
        session: Number(sessionId),
      }),
    );
    setKeyValue(keyValue + (1 % 5));
  };

  const handleDelete = () => {
    dispatch(deleteSession(Number(sessionId)));
    navigate("/");
  };

  const handleSave = () => {
    let newDate: Date;
    if (date) newDate = new Date(date);
    else newDate = new Date();
    if (newDate.getHours() === 0) newDate.setHours(12);
    dispatch(
      updateSession(Number(sessionId), {
        datetime: newDate.toISOString(),
        description: description,
      }),
    );
    toggleIsEditingInfo();
  };

  // Toggle functions
  const toggleIsEditingInfo = () => {
    setIsEditingInfo(!isEditingInfo);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescriptionLine = (line: string, index: number) => {
    // If the line is empty, render a blank space for an extra line break
    if (line === "") {
      return <div key={index} style={{ height: "1em" }}></div>;
    }
    return <div key={index}>{line}</div>;
  };

  const descriptionLines = selectedSession.description
    ? selectedSession.description.split("\n")
    : [];

  let datetimeString = "";
  if (selectedSession.datetime) {
    datetimeString = selectedSession.datetime.substring(0, 10);
  }
  const editable = sessionUsername === personalUsername;

  if (isLoading) return <div>Loading...</div>;
  return (
    <div key={keyValue} className="detail-overview-container">
      <div className="detail-overview-inner-container">
        <div className="session-info-container">
          {isEditingInfo && editable ? (
            <>
              <button className="delete-session-button" onClick={handleDelete}>
                Delete Session
              </button>
              <div>User: {selectedSession.username}</div>
              <input
                type="date"
                id="session-date"
                name="session-date"
                defaultValue={datetimeString}
                className="date-input-field"
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              ></input>
              <div className="text-area-container">
                <textarea
                  rows={3}
                  cols={40}
                  id="description"
                  defaultValue={selectedSession.description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></textarea>
                <button onClick={handleSave} className="save-info-button">
                  Save
                </button>
              </div>
            </>
          ) : (
            <div>
              {editable && (
                <button
                  className="edit-session-info-button"
                  onClick={toggleIsEditingInfo}
                >
                  Edit
                </button>
              )}
              <div>
                <b>User</b>: {selectedSession.username}
              </div>
              <div>
                <b>Date</b>:{" "}
                {selectedSession.datetime
                  ? formatDate(selectedSession.datetime)
                  : ""}
              </div>
              <div className="description-detail-container">
                {descriptionLines.length > 0 &&
                  descriptionLines
                    .slice(
                      0,
                      showFullDescription
                        ? descriptionLines.length
                        : maxLineCount,
                    )
                    .map(renderDescriptionLine)}
                {descriptionLines.length > maxLineCount && (
                  <span className="show-more-text" onClick={toggleDescription}>
                    {showFullDescription ? "Show Less" : "Show More"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {selectedSession.exercise_unit &&
        selectedSession.exercise_unit.length > 0
          ? [...selectedSession.exercise_unit]
              .sort(compareExerciseUnitIds)
              .map((exerciseUnit) => {
                return (
                  <ExerciseUnitDetail
                    key={exerciseUnit.id}
                    exerciseUnit={exerciseUnit}
                    editable={editable}
                  />
                );
              })
          : editable
            ? ""
            : "No exercises yet"}
        {editable && (
          <div className="add-exercise-container">
            <select
              name="exercises"
              id="exercises"
              onChange={(event) => {
                setSelectedExercise(parseInt(event.target.value, 10));
              }}
            >
              {[...exercises].sort(compareExerciseNames).map((exercise) => {
                return (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                );
              })}
            </select>
            <button className="add-exercise-button" onClick={handleAddExercise}>
              Add Exercise
            </button>
          </div>
        )}
        {comments && comments.length > 0 && (
          <div className="comment-section-container">
            <span className="comment-section-header">
              {comments.length} comments
            </span>
            {comments.map((comment) => {
              return (
                <SessionComment
                  key={comment.id}
                  username={comment.username}
                  text={comment.text}
                  datetime={comment.datetime}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
