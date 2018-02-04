
var json = require('../views/courses.json');
console.log(json[0]);

class CourseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, { courses: props.courses });
    }
    render() {
        if (this.state.courses) {
            const numbers = this.state.courses;
            return (
                React.createElement("div", { className: 'container' },
                    React.createElement("div", { className: 'grid-container' },
                        this.state.courses.map((number) => {
                            return (React.createElement("div", { key: number.depC, className: 'grid-item' }, number.depC + " - " + number.dept,
                                number.courses.map((n) => {
                                    return (
                                        React.createElement("h6", { key: n.crsNr }, n.crsNme)
                                    )
                                }
                                )
                            )
                            )
                        }
                        )
                    )
                )
            );
        }
    }
}
const courses = json;
ReactDOM.render(
    React.createElement(CourseComponent, { courses: courses }),
    document.getElementById("hello")
);