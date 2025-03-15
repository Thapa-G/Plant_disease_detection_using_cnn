import React from 'react';

const Preprocessing_props = (props) => {
  const { image} = props;

  return (
    <div className={`w-32 h-32`}>
      
        <img src={image} alt={image} className='w-32 h-32 ' />
    </div>
  );
};

export default Preprocessing_props;