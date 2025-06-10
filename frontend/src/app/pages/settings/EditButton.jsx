export function Button(props) {


    return (
        <button style={{backgroundColor: props.color}}>
            <p>{props.color}Edit</p>
        </button>
    )
}