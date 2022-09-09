import React from 'react'

export const List = (props) => {
    console.log(props);
  return (
    <div>
      <div>{props.phone}</div>
      <ul>
        <li>
            {props.name}
        </li>
        <li>
            {props.lname}
        </li>
      </ul>
    </div>
  );
}
