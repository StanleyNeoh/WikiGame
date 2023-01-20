import { Fragment } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import SuggestedSearch from "../partials/suggestedSearch/SuggestedSeach";
import { endPointActions } from "../store/slices/endPointSlice";
import { gameStateActions } from "../store/slices/gameStateSlice";
import { journeyActions } from "../store/slices/journeySlice";
import { GameState } from "../types/types";

function EndPointForm(): React.ReactElement {
  const dispatch = useDispatch();

  function onSubmit(e: any): void {
    e.preventDefault()
    const start = e.target[0].value
    const end = e.target[1].value
    if (start === "" || end === "") return
    dispatch(journeyActions.addTitle(start));
    dispatch(endPointActions.setEndPoint({start, end}))
    dispatch(gameStateActions.setGameState(GameState.Running))
  }

  return (
      <Fragment>
        <Container>
          <Row>
            <h1>Welcome to Wiki Game</h1>
          </Row>
          <Row>
            <Form onSubmit={onSubmit}>
              <SuggestedSearch 
                label="Starting Article"
                id="start"
              />
              <SuggestedSearch 
                label="Ending Article"
                id="end"
              />
              <Button variant="primary" type="submit">
                Start
              </Button>
            </Form>
          </Row>
        </Container>
      </Fragment>
  );
}

export default EndPointForm