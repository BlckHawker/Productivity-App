import React from "react";

export default function Project(props: { name: string, color: string }): React.ReactElement {
    return (
        <>
            <div className="project">
                <p className="project-name" style={{color: props.color}}>{props.name}</p>
                {/* <ul className="section-list"></ul> */}
            </div>
        </>
    );
};
