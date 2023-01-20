// Redux state types
export type TitleURL = {
    title: string;
    url: string;
}

export type JourneyState = {
    journeyTitles: string[];
    journeyURLs: string[];
}

export type EndPointState = {
    start: string;
    end: string;
}
export enum GameState {
    Start,
    Running,
    End,
}

export type State = {
    journey: JourneyState;
    endPoint: EndPointState;
    gameState: GameState;
}