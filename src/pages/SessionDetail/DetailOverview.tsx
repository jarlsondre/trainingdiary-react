import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import { deleteSession, retrieveSingleSession } from "../../actions/sessions";
import { addExerciseUnit } from "../../actions/exerciseUnits";
import { retrieveExercises } from "../../actions/exercises";
import { connect } from "react-redux";

function DetailOverview(props: any) {
  let { sessionId } = useParams();
  const navigate = useNavigate();

  const [selectedExercise, setSelectedExercise] = useState<number>(1);
  const [keyValue, setKeyValue] = useState<number>(0);

  useEffect(() => {
    if (
      (!props.selectedSession.id ||
        props.selectedSession.id !== Number(sessionId)) &&
      !props.isLoading
    )
      props.onRetrieveSingleSession(Number(sessionId));
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

  let date = new Date(props.selectedSession.datetime);

  if (props.isLoading) return <div>Loading...</div>;
  return (
    <div key={keyValue} className="detail-overview-container">
      <div className="detail-overview-inner-container">
        <label htmlFor="session-date" style={{ display: "block" }}>
          Session Date
        </label>
        <input
          type="date"
          id="session-date"
          name="session-date"
          value={date.toISOString().split("T")[0]}
        ></input>
        <button className="delete-session-button" onClick={handleDelete}>
          Remove Session
        </button>
        {props.selectedSession.exercise_unit &&
          props.selectedSession.exercise_unit.map(
            (exerciseUnit: any, key: number) => {
              return (
                <ExerciseUnitDetail key={key} exerciseUnit={exerciseUnit} />
              );
            }
          )}
        <div className="add-exercise-container">
          <select
            name="exercises"
            id="exercises"
            onChange={(event) => {
              setSelectedExercise(parseInt(event.target.value));
            }}
          >
            {props.exercises.map((exercise: any, key: number) => {
              return (
                <option key={key} value={exercise.id}>
                  {exercise.name}
                </option>
              );
            })}
          </select>
          <button onClick={handleAddExercise}>Add Exercise</button>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onRetrieveSingleSession: (id: number) => {
      dispatch(retrieveSingleSession(id));
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
  };
};

const mapStateToProps = (state: any) => {
  return {
    selectedSession: state.sessions.selectedSession,
    isLoading: state.sessions.selectedSession.isLoading,
    exercises: state.exercises,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailOverview);
