import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import {
  deleteSession,
  retrieveSingleSession,
  updateSession,
} from "../../actions/sessions";
import { addExerciseUnit } from "../../actions/exerciseUnits";
import { retrieveExercises } from "../../actions/exercises";
import { connect, useSelector } from "react-redux";

const compareExerciseNames = (a: any, b: any) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function DetailOverview(props: any) {
  let { sessionId } = useParams();
  const navigate = useNavigate();
  const sessionList = useSelector((state: any) => state.sessions.sessionList);

  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [keyValue, setKeyValue] = useState<number>(0);
  const [description, setDescription] = useState<string>(
    props.selectedSession.description
  );
  const [date, setDate] = useState<string>(props.selectedSession.datetime);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const username = useSelector((state: any) => state.user.username);
  const maxLineCount = 4;
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (
      (!props.selectedSession.id ||
        props.selectedSession.id !== Number(sessionId)) &&
      !props.isLoading
    )
      props.onRetrieveSingleSession(Number(sessionId), sessionList);
    if (props.exercises.length === 0) props.onRetrieveExercises();
    else {
      const sortedExercises = [...props.exercises].sort(compareExerciseNames);
      setSelectedExercise(sortedExercises[0]?.id);
    }
  }, [props.isLoading, props.exercises]);

  const handleAddExercise = () => {
    const data = {
      exercise: selectedExercise,
      session: sessionId,
    };
    props.onAddExerciseUnit(data);
    setKeyValue(keyValue + (1 % 5));
  };

  const handleDelete = () => {
    props.onDeleteSession(Number(sessionId));
    navigate("/");
  };

  const toggleIsEditingInfo = () => {
    setIsEditingInfo(!isEditingInfo);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleSave = () => {
    let newDate;
    if (date) newDate = new Date(date);
    else newDate = new Date();
    if (newDate.getHours() === 0) newDate.setHours(12);
    const data = {
      datetime: newDate.toISOString(),
      description: description,
    };
    props.onUpdateSession(Number(sessionId), data);
    toggleIsEditingInfo();
  };

  const renderDescriptionLine = (line: string, index: number) => {
    // If the line is empty, render a blank space for an extra line break
    if (line === "") {
      return <div key={index} style={{ height: "1em" }}></div>;
    }
    return <div key={index}>{line}</div>;
  };

  const descriptionLines = props.selectedSession.description
    ? props.selectedSession.description.split("\n")
    : "";

  let datetimeString = "";
  if (props.selectedSession.datetime) {
    datetimeString = props.selectedSession.datetime.substring(0, 10);
  }
  let editable = username === props.selectedSession.username;

  if (props.isLoading) return <div>Loading...</div>;
  return (
    <div key={keyValue} className="detail-overview-container">
      <div className="detail-overview-inner-container">
        <div className="session-info-container">
          {isEditingInfo && editable ? (
            <>
              <button className="delete-session-button" onClick={handleDelete}>
                Delete Session
              </button>
              <div>User: {props.selectedSession.username}</div>
              <input
                type="date"
                id="session-date"
                name="session-date"
                defaultValue={datetimeString}
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              ></input>
              <div className="text-area-container">
                <textarea
                  rows={3}
                  cols={40}
                  id="description"
                  defaultValue={props.selectedSession.description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></textarea>
                <button
                  onClick={handleSave}
                  className="update-description-button"
                >
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
                <b>User</b>: {props.selectedSession.username}
              </div>
              <div>
                <b>Date</b>: {formatDate(props.selectedSession.datetime)}
              </div>
              <div className="description-detail-container">
                {descriptionLines !== "" &&
                  descriptionLines
                    .slice(
                      0,
                      showFullDescription
                        ? descriptionLines.length
                        : maxLineCount
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
        {props.selectedSession.exercise_unit &&
        props.selectedSession.exercise_unit.length > 0
          ? props.selectedSession.exercise_unit.map(
              (exerciseUnit: any, key: number) => {
                return (
                  <ExerciseUnitDetail
                    key={key}
                    exerciseUnit={exerciseUnit}
                    editable={editable}
                  />
                );
              }
            )
          : editable
          ? ""
          : "No exercises yet"}
        {editable && (
          <div className="add-exercise-container">
            <select
              name="exercises"
              id="exercises"
              onChange={(event) => {
                setSelectedExercise(parseInt(event.target.value));
              }}
            >
              {props.exercises
                .sort(compareExerciseNames)
                .map((exercise: any, key: number) => {
                  return (
                    <option key={key} value={exercise.id}>
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
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onRetrieveSingleSession: (id: number, sessionList: any) => {
      dispatch(retrieveSingleSession(id, sessionList));
    },
    onRetrieveExercises: () => {
      dispatch(retrieveExercises());
    },
    onAddExerciseUnit: (data: any) => {
      dispatch(addExerciseUnit(data));
    },
    onDeleteSession: (id: number) => {
      dispatch(deleteSession(id));
    },
    onUpdateSession: (id: number, data: any) => {
      dispatch(updateSession(id, data));
    },
  };
};

const mapStateToProps = (state: any) => {
  return {
    selectedSession: state.sessions.selectedSession,
    isLoading: state.sessions.selectedSession.isLoading,
    exercises: state.exercises,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailOverview);
