import { Row, Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import Article from "../partials/article/Article";
import { State } from "../types/types"

function Journey() {
    const { journeyTitles, journeyURLs } = useSelector((state: State) => state.journey);
    const article = journeyURLs[journeyURLs.length - 1]
    const historyElems = journeyTitles.map((x, i) => (
            <Row className='p-1 m-1 bg-secondary fs-6' key={i}>
                <Col xs={1}>{'(' + i + ')'}</Col>
                <Col className='text-center'>{x}</Col>
            </Row>
        ))
    return (
        <Row className="h-100 w-100">
            <Col className="h-100 fw-bolder text-white bg-dark position-fixed" xs={2}>
                <Row className="p-1 fs-6 justify-content-center">Journey</Row>
                { historyElems }
            </Col>
            <Col xs={{offset: 1, span: 11}} className="p-0">
                <Article article={article} />
            </Col>
            
        </Row>
    )
}

export default Journey;