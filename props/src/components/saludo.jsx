import React from 'react';

const Saludo = (props) => {
    return (
        <div>
            <h1>Hola {props.name}</h1>
        </div>
    )
}

export default Saludo;