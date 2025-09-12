import React from "react";

export function Project(props: object): React.ReactElement {
    return (
        <>
            <div className="project">
                {/* <img>{props.icon}</img> */}
                <h1 className="project-name" style="color:{props.color}">{props.name}</h1>
                <ul className="section-list"></ul>
            </div>
        </>
    );
};
