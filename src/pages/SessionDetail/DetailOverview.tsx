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

function DetailOverview(props: any) {
  let { sessionId } = useParams();
  const navigate = useNavigate();
  const sessionList = useSelector((state: any) => state.sessions.sessionList);

  const [selectedExercise, setSelectedExercise] = useState<number>(1);
  const [keyValue, setKeyValue] = useState<number>(0);
  const [description, setDescription] = useState<string>(
    props.selectedSession.description
  );
  const username = useSelector((state: any) => state.user.username);

  useEffect(() => {
    if (
      (!props.selectedSession.id ||
        props.selectedSession.id !== Number(sessionId)) &&
      !props.isLoading
    )
      props.onRetrieveSingleSession(Number(sessionId), sessionList);
    if (props.exercises.length === 0) props.onRetrieveExercises();
  }, [props.isLoading]);

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

  const compareExerciseNames = (a: any, b: any) => {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  };

  let date = new Date(props.selectedSession.datetime);

  let editable = username === props.selectedSession.username;

  if (props.isLoading) return <div>Loading...</div>;
  return (
    <div key={keyValue} className="detail-overview-container">
      <div className="detail-overview-inner-container">
        <label htmlFor="session-date" style={{ display: "block" }}>
          Session Date
        </label>
        <input type="date" id="session-date" name="session-date"></input>
        {props.selectedSession.username === username && (
          <button>Update Date [in progress]</button>
        )}
        {props.selectedSession.username === username && (
          <button className="delete-session-button" onClick={handleDelete}>
            Remove Session
          </button>
        )}
        <div>User: {props.selectedSession.username}</div>
        <div>
          <textarea
            rows={3}
            cols={40}
            id="description"
            defaultValue={props.selectedSession.description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          ></textarea>
          {props.selectedSession.username === username && (
            <button onClick={handleUpdateDescription}>
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
            <button onClick={handleAddExercise}>Add Exercise</button>
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
