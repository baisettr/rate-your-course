React.createElement("table", {},
    React.createElement("tbody", {},
        React.createElement("tr", {},
            React.createElement("th", {},
                React.createElement("label", {}, "Term")
            ),
            React.createElement("th", {},
                React.createElement("label", {}, "Positives")
            ),
            React.createElement("th", {},
                React.createElement("label", {}, "Negatives")
            ),
            React.createElement("th", {},
                React.createElement("label", {}, "Links")
            ),
            React.createElement("th", {},
                React.createElement("label", {}, "Suggestions")
            ),
            React.createElement("th", {},
                React.createElement("label", {}, "Rating")
            ),
        ),
        React.createElement("tr", {},
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, number.courseTerm)
            ),
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, number.coursePros)
            ),
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, number.courseCons)
            ),
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, number.courseLinks)
            ),
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, number.courseTips)
            ),
            React.createElement("td", {},
                React.createElement("text", { className: 'text-display' }, stars)
            ),
        ),
    ),
)