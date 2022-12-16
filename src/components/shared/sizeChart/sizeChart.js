import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class sizeChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: props.sizeChart,
        }
    }

    render() {
        var colors = []
        for (var i = 0; i < this.state.table.length; i++) {
            colors.push({
                border_color: this.state.table[i].border_color,
                grid_bg_color: this.state.table[i].grid_bg_color,
                grid_header_color: this.state.table[i].grid_header_color,
                grid_text_color: this.state.table[i].grid_text_color,
                header_bg_color: this.state.table[i].header_bg_color,
            })
        }

        // console.log("Color Array", colors);
        // console.log("Table State", this.state.table);
        return (
            <div>
                <div>
                    {
                        this.state.table.map((sizechart, key) => (
                            <>

                                <h3 key={key}>{sizechart.title}  </h3>
                                <div>

                                    <Table celled style={{ borderColor: colors[key].border_color }}>

                                        {/* <Table.Header>
                                            <Table.Row>
                                                {
                                                    sizechart.chart.first_column_heading ?
                                                        <Table.HeaderCell>{}</Table.HeaderCell>
                                                        : null
                                                }
                                            </Table.Row>
                                        </Table.Header> */}

                                        <Table.Body style={{ backgroundColor: colors[key].grid_bg_color, color: colors[key].grid_text_color }}>
                                            {
                                                sizechart.chart.map((tablerows, index) => (
                                                    // console.log("Table Rows", sizechart),
                                                    <>
                                                        <Table.Row>
                                                            {
                                                                tablerows.values.map((tablecoloums, indexj) => (
                                                                    // console.log("Table Coloumns", tablecoloums),
                                                                    <Table.Cell className={indexj === 0 && (sizechart.first_column_heading || index === 0) && sizechart.first_row_heading ? 'bold' : ''} style={index === 0 ? { backgroundColor: colors[key].header_bg_color, color: colors[key].grid_header_color } : null} >{tablecoloums.column}</Table.Cell>
                                                                ))
                                                            }
                                                        </Table.Row>

                                                    </>
                                                ))
                                            }
                                        </Table.Body>
                                    </Table>
                                </div>
                            </>
                        ))
                    }

                </div>

            </div >
        )
    }
}
