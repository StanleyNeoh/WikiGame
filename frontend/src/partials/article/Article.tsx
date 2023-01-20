import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { journeyActions } from "../../store/slices/journeySlice";

type Props = {
    article: string
}

function Article(props: Props) {
    const { article } = props;
    const [ JSON, setJSON ] = useState({
        style: "",
        content: ""
    });
    const dispatch = useDispatch();

    function onClick(e: any) {
        e.preventDefault()
        console.log(e.target.href)
        if (!e.target.href.match("\/wiki\/")) {
            console.log("Invalid Link")
            return
        }
        dispatch(journeyActions.add(e.target.href.match("[^\/]*$")))
    }

    useEffect(() => {
        axios.get("http://localhost:8080/?site=https://en.wikipedia.org/wiki/" + article)
        .then(res => {
            setJSON(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [article])
    
    return  <Fragment>
                <Helmet>
                    <style>{JSON.style}</style>
                </Helmet>
                <div 
                    onClick={onClick}
                    id="wiki-content"
                    className="h-100 w-100 m-0 p-0" 
                    dangerouslySetInnerHTML={{__html: JSON.content}} 
                />
            </Fragment>
}

export default Article;