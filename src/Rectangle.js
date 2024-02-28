import React,{useEffect, useState} from 'react'
import './Rectangle.css'

const Rectangle = ({isRect,addRectCount,submenu}) => {
    const newRect = {
        initX: 0,
        initY: 0,
        width: 0,
        height: 0,
        clickCounter: 0,
        txt: ''
    }
    const rectStyle = {
    top:'40px',
    bottom:'0px',
    left:'0px',
    right:'0px',
    position:'absolute',
    border:'1px solid gray'
}
    const [rect, setRect] = useState([newRect])
    const [txt, setTxt] = useState('')
    const addRect = () => {
        const json = rect.filter((item,index)=>{
            return index!=0
        })
        console.log('RectangleData:-',JSON.stringify(json))
        setRect([...rect, newRect])
    }

    const clickRectHandle = (event) => {
        if (rect[rect.length - 1].clickCounter == 0 && isRect) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, clickCounter: item.clickCounter + 1, initX: event.screenX - 110, initY: event.screenY - 170 }
                }
                else {
                    return item
                }
            })
            setRect(newArr)
            return
        }
        if (rect[rect.length - 1].clickCounter <= 2) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, clickCounter: item.clickCounter + 1 }
                } else {
                    return item
                }
            })
            setRect(newArr)
        }
    }

    const mouseMoveRectHandle = (event) => {
        if (rect[rect.length - 1].clickCounter == 1 && isRect) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, width: event.screenX - (item.initX + 100), height: event.screenY - (item.initY + 160) }
                }
                else {
                    return item
                }
            })
            setRect(newArr)
        }
    }

    const submitHandle = () => {
        if (rect[rect.length - 1].clickCounter == 3) {
            const newArr = rect.map((item, index) => {
                if (index + 1 == rect.length) {
                    return { ...item, txt: txt, clickCounter: item.clickCounter + 1 }
                } else {
                    return item
                }
            })
            setRect(newArr)
        }
    }
    useEffect(()=>{
        addRect()
    },[addRectCount])
    return (
        <div style={rectStyle} onClick={(e) => { clickRectHandle(e) }} onMouseMove={(e) => { mouseMoveRectHandle(e) }}>
            {/* rectangle */}
            {rect.map((item, index) => {
                return (<div key={index} className={`rectangle ${item.width == 0 && item.height == 0 ? 'hide' : ''}`}
                    style={{ width: item.width, height: item.height, left: item.initX + 'px', top: item.initY + 'px', position: 'absolute' }} >

                    {item.clickCounter == 3 ? <div className='child1'>
                        {/* <input type='text' onChange={(e) => { setTxt(e.target.value) }} /> */}
                        <select onChange={(e)=>setTxt(e.target.value)}>
                        <option>Choose option</option>
                            <option value={'Person'}>Person</option>
                            <option value={'Dog'}>Dog</option>
                            <option value={'Car'}>Car</option>
                        </select>
                        <button onClick={() => submitHandle()} >Submit</button>
                    </div> : null}
                    {item.clickCounter == 4 ? <div className='child2'>{item.txt}</div> : null}

                </div>)
            })}
        </div>
    )
}

export default Rectangle



