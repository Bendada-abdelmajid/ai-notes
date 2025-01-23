import React from 'react'
import randomColor from "randomcolor"

type Props = {
    baseColor?: string;
    setBaseColor: React.Dispatch<React.SetStateAction<string>>;
    setOpenThemes: React.Dispatch<React.SetStateAction<boolean>>
    openThemes: boolean;
}

const bgs = randomColor({
    count: 10,
    luminosity: 'light',
    format: 'rgba',
    alpha: 0.5
})
function Thems({ baseColor, setBaseColor, openThemes, setOpenThemes }: Props) {
    return (
        <div className={`thems-cont ${openThemes ? "open" : ""}`}>
            <button onClick={()=>setOpenThemes(false)} className='close-btn'></button>
            <div className='thems'>
                {bgs.map(bg => (
                    <button style={{ background: bg }} onClick={() => setBaseColor(bg)} key={bg} className='them-card'>

                    </button>
                ))}
            </div>
        </div>
    )
}

export default Thems