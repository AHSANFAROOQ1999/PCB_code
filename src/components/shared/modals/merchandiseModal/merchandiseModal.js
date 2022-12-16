import React, { useState } from 'react'
import { Image, Modal } from 'semantic-ui-react'
import ModalImg from '../../../../assets/pcb-assets/mobile_assets/Modal_Img1.jpg';

import './merchandiseModal.scss'

function MerchandiseModal() {

    const [open, setOpen] = useState(true)

    return (
        <>
            {window.location.pathname !== '/' ? <div className='popup'>

                <Modal
                    closeIcon
                    onClose={() => setOpen(false)}
                    open={open}
                >
                    <Modal.Content image>
                        <Image size='large' src={ModalImg} wrapped />
                    </Modal.Content>
                </Modal>
            </div>
                : null}
        </>
    )
}

export default MerchandiseModal