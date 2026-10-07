import {useRef} from 'react';

export default function Example() {
  const inputRef = useRef(null);
  const handleInput = () => {
    console.log(inputRef)
  }
  return (
    <>
    <input type="text" ref={inputRef} />
    <button onClick={handleInput}>Click</button>
    </>

  )}