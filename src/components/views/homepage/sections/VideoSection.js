import React, { Component } from 'react'
import video from '../../../../assets/pcb-assets/videos/PCB _ Official Merchandise Store1.mp4'

export default class VideoSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
    }

    render() {
        // const { data } = this.state

        return (
            <div className=''>

                <video controls autoPlay width='100%' muted>
                    <source src={video} type="video/mp4" />
                </video>

            </div>
        )
    }
}
