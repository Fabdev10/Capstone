import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const ToggleIcon = (
    <FontAwesomeIcon
      icon={visible ? faEyeSlash : faEye}
      onClick={() => setVisible((prev) => !prev)}
      style={{ cursor: 'pointer' }}
    />
  );

  return [visible ? 'text' : 'password', ToggleIcon];
};

export default usePasswordToggle;
