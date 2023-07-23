import './App.css';

import React, { type ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';

const App = () => {
  const [inputVideoSourceObjectURL, setInputVideoSourceObjectURL] = useState<string>();
  const inputVideoElementRef = useRef<HTMLVideoElement>(null);

  const handleInputVideoChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget }) => {
      if (!currentTarget.files?.length) {
        return setInputVideoSourceObjectURL('');
      }

      const firstFile = currentTarget.files[0];
      const url = URL.createObjectURL(firstFile);

      setInputVideoSourceObjectURL(url);
    },
    [setInputVideoSourceObjectURL]
  );

  useEffect(
    () => () => {
      inputVideoSourceObjectURL && URL.revokeObjectURL(inputVideoSourceObjectURL);
    },
    [inputVideoSourceObjectURL]
  );

  return (
    <div className="app">
      <div className="app__player-row">
        <div className="app__player app__player--input">
          <div className="app__video-box">
            <video className="app__video" controls={true} ref={inputVideoElementRef} src={inputVideoSourceObjectURL} />
          </div>
          <input onChange={handleInputVideoChange} type="file" />
        </div>
        <div className="app__player app__player--input">
          <div className="app__video-box"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
