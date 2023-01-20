import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

type Props = {
    label: string;
    id: string;
}

function SuggestedSearch(props: Props): React.ReactElement {
    const {label, id} = props
    const [showSuggested, setShowSuggested] = useState(false)
    const [focused, setFocused] = useState(true)
    const [suggested, setSuggested] = useState([])
    const [val, setVal] = useState("")

    function onChangeSearch(e: any): void {
        setVal(e.target.value)
        setShowSuggested(true)
    }      

    function onClickOption(e: any): void {
        setVal(e.target.text)
    }

    function onMouseOver(e: any): void {
        e.preventDefault();
    }


    function SuggestionItem(item: string, key: number) {
        return <Dropdown.Item
                    onMouseOver={onMouseOver}
                    onClick={onClickOption}
                    key={key}
                >
                    {item}
                </Dropdown.Item>
    }

    useEffect(() => {
        if (showSuggested) {
            axios.get("https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=" + val)
                .then(res => {
                    setSuggested(res.data[1].map(SuggestionItem))
                })
                .catch(err => {
                    setSuggested([])
                })
        }
    }, [showSuggested, val])

    useEffect(() => {
        console.log(focused);
    }, [focused])

    return (
        <Form.Group 
            className="mb-3" 
            controlId={id}
            onFocus={() => {
                setFocused(true)
            }}
            onBlur={() => {
                setTimeout(()=> {
                    setFocused(false);
                    setShowSuggested(false);
                }, 200)
            }}
        >
            <Form.Label>{label}</Form.Label>
            <Form.Control 
                type="text" 
                placeholder= {label}
                onChange={onChangeSearch}
                value={val}
            />

            <Dropdown style={{display : showSuggested ? "inherit" : "none"}}>
                {suggested}
            </Dropdown>
        </Form.Group>
    )
}

export default SuggestedSearch