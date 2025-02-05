//First of all lets create the function for creating DOM elements
function createElement(type, props = {}, ...children) { // We pass type for the tag, props for the parameters, and children for the items inside the tag
    return {type, props: { ...props, children} };
}

// Now lets create the function to render the content
function render(vdom, container) {
    if(typeof vdom === "string"){
        container.appendChild(document.createTextNode(vdom));
        return;
    }

    if(typeof vdom.type === "function") {
        return render(vdom.type(vdom.props), container);
    }

    const {type, props} = vdom;
    const node = document.createElement(type);

    Object.keys(props)
        .filter(key => key !== "children")
        .forEach(key => (node[key] = props[key]));

    props.children.forEach(child => render(child, node));
    container.appendChild(node);
}

//Now lets manage State (React without state isn't React)
let state;
function useState(initialValue) {
    state = state || initialValue;

    function setState(newValue) {
        state = newValue;
        rerender();
    }

    return [state, setState];
}

//Now lets create the function to re-render the app when state changes
function rerender() {
    document.getElementById("root").innerHTML = ""; //We clear the vdom
    render(App(), document.getElementById("root")); //we re-render
}

//Now lets write some code

function Counter() {
    const [count, setCount] = useState(0);

    return createElement(
        "div",
        {},
        createElement("h1", {}, `Count: ${count}`),
        createElement(
            "button",
            {onclick: () => setCount(count + 1) },
            "Increment"
        ),
        createElement(
            "button",
            {onclick: () => setCount(count - 1) },
            "Decrement"
        )
    );
}


// And now we add it to the app, and render it.
function App() {
    return createElement("div", {}, createElement(Counter));
}

const root = document.getElementById("root");
render(App(), root);