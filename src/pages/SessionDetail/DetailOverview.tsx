import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import {
  deleteSession,
  retrieveSingleSession,
  updateSesssion,
} from "../../actions/sessions";
import { addExerciseUnit } from "../../actions/exerciseUnits";
import { retrieveExercises } from "../../actions/exercises";
import { connect, useSelector } from "react-redux";

const compareExerciseNames = (a: any, b: any) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
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
  const [date, setDate] = useState<string>("");
  const username = useSelector((state: any) => state.user.username);

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

  const handleUpdateDescription = () => {
    const data = {
      description: description,
    };
    props.onUpdateSession(Number(sessionId), data);
  };

  const handleUpdateDate = () => {
    // Setting time to noon as otherwise
    // the date is displayed as the day before
    const data = {
      datetime: date + "T12:00:00",
    };
    props.onUpdateSession(Number(sessionId), data);
  };

  let datetimeString = "";
  if (props.selectedSession.datetime) {
    datetimeString = props.selectedSession.datetime.substring(0, 10);
  }

  let editable = username === props.selectedSession.username;

  if (props.isLoading) return <div>Loading...</div>;
  return (
    <div key={keyValue} className="detail-overview-container">
      <div className="detail-overview-inner-container">
        {editable && (
          <button className="delete-session-button" onClick={handleDelete}>
            Delete Session
          </button>
        )}
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
        {editable && (
          <button className="update-date-button" onClick={handleUpdateDate}>
            Update Date
          </button>
        )}
        <div className="description-detail-container">
          <textarea
            rows={3}
            cols={40}
            id="description"
            defaultValue={props.selectedSession.description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          ></textarea>
          {editable && (
            <button
              onClick={handleUpdateDescription}
              className="update-description-button"
            >
              Update Description
            </button>
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
      dispatch(updateSesssion(id, data));
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
