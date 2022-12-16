
import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import DOMPurify from "dompurify";
import featureArrow from '../../../../assets/svg/featureArrow.svg'

export default class ProTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndexAccord: 1,
      product: this.props.product,
      productDesc: this.props.product.description,
      cleanDescription: DOMPurify.sanitize(this.props.product.description, {
        USE_PROFILES: { html: true },
      })
    }
  }
  updateTabs = () => {
    // if (!this.state.product.features.length)
    // {
    //   this.setState({
    //     activeIndexAccord: null 
    //   })

    // }
    // else if(this.state.product.features.length && this.state.product.features[0].feature_title == '')
    // this.setState({
    //   activeIndexAccord: null 
    // })
  }

  componentDidUpdate() {
    if (this.props.product.handle !== this.state.product.handle) {
      this.setState({
        activeIndexAccord: 1,
        product: this.props.product,
        productDesc: this.props.product.description,
        cleanDescription: DOMPurify.sanitize(this.props.product.description, {
          USE_PROFILES: { html: true },
        })
      }, () => { this.updateTabs() })

    }
  }



  componentDidMount() {
    this.updateTabs()
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndexAccord } = this.state
    const newIndexAccord = activeIndexAccord === index ? -1 : index

    this.setState({ activeIndexAccord: newIndexAccord })
  }

  render() {
    const { activeIndexAccord, product } = this.state


    return (
      <Accordion>
        <Accordion.Title
          active={activeIndexAccord === 0}
          index={0}
          onClick={this.handleClick}
        >
          <div className="descriptionSpan"> DESCRIPTION</div>
          <Icon name={activeIndexAccord === 0 ? 'chevron up' : 'chevron down'} />
        </Accordion.Title>
        <Accordion.Content active={activeIndexAccord === 0}>
          <div className="description-content" dangerouslySetInnerHTML={{ __html: this.state.cleanDescription }} />
        </Accordion.Content>

        {/* <Accordion.Title
          active={activeIndexAccord === 1}
          index={1}
          onClick={this.handleClick}
        >
          Reviews
          <Icon name='chevron down' />
        </Accordion.Title>
        <Accordion.Content active={activeIndexAccord === 1}>
          <p>
            There are many breeds of dogs. Each breed varies in size and
            temperament. Owners often select a breed of dog that they find to be
            compatible with their own lifestyle and desires from a companion.
          </p>
        </Accordion.Content> */}

        <Accordion.Title
          active={activeIndexAccord === 1}
          index={1}
          onClick={this.handleClick}
        >
          <div className="specificationSpan">SPECIFICATION</div>
          <Icon name={activeIndexAccord === 1 ? 'chevron up' : 'chevron down'} />
        </Accordion.Title>
        <Accordion.Content active={activeIndexAccord === 1}>

          {
            product.features.map((feature, index) => {
              return (
                <>
                  {/* <p><span>{feature.feature_title}</span> {feature.feature_details} </p> */}
                  {
                    feature.feature_title ?
                      <div className="specifications">

                        <div className="featureTitle">
                          <img src={featureArrow} alt=''></img>   <span>{feature.feature_title}</span>
                        </div>
                        <div className="featureDetails" >
                          <span>{feature.feature_details}</span>
                        </div>

                      </div>
                      : null
                  }
                </>
              )

            })
          }

        </Accordion.Content>
      </Accordion>
    )
  }
}
