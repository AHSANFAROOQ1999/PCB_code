import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import SizeChart from '../sizeChart'

export default class sizeChartModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: props.sizeChart,
            open: false
        }
    }
    render() {
        return (
            <div>
                <Modal
                    onClose={() => this.setState({ open: false })}
                    onOpen={() => this.setState({ open: true })}
                    open={this.state.open}
                    trigger={<p className='view_size_chart'>View size chart</p>}
                >
                    <Modal.Header>Size Chart</Modal.Header>
                    <Modal.Content >
                        <SizeChart sizeChart={this.state.table} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={() => this.setState({ open: false })}>
                            Close
                        </Button>
                        {/* <Button
                            content="Yep, that's me"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => this.setState({ open: false })}
                            positive
                        /> */}
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}
