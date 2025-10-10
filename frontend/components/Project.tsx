import React, { useState } from "react";
import UpdateProjectForm from "./UpdateProjectForm";

export default function Project(props: {
	name: string;
	color: string;
}): React.ReactElement {

	const [isShown, setIsShown] = useState<boolean>(false);

	return (
		<>
			<div className="project">
				<p className="project-name" style={{ color: props.color }}>
					{props.name}
				</p>
				<button onClick={()=> setIsShown(true)}>Edit Project</button>
				{isShown && <UpdateProjectForm name={props.name} color={props.color}/>}
			</div>
		</>
	);
}
