import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import { useAddExerciseUnit } from "../../mutations/exerciseUnits";
import { useDeleteSession, useUpdateSession } from "../../mutations/sessions";
import { usePersonalUser } from "../../queries/accounts";
import { useExercises } from "../../queries/exercises";
import { useSession } from "../../queries/sessions";
import type { SessionCommentInterface } from "../../types/models";
import {
  compareExerciseNames,
  compareExerciseUnitIds,
  formatDate,
} from "../../utils/utils";
import SessionComment from "./SessionComment";

export default function DetailOverview() {
  const { sessionId } = useParams();
  const id = Number(sessionId);
  const navigate = useNavigate();

  const sessionQuery = useSession(id);
  const exercisesQuery = useExercises();
  const exercisesData = exercisesQuery.data;
  const exercises = exercisesData ?? [];

  const addExerciseUnit = useAddExerciseUnit();
  const updateSessionMutation = useUpdateSession();
  const deleteMutation = useDeleteSession();

  const personalUsername = usePersonalUser().data?.username;

  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const maxLineCount = 4;

  // Default the exercise picker to the first exercise once they load.
  useEffect(() => {
    if (
      selectedExercise === null &&
      exercisesData &&
      exercisesData.length > 0
    ) {
      setSelectedExercise([...exercisesData].sort(compareExerciseNames)[0].id);
    }
  }, [exercisesData, selectedExercise]);

  const session = sessionQuery.data;

  const handleAddExercise = () => {
    if (selectedExercise === null) return;
    addExerciseUnit.mutate({ exercise: selectedExercise, session: id });
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/");
    } catch {
      // Failed (e.g. offline): the mutation's onError already showed a toast,
      // and the optimistic removal was rolled back — so stay on the page.
    }
  };

  const handleSave = () => {
    let newDate: Date;
    if (date) newDate = new Date(date);
    else newDate = new Date();
    if (newDate.getHours() === 0) newDate.setHours(12);
    updateSessionMutation.mutate({
      id,
      data: { datetime: newDate.toISOString(), description },
    });
    toggleIsEditingInfo();
  };

  const toggleIsEditingInfo = () => setIsEditingInfo(!isEditingInfo);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const renderDescriptionLine = (line: string, index: number) => {
    if (line === "") return <div key={index} style={{ height: "1em" }} />;
    return <div key={index}>{line}</div>;
  };

  if (sessionQuery.isPending || !session) return <div>Loading...</div>;

  const descriptionLines = session.description
    ? session.description.split("\n")
    : [];
  const datetimeString = session.datetime
    ? session.datetime.substring(0, 10)
    : "";
  const editable = session.username === personalUsername;

  return (
    <div className="detail-overview-container">
      <div className="detail-overview-inner-container">
        <div className="session-info-container">
          {isEditingInfo && editable ? (
            <>
              <button className="delete-session-button" onClick={handleDelete}>
                Delete Session
              </button>
              <div>User: {session.username}</div>
              <input
                type="date"
                id="session-date"
                name="session-date"
                defaultValue={datetimeString}
                className="date-input-field"
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              />
              <div className="text-area-container">
                <textarea
                  rows={3}
                  cols={40}
                  id="description"
                  defaultValue={session.description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
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
                <b>User</b>: {session.username}
              </div>
              <div>
                <b>Date</b>:{" "}
                {session.datetime ? formatDate(session.datetime) : ""}
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
        {session.exercise_unit.length > 0
          ? [...session.exercise_unit]
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
        {session.comments.length > 0 && (
          <div className="comment-section-container">
            <span className="comment-section-header">
              {session.comments.length} comments
            </span>
            {session.comments.map((comment: SessionCommentInterface) => {
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
