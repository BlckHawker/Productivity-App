import React from "react";

export function Project(props: any): React.ReactElement {
    return (
        <>
            <div className="project">
                {/* <img>{props.icon}</img> */}
                <h1 className="project-name">{props.name}</h1>
                <ul className="section-list"></ul>
            </div>
        </>
    );
};
