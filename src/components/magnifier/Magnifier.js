import React from 'react'
import Magnifier from 'react-magnifier'

const MagnifierComp = ({url}) => {
  return (
    <div style={{height:'100%',overflow:'hidden'}}>
        <Magnifier src={url} />
    </div>
  )
}

export default MagnifierComp